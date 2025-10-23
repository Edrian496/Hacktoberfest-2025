"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabaseClient"
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
  // Router
  const router = useRouter();

  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

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

   useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.replace("/login");
        return;
      }

      setIsAdmin(true);
      setLoadingAuth(false);
    };

    checkAdmin();
  }, [router]);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
      
      console.log(`Total donation events found: ${allDonationEvents.length}`);

      const transactionsData: Transaction[] = await Promise.all(
        allDonationEvents.map(async (event, index) => {
          const block = await event.getBlock();
          const campaignId = Number(event.args[0]);
          const campaignName =
            campaignsData.find((c) => c.id === campaignId.toString())?.name || `Campaign ${campaignId}`;

          return {
            id: index + 1,
            donor: event.args[1],
            campaign: campaignName,
            amount: Number(ethers.formatEther(event.args[2])),
            transactionHash: `${event.transactionHash.slice(0, 10)}...${event.transactionHash.slice(-8)}`,
            fullHash: event.transactionHash,
            date: new Date(Number(block.timestamp) * 1000).toISOString(),
            status: "confirmed",
          };
        })
      );

      setTransactions(transactionsData.reverse()); // Most recent first
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

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFunds = campaigns.reduce(
      (sum, campaign) => sum + (campaign.fundsRaised || 0),
      0
    );
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
    const completedCampaigns = campaigns.filter(
      (c) => c.status === "completed"
    ).length;
    const totalDonors = new Set(transactions.map((t) => t.donor)).size;

    return {
      totalFunds: totalFunds.toFixed(2),
      activeCampaigns,
      completedCampaigns,
      totalDonors,
    };
  }, [campaigns, transactions]);

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.fullHash.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {status}
          </Badge>
        );
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Refresh Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage campaigns and track all platform activity
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="mb-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => scrollToSection(dashboardRef)}
            className="text-sm"
          >
            Overview
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollToSection(transactionsRef)}
            className="text-sm"
          >
            Transactions
          </Button>
        </div>

        {/* Stats Overview */}
        <div ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Funds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalFunds} ETH
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeCampaigns}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Completed Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedCampaigns}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalDonors}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Management */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Campaign Management
              </CardTitle>
              <CreateCampaignModal onCampaignCreated={refreshData} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Campaign Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Goal
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Raised
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Progress
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
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
                        <TableCell className="text-gray-600">
                          {campaign.fundGoal?.toFixed(2)} ETH
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {campaign.fundsRaised?.toFixed(4)} ETH
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(
                                    ((campaign.fundsRaised || 0) /
                                      (campaign.fundGoal || 1)) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {(
                                ((campaign.fundsRaised || 0) /
                                  (campaign.fundGoal || 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign.status === "active" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                              Completed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {campaign.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                View Details
                              </Button>
                            ) : (
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