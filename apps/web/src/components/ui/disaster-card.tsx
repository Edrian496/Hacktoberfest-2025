"use client";

import { ReactNode } from "react";
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
  children?: ReactNode; // ✅ Add children prop
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
  children, // ✅ Accept children
}: DisasterCardProps) {
  const progress = fundGoal && fundsRaised ? (fundsRaised / fundGoal) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-2 text-base sm:text-lg font-semibold min-h-[3rem] flex items-start">
            {title}
          </CardTitle>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={`shrink-0 ${
              status === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {status === "active" ? "Active" : "Completed"}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 flex-grow pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="truncate">{date}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-3 min-h-[3.75rem]">
          {description}
        </p>

        {/* Progress */}
        {fundGoal && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs sm:text-sm gap-2">
              <span className="text-muted-foreground shrink-0">Progress</span>
              <span className="text-right font-medium truncate">
                ₱{fundsRaised?.toLocaleString()} / ₱{fundGoal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-right text-muted-foreground">
              {Math.min(progress, 100).toFixed(0)}% funded
            </div>
          </div>
        )}

        {/* ✅ Render any children passed */}
        {children && <div className="mt-2">{children}</div>}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 mt-auto">
        <Button
          onClick={() => onDonate(id)}
          className="w-full bg-primary hover:bg-primary/90 h-10 sm:h-11"
          disabled={status === "completed"}
        >
          {status === "completed" ? "Campaign Closed" : "Donate"}
        </Button>
      </CardFooter>
    </Card>
  );
}
