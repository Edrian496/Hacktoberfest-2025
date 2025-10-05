"use client";

import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DisasterCardProps {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
  status: "active" | "completed";
  fundsRaised?: number;
  fundGoal?: number;
  onDonate: (id: string) => void;
}

export function DisasterCard({
  id,
  title,
  location,
  description,
  date,
  status,
  fundsRaised,
  fundGoal,
  onDonate,
}: DisasterCardProps) {
  const progress = fundGoal && fundsRaised ? (fundsRaised / fundGoal) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Header */}
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-2 text-base font-semibold">
            {title}
          </CardTitle>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={
              status === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-700"
            }
          >
            {status === "active" ? "Active" : "Completed"}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>{date}</span>
        </div>
        <p className="text-sm line-clamp-3">{description}</p>

        {/* Progress bar */}
        {fundGoal && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>
                ${fundsRaised?.toLocaleString()} / ${fundGoal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button
          onClick={() => onDonate(id)}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={status === "completed"}
        >
          {status === "completed" ? "Campaign Closed" : "Donate Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
