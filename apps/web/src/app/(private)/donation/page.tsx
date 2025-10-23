"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Copy, Wallet } from "lucide-react";

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
  txHash: string;
  fullTxHash: string;
  status: string;
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    setWalletConnected(true);
  };

  // Fetch donations from blockchain
  const fetchDonations = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        disaster: `Campaign #${r.campaignId}`,
        type: r.type || "Money",
        amount: ethers.formatEther(r.amount),
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 h-12 bg-gradient-to-r from-[var(--secondary)] to-blue-500 bg-clip-text text-transparent">
                My Donations
              </h1>
              <p className="text-muted-foreground">
                View your donation history and track them on the blockchain
              </p>
            </div>
            {walletConnected && (
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg">
                <Wallet className="w-4 h-4 text-secondary" />
                <span className="text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>

          {!walletConnected ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Wallet className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Connect your wallet to view your donation history and receipts
                </p>
                <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your donations...</p>
                </div>
              </CardContent>
            </Card>
          ) : donations.length === 0 ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Donations Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Start making a difference by donating to disaster relief campaigns
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Donation History ({donations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Donation ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Campaign
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Type
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Amount
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Transaction Hash
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.map((donation) => (
                        <TableRow key={donation.donationId} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">
                            #{donation.donationId}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {donation.disaster}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {donation.date}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {donation.type}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            {parseFloat(donation.amount).toFixed(4)} ETH
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://etherscan.io/tx/${donation.fullTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              >
                                {donation.txHash}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(donation.fullTxHash)}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {copiedHash === donation.fullTxHash && (
                                <span className="text-xs text-green-600 font-medium">
                                  Copied!
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              {donation.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}