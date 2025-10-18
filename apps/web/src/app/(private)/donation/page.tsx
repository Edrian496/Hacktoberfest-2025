"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";

import ReliefDonationArtifact from "@/abis/ReliefDonation.json"; 
import DonationNFTArtifact from "@/abis/DonationNFT.json"; 
import deployment from "@/contracts/deployment.json";

// Type for each donation
type Donation = {
  donationId: string;
  campaignId: string;
  date: string;
  disaster: string;
  type: string;
  amount: string;
  barangay: string;
  txHash: string;
  fullTxHash: string;
  status: string;
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletConnected(true);
  };

  // Create contract instances
  const getContracts = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const reliefContract = new ethers.Contract(
      deployment.contracts.ReliefDonation,
      ReliefDonationArtifact.abi, // Use only .abi
      signer
    );

    const donationNFT = new ethers.Contract(
      deployment.contracts.DonationNFT,
      DonationNFTArtifact.abi, // Use only .abi
      signer
    );

    return { reliefContract, donationNFT, signer };
  };

  // Fetch donations from blockchain
 const fetchDonations = async () => {
  setLoading(true);
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // correct signer
    const address = await signer.getAddress();

    const reliefContract = new ethers.Contract(
      deployment.contracts.ReliefDonation,
      ReliefDonationArtifact.abi,
      signer
    );

    const receipts = await reliefContract.getDonorReceipts(address);

    const formatted: Donation[] = receipts.map((r: any) => ({
      donationId: r.donationId.toString(),
      campaignId: r.campaignId.toString(),
      date: new Date(Number(r.timestamp) * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      disaster: `Campaign #${r.campaignId}`,
      type: r.type || "Money",
      amount: ethers.formatEther(r.amount),
      barangay: r.barangay || "Unknown",
      txHash: "0x" + r.receiptHash.slice(2, 10),
      fullTxHash: r.receiptHash,
      status: "Verified",
    }));

    setDonations(formatted);
  } catch (err) {
    console.error("Error fetching donations:", err);
  }
  setLoading(false);
};


  useEffect(() => {
    if (walletConnected) fetchDonations();
  }, [walletConnected]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
             <h1 className="text-4xl font-bold mb-2 h-12 bg-gradient-to-r from-[var(--secondary)] to-blue-500 bg-clip-text text-transparent">
              My Donations</h1>
            <p className="text-muted-foreground">
              View your donation history and track them on the blockchain
            </p>
          </div>

          {!walletConnected ? (
            <div className="text-center py-12">
              <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
                Connect Wallet
              </Button>
            </div>
          ) : loading ? (
            <p>Loading donations...</p>
          ) : donations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No donations yet</p>
              <Button className="bg-primary hover:bg-primary/90">
                Make Your First Donation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map((donation) => (
                <Card key={donation.donationId}>
                  <CardHeader>
                    <CardTitle>Donation #{donation.donationId}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Date:</strong> {donation.date}</p>
                    <p><strong>Disaster:</strong> {donation.disaster}</p>
                    <p><strong>Type:</strong> {donation.type}</p>
                    <p><strong>Amount:</strong> {donation.amount} ETH</p>
                    <p><strong>Barangay:</strong> {donation.barangay}</p>
                    <p>
                      <strong>Tx Hash:</strong>{" "}
                      <a
                        href={`https://etherscan.io/tx/${donation.fullTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {donation.txHash}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(donation.fullTxHash)}
                        className="ml-2 h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      {copiedHash === donation.fullTxHash && (
                        <span className="text-xs text-secondary ml-1">Copied!</span>
                      )}
                    </p>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                      {donation.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
