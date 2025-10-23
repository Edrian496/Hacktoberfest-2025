"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  TrendingUp,
  Users,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { CreateCampaignModal } from "@/components/ui/create-campaign-modal";
import { ethers } from "ethers";
import ReliefDonationAbi from "@/abis/ReliefDonation.json";
import deployment from "@/contracts/deployment.json";

interface Campaign {
  id: string; // Changed to string for compatibility with Disaster type
  name: string;
  title: string; // Add for compatibility
  description: string;
  ngoAddress: string;
  location: string; // Add for compatibility
  status: "active" | "completed"; // Changed to match Disaster type
  targetAmount: bigint;
  raisedAmount: bigint;
  disbursedAmount: bigint;
  startTime: bigint;
  endTime: bigint;
  isVerified: boolean;
  isActive: boolean;
  ipfsMetadata: string;
  fundGoal?: number;
  fundsRaised?: number;
  donors?: number;
}

interface Transaction {
  id: number;
  donor: string;
  campaign: string;
  amount: number;
  transactionHash: string;
  fullHash: string;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  // Blockchain state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction tracking state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Refs for scroll navigation
  const dashboardRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);

  // Load blockchain data
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        provider
      );

      // Get campaign counter
      const campaignCounter = await contract.campaignCounter();
      const campaignCount = Number(campaignCounter);

      // Fetch all campaigns
      const campaignsData: Campaign[] = [];
      for (let i = 1; i <= campaignCount; i++) {
        const campaign = await contract.campaigns(i);
        if (campaign.id !== 0n) {
          // Determine status based on blockchain data
          const isCompleted = campaign.raisedAmount >= campaign.targetAmount || !campaign.isActive;
          const status: "active" | "completed" = isCompleted ? "completed" : "active";
          
          campaignsData.push({
            id: Number(campaign.id).toString(), // Convert to string for compatibility
            name: campaign.name,
            title: campaign.name, // For compatibility with CreateCampaignModal
            description: campaign.description,
            ngoAddress: campaign.ngoAddress,
            location: "On-chain", // Default value for compatibility
            status: status,
            targetAmount: campaign.targetAmount,
            raisedAmount: campaign.raisedAmount,
            disbursedAmount: campaign.disbursedAmount,
            startTime: campaign.startTime,
            endTime: campaign.endTime,
            isVerified: campaign.isVerified,
            isActive: campaign.isActive,
            ipfsMetadata: campaign.ipfsMetadata,
            fundGoal: Number(ethers.formatEther(campaign.targetAmount)),
            fundsRaised: Number(ethers.formatEther(campaign.raisedAmount)),
            donors: 0, // You can fetch this from events if needed
          });
        }
      }

      setCampaigns(campaignsData);

      // Fetch donation events for transactions
      const donationFilter = contract.filters.DonationReceived();
      
      // Get current block number
      const currentBlock = await provider.getBlockNumber();
      console.log(`Current block: ${currentBlock}`);
      
      // Query in chunks to avoid RPC limit (100,000 blocks per query)
      const CHUNK_SIZE = 50000; // Safe chunk size
      let allDonationEvents: any[] = [];
      
      // Start from a reasonable block (or calculate based on contract deployment)
      // For now, let's go back 500,000 blocks which should cover most deployments
      const startBlock = Math.max(0, currentBlock - 500000);
      
      console.log(`Querying events from block ${startBlock} to ${currentBlock}`);
      
      for (let fromBlock = startBlock; fromBlock <= currentBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, currentBlock);
        console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);
        
        try {
          const events = await contract.queryFilter(donationFilter, fromBlock, toBlock);
          allDonationEvents = allDonationEvents.concat(events);
          console.log(`Found ${events.length} events in this chunk`);
        } catch (error) {
          console.error(`Error fetching events from ${fromBlock} to ${toBlock}:`, error);
        }
      }
      
      console.log(`Found ${allDonationEvents.length} total donation events`);

      const transactionsData: (Transaction | null)[] = await Promise.all(
        allDonationEvents.map(async (event, index) => {
          try {
            // Type guard to check if it's an EventLog
            if (!('args' in event)) {
              console.log('Event does not have args:', event);
              return null;
            }
            
            const args = event.args;
            const block = await event.getBlock();
            const campaignData = campaignsData.find(
              (c) => c.id === Number(args.campaignId).toString()
            );

            return {
              id: index + 1,
              donor: args.donor,
              campaign: campaignData?.name || "Unknown Campaign",
              amount: Number(ethers.formatEther(args.amount)),
              transactionHash: event.transactionHash.slice(0, 10) + "...",
              fullHash: event.transactionHash,
              date: new Date(Number(block.timestamp) * 1000).toISOString().split("T")[0],
              status: "verified",
            };
          } catch (error) {
            console.error('Error processing event:', error);
            return null;
          }
        })
      );

      // Filter out null values and reverse for most recent first
      const validTransactions = transactionsData.filter((t): t is Transaction => t !== null);
      console.log(`Processed ${validTransactions.length} valid transactions`);
      setTransactions(validTransactions.reverse());
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadBlockchainData();
    setIsRefreshing(false);
  };

  const handleVerifyCampaign = async (campaignId: string) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    if (!confirm("Are you sure you want to verify this campaign?")) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        deployment.contracts.ReliefDonation,
        ReliefDonationAbi.abi,
        signer
      );

      // Check VERIFIER role
      const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
      const hasRole = await contract.hasRole(VERIFIER_ROLE, address);
      
      if (!hasRole) {
        alert("You need VERIFIER role to verify campaigns!");
        return;
      }

      // Verify the campaign
      const tx = await contract.verifyCampaign(campaignId, {
        gasLimit: 100_000
      });
      
      alert(`Verification transaction submitted!\nHash: ${tx.hash}`);
      await tx.wait();
      alert("Campaign verified successfully! 🎉");
      
      // Refresh data
      await refreshData();
    } catch (error: any) {
      console.error("Error verifying campaign:", error);
      alert(`Failed: ${error.reason || error.message || "Unknown error"}`);
    }
  };

  // Listen for navigation events
  useEffect(() => {
    const handleScrollToSection = (event: Event) => {
      const customEvent = event as CustomEvent<{
        section: "dashboard" | "transactions";
      }>;
      if (customEvent.detail.section === "dashboard") {
        dashboardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (customEvent.detail.section === "transactions") {
        transactionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    window.addEventListener("navigateToSection", handleScrollToSection);
    return () => {
      window.removeEventListener("navigateToSection", handleScrollToSection);
    };
  }, []);

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.campaign
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.transactionHash
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.fullHash
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total stats
  const totalCampaigns = campaigns.length;
  const totalFundsRaised = campaigns.reduce(
    (sum, campaign) => sum + (campaign.fundsRaised || 0),
    0
  );
  const totalDonors = transactions.reduce((acc, curr) => {
    return acc.add(curr.donor);
  }, new Set()).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blockchain data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={dashboardRef} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage disaster campaigns and monitor donations
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Campaigns
              </CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalCampaigns}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Active disaster relief campaigns
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Funds Raised
              </CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalFundsRaised.toFixed(2)} ETH
              </div>
              <p className="text-sm text-gray-500 mt-1">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Donors
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalDonors}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Unique contributors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disaster Campaigns Section */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Disaster Campaigns
            </CardTitle>
            <CreateCampaignModal onCampaignCreated={refreshData} />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Campaign
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      NGO Address
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Funds
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Progress
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-xs">
                          {campaign.ngoAddress.slice(0, 6)}...{campaign.ngoAddress.slice(-4)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              campaign.status === "active"
                                ? campaign.isVerified
                                  ? "bg-green-50 text-green-700 border-green-200 font-medium"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200 font-medium"
                                : "bg-gray-50 text-gray-700 border-gray-200 font-medium"
                            }
                          >
                            {campaign.status === "active"
                              ? campaign.isVerified
                                ? "Active"
                                : "Pending Verification"
                              : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {campaign.fundsRaised?.toFixed(4)} ETH / {campaign.fundGoal?.toFixed(2)} ETH
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    ((campaign.fundsRaised || 0) / (campaign.fundGoal || 1)) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {Math.round(
                                ((campaign.fundsRaised || 0) / (campaign.fundGoal || 1)) * 100
                              )}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {campaign.status === "active" && !campaign.isVerified && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1"
                                onClick={() => handleVerifyCampaign(campaign.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Verify
                              </Button>
                            )}
                            {campaign.status === "active" && campaign.isVerified && (
                              <span className="text-sm text-gray-500 italic">Verified</span>
                            )}
                            {campaign.status === "completed" && (
                              <span className="text-sm text-gray-500 italic">Completed</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No campaigns found. Create your first campaign to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* All Transactions Section with Tracking */}
        <Card
          ref={transactionsRef}
          id="transactions"
          className="border-gray-200 shadow-sm scroll-mt-24"
        >
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              All Transactions
            </CardTitle>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by donor, campaign, or transaction hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Donor
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Campaign
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
                    <TableHead className="text-right font-semibold text-gray-700">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium text-gray-900 font-mono text-xs">
                          {transaction.donor.slice(0, 6)}...{transaction.donor.slice(-4)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.campaign}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {transaction.amount.toFixed(4)} ETH
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://etherscan.io/tx/${transaction.fullHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            {transaction.transactionHash}
                          </a>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No transactions found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            {filteredTransactions.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredTransactions.length
                  )}{" "}
                  of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-10"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}