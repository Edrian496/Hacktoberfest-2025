"use client";

import { useState } from "react";
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
import { ExternalLink, Copy } from "lucide-react";

export default function DonationsPage() {
  const [currentPage, setCurrentPage] = useState("donations");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    console.log("Navigating to:", page);
  };

  const donations = [
    {
      id: "1",
      date: "October 4, 2025",
      disaster: "7.8 Magnitude Earthquake - Northern Region",
      type: "Money",
      amount: "$500",
      barangay: "Barangay San Jose",
      txHash: "0xa7f2...8c4d",
      fullTxHash:
        "0xa7f2c8b3e9d1f4a6b2c7e5d8f3a9b1c4e7d2f5a8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a8c4d",
      status: "Verified" as const,
    },
    {
      id: "2",
      date: "October 2, 2025",
      disaster: "Aftershock Relief - Coastal Areas",
      type: "Goods",
      amount: "$300",
      barangay: "Barangay Santa Cruz",
      txHash: "0xb3e9...1f4a",
      fullTxHash:
        "0xb3e9d1f4a6b2c7e5d8f3a9b1c4e7d2f5a8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a8b3c6e9d1f4a",
      status: "Verified" as const,
    },
    {
      id: "3",
      date: "September 30, 2025",
      disaster: "Mountain Community Support",
      type: "Money",
      amount: "$750",
      barangay: "Barangay Del Pilar",
      txHash: "0xc4e7...2f5a",
      fullTxHash:
        "0xc4e7d2f5a8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a",
      status: "Verified" as const,
    },
    {
      id: "4",
      date: "September 28, 2025",
      disaster: "Urban Infrastructure Restoration",
      type: "Money",
      amount: "$1,000",
      barangay: "Barangay Central",
      txHash: "0xd5f8...3c6e",
      fullTxHash:
        "0xd5f8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a8b3c6e9d1f4a7b2c5e8d3f6a9b1c4e7d2f5a8b3c6e",
      status: "Verified" as const,
    },
  ];

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 font-bold">My Donations</h1>
            <p className="text-muted-foreground">
              View your donation history and track them on the blockchain
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Disaster</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="whitespace-nowrap">
                          {donation.date}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="line-clamp-2">
                            {donation.disaster}
                          </div>
                        </TableCell>
                        <TableCell>{donation.type}</TableCell>
                        <TableCell>{donation.amount}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {donation.barangay}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {donation.txHash}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(donation.fullTxHash)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                          {copiedHash === donation.fullTxHash && (
                            <p className="text-xs text-secondary mt-1">
                              Copied!
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-secondary/20 text-secondary-foreground"
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {donations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No donations yet</p>
                  <Button
                    onClick={() => handleNavigate("dashboard")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Make Your First Donation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
