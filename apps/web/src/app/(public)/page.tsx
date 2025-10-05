"use client";

import { Shield, Heart, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
} from "@/components/ui/typography";

interface LandingPageProps {
  onNavigate: (page: string, id?: string) => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  const activeCampaigns = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <TypographyH1 className="mb-6">
            QuakeAid — Transparent Disaster Relief
          </TypographyH1>
          <TypographyP className="mb-8 max-w-2xl mx-auto text-lg text-muted-foreground">
            Empowering communities with blockchain-verified donations and
            AI-powered fact-checking to ensure your help reaches those who need
            it most.
          </TypographyP>
          <Button size="lg" onClick={() => onNavigate("dashboard")}>
            Donate Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <TypographyH2 className="mb-4">Why Choose QuakeAid?</TypographyH2>
            <TypographyP className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with humanitarian
              aid to create a transparent and efficient relief system.
            </TypographyP>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Blockchain Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every donation is tracked on the blockchain, ensuring complete
                  transparency and accountability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 mx-auto">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>Direct Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your contributions go directly to affected communities with
                  minimal overhead and maximum impact.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 mx-auto">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>AI Fact-Checking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Combat misinformation with our AI-powered fact-checking system
                  for disaster news and updates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 px-4 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <TypographyH2 className="mb-4">
              Active Disaster Campaigns
            </TypographyH2>
            <TypographyP className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of donors helping communities recover from recent
              disasters.
            </TypographyP>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {campaign.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.date}
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      onClick={() => onNavigate("donation-qr", campaign.id)}
                    >
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => onNavigate("dashboard")}>
              View All Campaigns
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ✅ Default export required for Next.js pages
export default function Page() {
  const router = useRouter();

  const handleNavigate = (page: string, id?: string) => {
    if (page === "dashboard") {
      router.push("/dashboard");
    } else if (page === "donation-qr" && id) {
      router.push(`/donation-qr/${id}`);
    } else {
      router.push(`/${page}`);
    }
  };

  return <LandingPage onNavigate={handleNavigate} />;
}
