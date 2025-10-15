"use client";

import { useState } from "react";
import { DisasterCard } from "@/components/ui/disaster-card";
import { ReportHelpPanel } from "@/components/ui/report-help-panel";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigate = (page: string, disasterId?: string) => {
    // Example: You can use router.push here if you want to move to a new page
    // router.push(`/dashboard/${page}${disasterId ? `/${disasterId}` : ""}`);
    setCurrentPage(page);
    console.log("Navigating to:", page, disasterId);
  };

  const disasters = [
    {
      id: "1",
      title: "7.8 Magnitude Earthquake - Northern Region",
      location: "Northern Province, Region A",
      description:
        "Massive earthquake struck at dawn, affecting over 50,000 residents. Immediate relief needed for food, shelter, and medical supplies.",
      date: "October 1, 2025",
      status: "active" as const,
      fundsRaised: 45000,
      fundGoal: 100000,
    },
    {
      id: "2",
      title: "Aftershock Relief - Coastal Areas",
      location: "Coastal Region, District B",
      description:
        "Series of aftershocks have displaced families. Emergency shelters and clean water distribution in progress.",
      date: "October 3, 2025",
      status: "active" as const,
      fundsRaised: 23000,
      fundGoal: 50000,
    },
    {
      id: "3",
      title: "Mountain Community Support",
      location: "Mountain Province, Region C",
      description:
        "Remote communities cut off by landslides caused by recent seismic activity. Medical aid and supplies urgently needed.",
      date: "September 28, 2025",
      status: "active" as const,
      fundsRaised: 67000,
      fundGoal: 80000,
    },
    {
      id: "4",
      title: "Urban Infrastructure Restoration",
      location: "Metro City, Region D",
      description:
        "Buildings damaged, roads cracked. Supporting temporary housing and infrastructure assessment teams.",
      date: "September 25, 2025",
      status: "active" as const,
      fundsRaised: 89000,
      fundGoal: 150000,
    },
    {
      id: "5",
      title: "Rural Area Emergency Response",
      location: "Valley District, Region E",
      description:
        "Small villages affected by tremors. Providing medical aid, food supplies, and temporary shelter materials.",
      date: "September 30, 2025",
      status: "active" as const,
      fundsRaised: 12000,
      fundGoal: 30000,
    },
    {
      id: "6",
      title: "School Rebuilding Initiative",
      location: "Education District, Region F",
      description:
        "Several schools severely damaged. Campaign to rebuild safe learning spaces for affected children.",
      date: "September 20, 2025",
      status: "completed" as const,
      fundsRaised: 50000,
      fundGoal: 50000,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {/* <Sidebar currentPage={currentPage} onNavigate={handleNavigate} /> */}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 font-bold">Active Disaster Campaigns</h1>
            <p className="text-muted-foreground">
              Choose a disaster to support with your donation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {disasters.map((disaster) => (
              <DisasterCard
                key={disaster.id}
                {...disaster}
                onDonate={(id) => handleNavigate("donation-qr", id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Help Panel */}
      <ReportHelpPanel />
    </div>
  );
}
