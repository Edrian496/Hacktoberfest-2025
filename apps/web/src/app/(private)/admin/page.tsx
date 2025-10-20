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
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CreateCampaignModal } from "@/components/ui/create-campaign-modal";

const campaigns = [
  {
    id: 1,
    name: "7.8 Magnitude Earthquake - Northern Region",
    location: "Northern Province, Region A",
    status: "Active",
    fundsRaised: 45000,
    fundGoal: 100000,
    donors: 234,
  },
  {
    id: 2,
    name: "Aftershock Relief - Coastal Areas",
    location: "Coastal Region, District B",
    status: "Active",
    fundsRaised: 23000,
    fundGoal: 50000,
    donors: 142,
  },
  {
    id: 3,
    name: "Mountain Community Support",
    location: "Mountain Province, Region C",
    status: "Active",
    fundsRaised: 67000,
    fundGoal: 80000,
    donors: 389,
  },
];

// Extended mock data for comprehensive transaction tracking
const allTransactions = [
  {
    id: 1,
    donor: "John Doe",
    campaign: "7.8 Magnitude Earthquake",
    amount: 500,
    transactionHash: "0xa7f2...8c4d",
    fullHash:
      "0xa7f2c8e9d1b4a5f3c2e1d9b8a7c6e5f4d3c2b1a09f8e7d6c5b4a3c2b1a09f8c4d",
    date: "2025-10-15",
    status: "verified",
  },
  {
    id: 2,
    donor: "Jane Smith",
    campaign: "Aftershock Relief",
    amount: 300,
    transactionHash: "0xb3e9...1f4a",
    fullHash:
      "0xb3e9d2c5f8a1b4e7d0c3f6a9b2e5d8c1f4a7b0e3d6c9f2a5b8e1d4c7f0a3b1f4a",
    date: "2025-10-10",
    status: "verified",
  },
  {
    id: 3,
    donor: "Bob Johnson",
    campaign: "Mountain Community",
    amount: 750,
    transactionHash: "0xc4e7...2f5a",
    fullHash:
      "0xc4e7a3d9b5f1c8e4a0d6b2f8c4e0a6d2b8f4c0e6a2d8b4f0c6e2a8d4f0c2e8a2f5a",
    date: "2025-10-16",
    status: "verified",
  },
  {
    id: 4,
    donor: "Alice Williams",
    campaign: "7.8 Magnitude Earthquake",
    amount: 1000,
    transactionHash: "0xd5f8...3a6b",
    fullHash:
      "0xd5f8c1a4e7b0d3f6a9c2e5d8b1f4a7c0e3d6b9f2a5c8e1d4b7f0a3c6e9d2f5a3a6b",
    date: "2025-10-14",
    status: "pending",
  },
  {
    id: 5,
    donor: "Michael Brown",
    campaign: "Aftershock Relief",
    amount: 450,
    transactionHash: "0xe6a9...4b7c",
    fullHash:
      "0xe6a9d2f5c8b1e4a7d0c3f6b9e2d5c8f1a4b7e0d3c6f9b2e5d8c1f4a7b0e3d6c4b7c",
    date: "2025-10-12",
    status: "verified",
  },
  {
    id: 6,
    donor: "Sarah Davis",
    campaign: "Mountain Community",
    amount: 2000,
    transactionHash: "0xf7b0...5c8d",
    fullHash:
      "0xf7b0e3d6c9f2a5b8e1d4c7f0a3b6e9d2f5c8b1e4a7d0c3f6b9e2d5c8f1a4b7e5c8d",
    date: "2025-10-18",
    status: "verified",
  },
  {
    id: 7,
    donor: "David Martinez",
    campaign: "7.8 Magnitude Earthquake",
    amount: 350,
    transactionHash: "0xa1c2...6d9e",
    fullHash:
      "0xa1c2e4f6b8d0c3e5f7b9d1c3e5f7b9d1c3e5f7b9d1c3e5f7b9d1c3e5f7b9d1c6d9e",
    date: "2025-10-17",
    status: "failed",
  },
  {
    id: 8,
    donor: "Emily Garcia",
    campaign: "Aftershock Relief",
    amount: 600,
    transactionHash: "0xb2d3...7e0f",
    fullHash:
      "0xb2d3f5a7c9e1d4f6a8c0e2d4f6a8c0e2d4f6a8c0e2d4f6a8c0e2d4f6a8c0e2d7e0f",
    date: "2025-10-13",
    status: "verified",
  },
  {
    id: 9,
    donor: "James Rodriguez",
    campaign: "Mountain Community",
    amount: 850,
    transactionHash: "0xc3e4...8f1a",
    fullHash:
      "0xc3e4a6b8d0f2c4e6a8d0f2c4e6a8d0f2c4e6a8d0f2c4e6a8d0f2c4e6a8d0f2c8f1a",
    date: "2025-10-11",
    status: "pending",
  },
  {
    id: 10,
    donor: "Lisa Anderson",
    campaign: "7.8 Magnitude Earthquake",
    amount: 1200,
    transactionHash: "0xd4f5...9a2b",
    fullHash:
      "0xd4f5b7c9e1f3a5c7e9f1a3c5e7f9a1c3e5f7a9c1e3f5a7c9e1f3a5c7e9f1a3c9a2b",
    date: "2025-10-09",
    status: "verified",
  },
  {
    id: 11,
    donor: "Robert Taylor",
    campaign: "Aftershock Relief",
    amount: 400,
    transactionHash: "0xe5a6...0b3c",
    fullHash:
      "0xe5a6c8e0f2a4c6e8f0a2c4e6f8a0c2e4f6a8c0e2f4a6c8e0f2a4c6e8f0a2c4e0b3c",
    date: "2025-10-08",
    status: "verified",
  },
  {
    id: 12,
    donor: "Maria Thomas",
    campaign: "Mountain Community",
    amount: 950,
    transactionHash: "0xf6b7...1c4d",
    fullHash:
      "0xf6b7d9f1a3c5e7f9a1c3e5f7a9c1e3f5a7c9e1f3a5c7e9f1a3c5e7f9a1c3e5f1c4d",
    date: "2025-10-07",
    status: "pending",
  },
];

export default function AdminDashboard() {
  // Transaction tracking state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Refs for scroll navigation
  const dashboardRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);

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
    return allTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.campaign
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.transactionHash
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

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
    (sum, campaign) => sum + campaign.fundsRaised,
    0
  );
  const totalDonors = campaigns.reduce(
    (sum, campaign) => sum + campaign.donors,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={dashboardRef} className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage disaster campaigns and monitor donations
          </p>
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
                ₱{totalFundsRaised.toLocaleString()}
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
                Contributors to all campaigns
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
            <CreateCampaignModal />
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
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Funds
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Donors
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {campaign.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {campaign.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 font-medium"
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">
                        ₱{campaign.fundsRaised.toLocaleString()} / ₱
                        {campaign.fundGoal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {campaign.donors}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() =>
                              console.log("Edit campaign:", campaign.id)
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              console.log("Delete campaign:", campaign.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

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
                        <TableCell className="font-medium text-gray-900">
                          {transaction.donor}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.campaign}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          ₱{transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <code className="relative rounded bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-700 border border-gray-200">
                            {transaction.transactionHash}
                          </code>
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
