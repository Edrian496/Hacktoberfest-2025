"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateCampaignModalProps {
  onCreateCampaign?: (formData: CampaignFormData) => void;
}

export interface CampaignFormData {
  title: string;
  location: string;
  description: string;
  fundGoal: string;
}

export function CreateCampaignModal({
  onCreateCampaign,
}: CreateCampaignModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    location: "",
    description: "",
    fundGoal: "",
  });

  const handleCreate = () => {
    if (onCreateCampaign) {
      onCreateCampaign(formData);
    } else {
      console.log("Creating campaign:", formData);
    }

    setIsOpen(false);
    setFormData({
      title: "",
      location: "",
      description: "",
      fundGoal: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new disaster relief campaign
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-700 font-semibold">
              Campaign Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., 7.8 Magnitude Earthquake"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-gray-700 font-semibold">
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., Northern Province"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="text-gray-700 font-semibold"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the disaster relief campaign..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="border-gray-300 min-h-24"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fundGoal" className="text-gray-700 font-semibold">
              Fund Goal (PHP)
            </Label>
            <Input
              id="fundGoal"
              type="number"
              placeholder="100000"
              value={formData.fundGoal}
              onChange={(e) =>
                setFormData({ ...formData, fundGoal: e.target.value })
              }
              className="border-gray-300"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
