"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { ethers } from "ethers";
import ReliefDonationAbi from "@/abis/ReliefDonation.json";
import deployment from "@/contracts/deployment.json";
import { Disaster } from "@/types/Disaster";

export interface CampaignFormData {
  name: string;
  description: string;
  targetAmount: string;
  duration: string;
  ipfsMetadata: string;
  milestones: string;
}

export interface CreateCampaignModalProps {
  onCampaignCreated?: () => void | Promise<void>;
  open?: boolean;
  onClose?: () => void;
  campaign?: Disaster | null; // null = create, object = edit
}

export function CreateCampaignModal({
  onCampaignCreated,
  open: parentOpen,
  onClose,
  campaign,
}: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    targetAmount: "",
    duration: "",
    ipfsMetadata: "",
    milestones: "25,50,75,100",
  });

  // Update form when editing a campaign
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.title,
        description: campaign.description,
        targetAmount: campaign.fundGoal?.toString() || "",
        duration: "30", // you can customize if campaign has duration
        ipfsMetadata: "",
        milestones: "25,50,75,100",
      });
      setOpen(true);
    } else {
      setFormData({
        name: "",
        description: "",
        targetAmount: "",
        duration: "",
        ipfsMetadata: "",
        milestones: "25,50,75,100",
      });
    }
  }, [campaign]);

  useEffect(() => {
    if (parentOpen !== undefined) setOpen(parentOpen);
  }, [parentOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.description || !formData.targetAmount || !formData.duration) {
    alert("Please fill in all required fields");
    return;
  }

  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  setLoading(true);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const reliefContract = new ethers.Contract(
      deployment.contracts.ReliefDonation,
      ReliefDonationAbi.abi,
      signer
    );

    // Check NGO role
    const NGO_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NGO_ROLE"));
    const hasRole = await reliefContract.hasRole(NGO_ROLE, address);
    console.log("Has NGO Role:", hasRole, "Address:", address);
    
    if (!hasRole) {
      alert("You need NGO role to create or edit campaigns!");
      setLoading(false);
      return;
    }

    // Milestones parsing
    const milestonesArray = formData.milestones
      .split(",")
      .map((m) => parseInt(m.trim()))
      .filter((m) => !isNaN(m));

    if (milestonesArray.length === 0) {
      alert("Please enter valid milestones (e.g., 25,50,75,100)");
      setLoading(false);
      return;
    }

    const targetAmountWei = ethers.parseEther(formData.targetAmount);
    const durationSeconds = parseInt(formData.duration) * 24 * 60 * 60;

    console.log("Submitting with:", {
      name: formData.name,
      description: formData.description,
      targetAmount: targetAmountWei.toString(),
      duration: durationSeconds,
      milestones: milestonesArray,
    });

    let tx;
    if (campaign) {
      // EDIT mode - verify campaign first
      const campaignData = await reliefContract.campaigns(campaign.id);
      console.log("Campaign to edit:", campaignData);
      
      if (campaignData.id === 0n) {
        alert("Campaign does not exist!");
        setLoading(false);
        return;
      }
      
      if (!campaignData.isActive) {
        alert("Campaign is not active!");
        setLoading(false);
        return;
      }

      // Try to estimate gas first to catch errors early
      try {
        const gasEstimate = await reliefContract.updateCampaign.estimateGas(
          campaign.id,
          formData.name,
          formData.description,
          targetAmountWei,
          durationSeconds,
          formData.ipfsMetadata || "",
          milestonesArray
        );
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (estimateError: any) {
        console.error("Gas estimation failed:", estimateError);
        alert(`Transaction will fail: ${estimateError.reason || estimateError.message}`);
        setLoading(false);
        return;
      }

      tx = await reliefContract.updateCampaign(
        campaign.id,
        formData.name,
        formData.description,
        targetAmountWei,
        durationSeconds,
        formData.ipfsMetadata || "",
        milestonesArray,
        { gasLimit: 500_000 }
      );
      console.log("Update transaction submitted:", tx.hash);
    } else {
      // CREATE mode
      try {
        const gasEstimate = await reliefContract.createCampaign.estimateGas(
          formData.name,
          formData.description,
          targetAmountWei,
          durationSeconds,
          formData.ipfsMetadata || "",
          milestonesArray
        );
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (estimateError: any) {
        console.error("Gas estimation failed:", estimateError);
        alert(`Transaction will fail: ${estimateError.reason || estimateError.message}`);
        setLoading(false);
        return;
      }

      tx = await reliefContract.createCampaign(
        formData.name,
        formData.description,
        targetAmountWei,
        durationSeconds,
        formData.ipfsMetadata || "",
        milestonesArray,
        { gasLimit: 500_000 }
      );
      console.log("Create transaction submitted:", tx.hash);
    }

    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);
    
    if (receipt.status === 0) {
      throw new Error("Transaction failed on-chain");
    }

    alert(`Campaign ${campaign ? "updated" : "created"} successfully! 🎉`);

    // Reset form and close modal
    setFormData({
      name: "",
      description: "",
      targetAmount: "",
      duration: "",
      ipfsMetadata: "",
      milestones: "25,50,75,100",
    });
    setOpen(false);

    if (onCampaignCreated) await onCampaignCreated();
  } catch (err: any) {
    console.error("Full error:", err);
    
    // Extract more useful error information
    let errorMessage = "Unknown error";
    
    if (err.reason) {
      errorMessage = err.reason;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    if (err.data?.message) {
      errorMessage += `\nDetails: ${err.data.message}`;
    }
    
    alert(`Failed: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};



  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val && onClose) onClose(); }}>
      {!campaign && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{campaign ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
          <DialogDescription>
            {campaign ? "Edit the campaign details below." : "All fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={loading} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} disabled={loading} required rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="targetAmount">Target Amount (ETH) <span className="text-red-500">*</span></Label>
                <Input id="targetAmount" name="targetAmount" type="number" value={formData.targetAmount} onChange={handleInputChange} disabled={loading} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (Days) <span className="text-red-500">*</span></Label>
                <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleInputChange} disabled={loading} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestones">Milestones (%) <span className="text-red-500">*</span></Label>
              <Input id="milestones" name="milestones" value={formData.milestones} onChange={handleInputChange} disabled={loading} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ipfsMetadata">IPFS Metadata (Optional)</Label>
              <Input id="ipfsMetadata" name="ipfsMetadata" value={formData.ipfsMetadata} onChange={handleInputChange} disabled={loading} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setOpen(false); if (onClose) onClose(); }} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? (campaign ? "Updating..." : "Creating...") : (campaign ? "Update Campaign" : "Create Campaign")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
