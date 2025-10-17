"use client";

import { useState, useEffect } from "react";
import { DisasterCard } from "@/components/ui/disaster-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import ReliefDonationAbi from "@/abis/ReliefDonation.json";
import deployment from "@/contracts/deployment.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Disaster {
  id: string;
  title: string;
  location: string;
  description: string;
  date?: string;
  status: "active" | "completed";
  fundsRaised?: number;
  fundGoal?: number;
}

export default function DashboardPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [donationAmounts, setDonationAmounts] = useState<Record<string, string>>({});
  const [donationMessages, setDonationMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    fetchWalletInfo();
    fetchCampaigns();
  }, []);

  const fetchWalletInfo = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setWalletAddress(address);
      setWalletBalance(ethers.formatEther(balance));

      console.log("Wallet connected:", address);
      console.log("Balance:", ethers.formatEther(balance), "ETH");
    } catch (err) {
      console.error("Error fetching wallet info:", err);
    }
  };

  const fetchCampaigns = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        provider
      );

      // Use campaignCounter instead of totalCampaigns
      const campaignCounter = await reliefContract.campaignCounter();
      const totalCampaigns = Number(campaignCounter);
      
      console.log("Total campaigns:", totalCampaigns);

      const campaigns: Disaster[] = [];

      // Campaign IDs start from 1, not 0
      for (let i = 1; i <= totalCampaigns; i++) {
        try {
          const campaign = await reliefContract.campaigns(i);
          
          console.log(`Campaign ${i}:`, {
            id: campaign.id.toString(),
            name: campaign.name,
            isVerified: campaign.isVerified,
            isActive: campaign.isActive,
          });
          
          campaigns.push({
            id: campaign.id.toString(),
            title: campaign.name,
            description: campaign.description,
            status: campaign.isActive && campaign.isVerified ? "active" : "completed",
            fundsRaised: parseFloat(ethers.formatEther(campaign.raisedAmount)),
            fundGoal: parseFloat(ethers.formatEther(campaign.targetAmount)),
            location: campaign.isVerified ? "✓ Verified" : "⚠ Not Verified",
            date: new Date(Number(campaign.startTime) * 1000).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          });
        } catch (err) {
          console.error(`Error fetching campaign ${i}:`, err);
        }
      }

      console.log("Fetched campaigns:", campaigns);
      setDisasters(campaigns);
    } catch (err) {
      console.error("Blockchain fetch error:", err);
    }
  };

  const handleDonate = async (disasterId: string) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      
      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      const amount = donationAmounts[disasterId];
      if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid donation amount");
        return;
      }

      const valueInWei = ethers.parseEther(amount);
      const message = donationMessages[disasterId]?.trim() || "Thank you for your support!";

      console.log("Donating:", amount, "ETH to campaign", disasterId);
      
      const tx = await reliefContract.donate(disasterId, message, { value: valueInWei });
      alert(`Transaction submitted!\nHash: ${tx.hash}`);

      await tx.wait();
      alert(`Donation successful! 🎉`);

      setDonationAmounts((prev) => ({ ...prev, [disasterId]: "" }));
      setDonationMessages((prev) => ({ ...prev, [disasterId]: "" }));
      
      await fetchWalletInfo();
      await fetchCampaigns();
    } catch (err: any) {
      console.error("Donation error:", err);
      alert(`Donation failed: ${err.reason || err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const grantNGORole = async () => {
    try {
      if (!window.ethereum || !walletAddress) {
        alert("Please connect your wallet first!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      const NGO_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NGO_ROLE"));
      
      console.log("Granting NGO_ROLE to:", walletAddress);
      const tx = await reliefContract.grantRole(NGO_ROLE, walletAddress);
      
      alert(`Transaction submitted!\nHash: ${tx.hash}`);
      await tx.wait();
      
      alert("NGO role granted! ✅");
    } catch (err: any) {
      console.error("Error granting role:", err);
      alert(`Failed: ${err.reason || err.message}`);
    }
  };

  const grantVerifierRole = async () => {
    try {
      if (!window.ethereum || !walletAddress) {
        alert("Please connect your wallet first!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
      
      console.log("Granting VERIFIER_ROLE to:", walletAddress);
      const tx = await reliefContract.grantRole(VERIFIER_ROLE, walletAddress);
      
      alert(`Transaction submitted!\nHash: ${tx.hash}`);
      await tx.wait();
      
      alert("Verifier role granted! ✅");
    } catch (err: any) {
      console.error("Error granting role:", err);
      alert(`Failed: ${err.reason || err.message}`);
    }
  };

  const createCampaignOnChain = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      const NGO_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NGO_ROLE"));
      const hasRole = await reliefContract.hasRole(NGO_ROLE, address);
      
      if (!hasRole) {
        alert("You need NGO role! Click 'Grant NGO Role' first.");
        return;
      }

      const name = "Earthquake Relief Fund";
      const description = "Emergency relief for earthquake victims in affected areas";
      const targetAmount = ethers.parseEther("1.0");
      const duration = 30 * 24 * 60 * 60;
      const ipfsMetadata = "";
      const milestones = [25, 50, 75, 100];

      const tx = await reliefContract.createCampaign(
        name,
        description,
        targetAmount,
        duration,
        ipfsMetadata,
        milestones
      );

      alert(`Transaction submitted!\nHash: ${tx.hash}`);
      await tx.wait();
      alert(`Campaign created! 🎉\n\nNow verify it to make it active.`);
      
      await fetchCampaigns();
    } catch (err: any) {
      console.error("Error creating campaign:", err);
      alert(`Failed: ${err.reason || err.message}`);
    }
  };

  const verifyCampaign = async (campaignId: string) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
      const hasRole = await reliefContract.hasRole(VERIFIER_ROLE, address);
      
      if (!hasRole) {
        alert("You need Verifier role! Click 'Grant Verifier Role' first.");
        return;
      }

      const tx = await reliefContract.verifyCampaign(campaignId);
      alert(`Transaction submitted!\nHash: ${tx.hash}`);
      
      await tx.wait();
      alert(`Campaign verified! ✅`);
      
      await fetchCampaigns();
    } catch (err: any) {
      console.error("Error verifying campaign:", err);
      alert(`Failed: ${err.reason || err.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Wallet Info */}
          <div className="mb-6 p-4 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Wallet</p>
                <p className="font-mono text-xs">{walletAddress || "Not connected"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-lg font-bold">{parseFloat(walletBalance).toFixed(4)} ETH</p>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-3">Admin Panel</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={grantNGORole} size="sm">Grant NGO Role</Button>
              <Button onClick={grantVerifierRole} size="sm">Grant Verifier Role</Button>
              <Button onClick={createCampaignOnChain} size="sm" variant="secondary">
                Create Campaign
              </Button>
              <Button 
                onClick={() => {
                  const id = prompt("Enter campaign ID to verify:");
                  if (id) verifyCampaign(id);
                }} 
                size="sm" 
                variant="secondary"
              >
                Verify Campaign
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Active Disaster Campaigns</h1>
            <p className="text-muted-foreground">
              {disasters.length} campaign(s) • Only verified campaigns accept donations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {disasters.map((disaster) => {
              const progress = disaster.fundGoal
                ? Math.min((disaster.fundsRaised! / disaster.fundGoal) * 100, 100)
                : 0;

              return (
                  <DisasterCard
                    {...disaster}
                    date={disaster.date || "Unknown"} // ensure it's always a string
                    onDonate={() => handleDonate(disaster.id)}
                  >
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {disaster.fundsRaised?.toFixed(4)} / {disaster.fundGoal?.toFixed(4)} ETH ({progress.toFixed(1)}%)
                    </p>

                    {disaster.status === "active" && disaster.location.includes("Verified") && (
                      <>
                        <Input
                          type="text"
                          placeholder="Message (optional)"
                          value={donationMessages[disaster.id] || ""}
                          onChange={(e) =>
                            setDonationMessages((prev) => ({
                              ...prev,
                              [disaster.id]: e.target.value,
                            }))
                          }
                          maxLength={200}
                          disabled={loading}
                        />

                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount (ETH)"
                            value={donationAmounts[disaster.id] || ""}
                            onChange={(e) =>
                              setDonationAmounts((prev) => ({
                                ...prev,
                                [disaster.id]: e.target.value,
                              }))
                            }
                            min="0.0001"
                            step="0.001"
                            disabled={loading}
                          />
                          <Button
                            onClick={() => handleDonate(disaster.id)}
                            disabled={loading || !donationAmounts[disaster.id]}
                            className="min-w-[100px]"
                          >
                            {loading ? "Processing..." : "Donate"}
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {!disaster.location.includes("Verified") && (
                      <Button
                        onClick={() => verifyCampaign(disaster.id)}
                        variant="outline"
                        size="sm"
                      >
                        Verify Campaign
                      </Button>
                    )}
                  </div>
                </DisasterCard>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}