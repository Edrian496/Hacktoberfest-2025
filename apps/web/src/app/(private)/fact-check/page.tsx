"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FactCheckAdminProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function FactCheckAdmin({
  onNavigate,
  currentPage,
}: FactCheckAdminProps) {
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const [submissions] = useState([
    {
      id: "1",
      content:
        "Earthquake magnitude 7.8 reported in Northern Region at 5:30 AM...",
      source: "User Submission",
      verdict: "true",
      confidence: 92,
      status: "Approved",
      date: "Oct 4, 2025",
    },
    {
      id: "2",
      content:
        "Unverified claim about additional tremors expected in coastal areas...",
      source: "News URL",
      verdict: "false",
      confidence: 88,
      status: "Approved",
      date: "Oct 3, 2025",
    },
    {
      id: "3",
      content: "Donation funds being misused by relief organizations...",
      source: "Social Media",
      verdict: "misleading",
      confidence: 75,
      status: "Pending Review",
      date: "Oct 3, 2025",
    },
    {
      id: "4",
      content:
        "Government announces $10M emergency relief package for affected areas...",
      source: "News Article",
      verdict: "true",
      confidence: 95,
      status: "Approved",
      date: "Oct 2, 2025",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputType === "text") {
      if (!textInput || textInput.trim() === "") {
        alert("Please enter text to fact-check");
        return;
      }
    } else {
      if (!urlInput || urlInput.trim() === "") {
        alert("Please enter a URL to fact-check");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const payload = inputType === "text" 
        ? { text: textInput.trim() }
        : { url: urlInput.trim() };

      console.log("Sending payload:", payload); 
      
      const response = await axios.post("http://localhost:8000/fact-check", payload);
      
      setResult({
        verdict: response.data.verdict,
        confidence: response.data.confidence,
        explanation: response.data.explanation,
        related_article: response.data.related_article,
      });
      
    } catch (error) {
      console.error("Full error:", error);
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        console.error("Response data:", error.response?.data);
        console.error("Detail array:", detail);
        
        if (Array.isArray(detail)) {
          detail.forEach((err, index) => {
            console.error(`Error ${index}:`, {
              location: err.loc,
              message: err.msg,
              type: err.type,
              input: err.input
            });
          });
        }
          
        const errorDetail = error.response?.data?.detail;
        if (Array.isArray(errorDetail)) {
          const errorMessages = errorDetail.map((err: any) => 
            `Field: ${err.loc?.join('.')}, Error: ${err.msg}, Type: ${err.type}`
          ).join('\n');
          alert(`Validation Error:\n\n${errorMessages}`);
        } else {
          alert(`Error: ${JSON.stringify(error.response?.data)}`);
        }
      } else {
        alert("Network error - make sure backend is running on port 8000");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (submission: any) => {
    setSelectedSubmission(submission);
    setIsReviewDialogOpen(true);
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "true":
        return (
          <Badge className="bg-secondary/20 text-secondary-foreground border-secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            True
          </Badge>
        );
      case "false":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            False
          </Badge>
        );
      case "misleading":
        return (
          <Badge className="bg-warning/20 text-warning-foreground border-warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Misleading
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 font-bold">Fact-Check Management</h1>
            <p className="text-muted-foreground">
              Review and verify disaster-related information submissions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verify New Content</CardTitle>
                  <CardDescription>
                    Submit content for AI-powered fact-checking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs
                      value={inputType}
                      onValueChange={(v) => setInputType(v as "text" | "url")}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger 
                          value="text"
                          className="data-[state=active]:bg-[#FACC15]/60 data-[state=active]"
                        >
                          Text Input
                        </TabsTrigger>
                        <TabsTrigger 
                          value="url"
                          className="data-[state=active]:bg-[#FACC15]/60 data-[state=active]"
                        >
                          URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="space-y-4">
                        <Label htmlFor="admin-text-input">
                          Content to Verify
                        </Label>
                        <Textarea
                          id="admin-text-input"
                          placeholder="Enter content to fact-check..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          rows={6}
                          required={inputType === "text"}
                        />
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4 mb-7" >
                        <Label htmlFor="admin-url-input">Article URL</Label>
                        <Input
                          id="admin-url-input"
                          type="url"
                          placeholder="https://example.com/article"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          required={inputType === "url"}
                        />
                      </TabsContent>
                    </Tabs>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="mr-2 w-4 h-4 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 w-4 h-4" />
                          Analyze Content
                        </>
                      )}
                    </Button>
                  </form>

                  {result && (
                    <div className="mt-6 space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4>AI Analysis Result</h4>
                        {getVerdictBadge(result.verdict)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Confidence: {result.confidence}%
                      </p>
                      <p className="text-sm">{result.explanation}</p>

                      {result.related_article && result.related_article.url && (
                        <div className="mt-2 p-2 border-l-4 border-blue-400 bg-blue-50 rounded">
                          <p className="text-sm font-semibold">Related Article:</p>
                          <a
                            href={result.related_article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {result.related_article.title}
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
                        <Button className="flex-1 bg-secondary hover:bg-secondary/90">
                          Approve & Publish
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Edit Result
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Verdict</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="max-w-xs">
                            <div className="line-clamp-2 text-sm">
                              {submission.content}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {submission.source}
                          </TableCell>
                          <TableCell>
                            {getVerdictBadge(submission.verdict)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                submission.status === "Approved"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {submission.date}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReview(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Submissions
                    </p>
                    <p className="text-2xl">{submissions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Verified True
                    </p>
                    <p className="text-2xl text-secondary">
                      {submissions.filter((s) => s.verdict === "true").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Flagged False
                    </p>
                    <p className="text-2xl text-destructive">
                      {submissions.filter((s) => s.verdict === "false").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pending Review
                    </p>
                    <p className="text-2xl text-warning">
                      {
                        submissions.filter((s) => s.status === "Pending Review")
                          .length
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Export Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Review and approve or edit the AI fact-check result
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <p className="text-sm mt-1">{selectedSubmission.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <p className="text-sm mt-1">{selectedSubmission.source}</p>
                </div>
                <div>
                  <Label>Verdict</Label>
                  <div className="mt-1">
                    {getVerdictBadge(selectedSubmission.verdict)}
                  </div>
                </div>
              </div>
              <div>
                <Label>Confidence Score</Label>
                <p className="text-sm mt-1">{selectedSubmission.confidence}%</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Close
            </Button>
            <Button variant="outline">Edit</Button>
            <Button className="bg-secondary hover:bg-secondary/90">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}