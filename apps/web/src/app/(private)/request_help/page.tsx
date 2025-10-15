"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Phone, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabaseClient";

export default function HelpRequestPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [helpType, setHelpType] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async () => {
    if (!location || !helpType || !description) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.from("help_reports").insert([
        {
          location,
          help_type: helpType,
          description,
          contact_info: contactInfo || null,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        router.push("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error submitting help request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Request Urgent Assistance
              </h1>
              <p className="text-gray-600 mt-1">
                Submit an urgent request for help in disaster-affected areas
              </p>
            </div>
          </div>

          <Alert className="bg-yellow-50 border-yellow-300 mt-6 mb-10">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm">
              For life-threatening emergencies, please call local emergency
              services immediately: <strong>911</strong> or your local emergency number.
            </AlertDescription>
          </Alert>

          {submitted ? (
            <Alert className="bg-green-100 border-green-300">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-lg font-semibold">
                Request Submitted Successfully!
              </AlertTitle>
              <AlertDescription className="mt-2">
                Your urgent assistance request has been received. Our response
                team will contact you shortly. Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          ) : (

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Barangay San Jose, Street Name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="help-type" className="text-base font-semibold">
                  Type of Help Needed{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select value={helpType} onValueChange={setHelpType}>
                  <SelectTrigger id="help-type" className="h-11">
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

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the situation and what help is needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-base font-semibold">
                  Contact Information{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="contact"
                    type="text"
                    placeholder="Phone number or other contact details"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="pl-11 h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-destructive hover:bg-destructive/90 h-11"
                  disabled={loading || !location || !helpType || !description}
                >
                  {loading ? "Submitting..." : "Submit Urgent Request"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}