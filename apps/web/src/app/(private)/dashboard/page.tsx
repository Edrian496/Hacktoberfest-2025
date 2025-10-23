"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { DisasterCard } from "@/components/ui/disaster-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import ReliefDonationAbi from "@/abis/ReliefDonation.json";
import deployment from "@/contracts/deployment.json";

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
  // Router for navigation
  const router = useRouter();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  // Campaign state
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [donationAmounts, setDonationAmounts] = useState<Record<string, string>>({});
  const [donationMessages, setDonationMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Wallet state
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session || !session.user) {
          router.replace("/login");
          return;
        }

        setUserEmail(session.user.email || "");
        setIsAuthenticated(true);
        setLoadingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Fetch wallet and campaigns after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletInfo();
      fetchCampaigns();
    }
  }, [isAuthenticated]);

  const fetchWalletInfo = async () => {
    if (!window.ethereum) {
      console.log("MetaMask not installed");
      return;
    }

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
    if (!window.ethereum) {
      console.log("MetaMask not installed");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const reliefContract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        provider
      );

      const campaignCounter = await reliefContract.campaignCounter();
      const totalCampaigns = Number(campaignCounter);

      console.log("Total campaigns:", totalCampaigns);
      const campaigns: Disaster[] = [];

      for (let i = 1; i <= totalCampaigns; i++) {
        try {
          const campaign = await reliefContract.campaigns(i);

          console.log(`Campaign ${i}:`, {
            id: campaign.id.toString(),
            name: campaign.name,
            isVerified: campaign.isVerified,
            isActive: campaign.isActive,
          });

          // Only show verified and active campaigns to regular users
          if (campaign.isVerified && campaign.isActive) {
            campaigns.push({
              id: campaign.id.toString(),
              title: campaign.name,
              description: campaign.description,
              status: "active",
              fundsRaised: parseFloat(ethers.formatEther(campaign.raisedAmount)),
              fundGoal: parseFloat(ethers.formatEther(campaign.targetAmount)),
              location: "✓ Verified Campaign",
              date: new Date(Number(campaign.startTime) * 1000).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
            });
          }
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading state
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with user info and logout */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary)]">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Logged in as: {userEmail}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Wallet Info */}
          <div className="mb-6 p-4 bg-[rgba(0,167,238,0.10)] rounded-lg border border-[var(--secondary)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--secondary)] mb-1">Wallet</h2>
                <p className="font-mono text-sm">{walletAddress || "Not connected"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--secondary)] mb-1">Balance</p>
                <p className="text-xl font-bold">{parseFloat(walletBalance).toFixed(4)} ETH</p>
              </div>
            </div>
            {!walletAddress && (
              <Button onClick={fetchWalletInfo} className="mt-4 w-full">
                Connect Wallet
              </Button>
            )}
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-4xl text-[var(--secondary)] font-bold">Active Disaster Campaigns</h2>
            <p className="text-muted-foreground">
              {disasters.length} verified campaign(s) available for donations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {disasters.map((disaster) => {
              const progress = disaster.fundGoal
                ? Math.min((disaster.fundsRaised! / disaster.fundGoal) * 100, 100)
                : 0;

              return (
                <DisasterCard
                  key={disaster.id}
                  {...disaster}
                  date={disaster.date || "Unknown"}
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
                  </div>
                </DisasterCard>
              );
            })}
          </div>

          {disasters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active campaigns available at the moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}