"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Users, Edit, Trash2 } from "lucide-react";
import {
  CreateCampaignModal,
  type CampaignFormData,
} from "@/components/ui/create-campaign-modal";

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

const recentDonations = [
  {
    id: 1,
    donor: "John Doe",
    campaign: "7.8 Magnitude Earthquake",
    amount: 500,
    transactionHash: "0xa7f2...8c4d",
    date: "Oct 15, 2025",
  },
  {
    id: 2,
    donor: "Jane Smith",
    campaign: "Aftershock Relief",
    amount: 300,
    transactionHash: "0xb3e9...1f4a",
    date: "Oct 10, 2025",
  },
  {
    id: 3,
    donor: "Bob Johnson",
    campaign: "Mountain Community",
    amount: 750,
    transactionHash: "0xc4e7...2f5a",
    date: "Oct 16, 2025",
  },
];

export default function AdminDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const handleCreateCampaign = (formData: CampaignFormData) => {
    console.log("Creating campaign:", formData);
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
        <div className="mb-8">
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
            <CreateCampaignModal onCreateCampaign={handleCreateCampaign} />
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
                            onClick={() => setSelectedCampaign(campaign.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* Recent Donations Section */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Recent Donations
            </CardTitle>
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
                    <TableHead className="text-right font-semibold text-gray-700">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.map((donation) => (
                    <TableRow key={donation.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {donation.donor}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {donation.campaign}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        ₱{donation.amount}
                      </TableCell>
                      <TableCell>
                        <code className="relative rounded bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-700 border border-gray-200">
                          {donation.transactionHash}
                        </code>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {donation.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
