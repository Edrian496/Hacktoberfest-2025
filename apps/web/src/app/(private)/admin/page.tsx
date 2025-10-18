"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Users } from "lucide-react";
import { DisasterCard } from "@/components/ui/disaster-card";
import { CreateCampaignModal } from "@/components/ui/create-campaign-modal";
import { ethers } from "ethers";
import { Disaster } from "@/types/Disaster";
import ReliefDonationAbi from "@/abis/ReliefDonation.json";
import deployment from "@/contracts/deployment.json";

export default function AdminDashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProviderAndSigner = async () => {
    if (!window.ethereum) throw new Error("Ethereum wallet not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const fetchWalletInfo = async () => {
    try {
      const { provider, signer } = await getProviderAndSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setWalletAddress(address);
      setWalletBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching wallet info:", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { provider } = await getProviderAndSigner();
      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        provider
      );

      const campaignCounter = await reliefContract.campaignCounter();
      const campaigns: Disaster[] = [];

      for (let i = 1; i <= Number(campaignCounter); i++) {
        const campaign = await reliefContract.campaigns(i);
        if (campaign.isDeleted) continue;

        campaigns.push({
          id: campaign.id.toString(),
          title: campaign.name,
          description: campaign.description,
          status: campaign.isActive ? "active" : "completed",
          isVerified: campaign.isVerified,
          fundsRaised: parseFloat(ethers.formatEther(campaign.raisedAmount)),
          fundGoal: parseFloat(ethers.formatEther(campaign.targetAmount)),
          location: "",
          date: new Date(Number(campaign.startTime) * 1000).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric" }
          ),
        });
      }

      setDisasters(campaigns);
    } catch (err) {
      console.error("Blockchain fetch error:", err);
    }
  };

  const verifyCampaign = async (campaignId: string) => {
    try {
      const { signer } = await getProviderAndSigner();
      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );
      const tx = await reliefContract.verifyCampaign(campaignId);
      await tx.wait();
      alert("Campaign verified!");
      await fetchCampaigns();
    } catch (err: any) {
      console.error(err);
      alert(`Failed: ${err.reason || err.message}`);
    }
  };

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchWalletInfo();
    fetchCampaigns();
  }, []);

  const totalCampaigns = disasters.length;
  const totalFundsRaised = disasters.reduce(
    (sum, campaign) => sum + (campaign.fundsRaised || 0),
    0
  );
  const totalDonors = disasters.length * 50;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage disaster campaigns and monitor donations</p>

        <div className="mb-6 flex gap-2">

          <CreateCampaignModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCampaignCreated={fetchCampaigns}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg"><Heart className="w-5 h-5 text-red-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCampaigns}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Funds Raised</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalFundsRaised.toFixed(4)} ETH</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Donors</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalDonors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Disaster campaigns */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader className="flex justify-between border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">All Disaster Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {disasters.map((disaster) => (
                <DisasterCard
                  key={disaster.id}
                  {...disaster}
                  showDonateButton={false}
                >
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            disaster.fundGoal
                              ? Math.min((disaster.fundsRaised! / disaster.fundGoal) * 100, 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {disaster.fundsRaised?.toFixed(4)} / {disaster.fundGoal?.toFixed(4)} ETH
                    </p>
                    {!disaster.isVerified && (
                      <Button
                        onClick={() => verifyCampaign(disaster.id)}
                        variant="default"
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        ✓ Verify Campaign
                      </Button>
                    )}
                  </div>
                </DisasterCard>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
