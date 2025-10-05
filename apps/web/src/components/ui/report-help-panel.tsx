"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabaseClient"; // <-- your client

export function ReportHelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [helpType, setHelpType] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Supabase (table: "help_reports")
      const { error } = await supabase.from("help_reports").insert([
        {
          location,
          help_type: helpType,
          description,
          contact_info: contactInfo || null,
          status: "pending", // default
        },
      ]);

      if (error) throw error;

      setSubmitted(true);

      // Reset form after 3s
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setLocation("");
        setHelpType("");
        setDescription("");
        setContactInfo("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting help request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse h-14 px-6"
        >
          <AlertCircle className="mr-2 w-5 h-5" />
          Report Help Needed
        </Button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Report Urgent Assistance Needed
            </DialogTitle>
            <DialogDescription>
              Submit an urgent request for help in disaster-affected areas. Our
              team will respond as quickly as possible.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <Alert className="bg-green-100 border-green-300">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertTitle>Request Submitted Successfully!</AlertTitle>
              <AlertDescription>
                Your urgent assistance request has been received. Our response
                team will contact you shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Barangay San Jose, Street Name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Help Type */}
              <div className="space-y-2">
                <Label htmlFor="help-type">
                  Type of Help Needed{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select value={helpType} onValueChange={setHelpType}>
                  <SelectTrigger id="help-type">
                    <SelectValue placeholder="Select type of assistance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="rescue">Rescue / Evacuation</SelectItem>
                    <SelectItem value="food">Food & Water</SelectItem>
                    <SelectItem value="shelter">Shelter / Housing</SelectItem>
                    <SelectItem value="supplies">Emergency Supplies</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the situation and what help is needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <Label htmlFor="contact">
                  Contact Information{" "}
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact"
                    type="text"
                    placeholder="Phone number or other contact details"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Alert */}
              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  For life-threatening emergencies, please call local emergency
                  services immediately.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Urgent Request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
