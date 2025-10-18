"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";

interface FactCheckResult {
  verdict: string;
  confidence: number;
  explanation: string;
  related_article?: {
    title: string;
    url: string;
  };
}

interface Submission {
  id: string;
  content: string;
  source: string;
  verdict: string;
  confidence: number;
  date: string;
}

export default function FactCheckAdmin() {
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const submissions: Submission[] = [
    {
      id: "1",
      content:
        "Earthquake magnitude 7.8 reported in Northern Region at 5:30 AM...",
      source: "User Submission",
      verdict: "true",
      confidence: 92,
      date: "Oct 4, 2025",
    },
    {
      id: "2",
      content:
        "Unverified claim about additional tremors expected in coastal areas...",
      source: "News URL",
      verdict: "false",
      confidence: 88,
      date: "Oct 3, 2025",
    },
    {
      id: "3",
      content: "Donation funds being misused by relief organizations...",
      source: "Social Media",
      verdict: "misleading",
      confidence: 75,
      date: "Oct 3, 2025",
    },
    {
      id: "4",
      content:
        "Government announces $10M emergency relief package for affected areas...",
      source: "News Article",
      verdict: "true",
      confidence: 95,
      date: "Oct 2, 2025",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setValidationError("");
    setResult(null);

    if (inputType === "text") {
      if (!textInput || textInput.trim() === "") {
        setValidationError("Please enter text to fact-check");
        return;
      }
    } else {
      if (!urlInput || urlInput.trim() === "") {
        setValidationError("Please enter a URL to fact-check");
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload =
        inputType === "text"
          ? { text: textInput.trim() }
          : { url: urlInput.trim() };

      console.log("Sending payload:", payload);

      const response = await fetch("http://localhost:8000/fact-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const errorMessages = data.detail
            .map((err: any) => `${err.msg} (${err.loc?.join(".")})`)
            .join(", ");
          setError(`Validation Error: ${errorMessages}`);
        } else if (typeof data.detail === "string") {
          setError(data.detail);
        } else {
          setError(
            data.message || "An error occurred while processing your request"
          );
        }
        return;
      }

      setResult({
        verdict: data.verdict,
        confidence: data.confidence,
        explanation: data.explanation,
        related_article: data.related_article,
      });
    } catch (err) {
      console.error("Full error:", err);
      setError(
        "Network error - please make sure the backend is running on port 8000"
      );
    } finally {
      setIsLoading(false);
    }
  };

 // Find this function in your component and modify it:
const getVerdictBadge = (verdict: string, size: 'normal' | 'large' = 'normal') => {
  const baseClasses = "rounded-full font-semibold px-3 py-1 text-xs inline-flex items-center";
  const largeClasses = "px-4 py-2 text-base"; // New classes for larger badge
  const iconBaseClasses = "w-3 h-3 mr-1";
  const iconLargeClasses = "w-4 h-4 mr-2"; // New classes for larger icon

  const currentBadgeClasses = size === 'large' ? largeClasses : baseClasses;
  const currentIconClasses = size === 'large' ? iconLargeClasses : iconBaseClasses;

  switch (verdict) {
    case "true":
      return (
        <Badge className={`bg-green-100 text-green-800 border-green-300 hover:bg-green-100 ${currentBadgeClasses}`}>
          <CheckCircle className={currentIconClasses} />
          True
        </Badge>
      );
    case "false":
      return (
        <Badge className={`bg-red-100 text-red-800 border-red-300 hover:bg-red-100 ${currentBadgeClasses}`}>
          <XCircle className={currentIconClasses} />
          False
        </Badge>
      );
    case "misleading":
      return (
        <Badge className={`bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 ${currentBadgeClasses}`}>
          <AlertTriangle className={currentIconClasses} />
          Misleading
        </Badge>
      );
    default:
      return null;
  }
};

  const handleRowClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 h-12 bg-gradient-to-r from-[var(--secondary)] to-blue-500 bg-clip-text text-transparent">
              Fact Check
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and verify disaster-related information submissions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--primary)] " />
                    <p className=" text-[23px] text-[var(--primary)]">
              Verify New Content
            </p>
                    
                  </CardTitle>
                  <CardDescription className="text-2sm">
                    Submit content for AI-powered fact-checking
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="space-y-3 relative">
                    <Tabs
                      value={inputType}
                      onValueChange={(v) => setInputType(v)}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                        <TabsTrigger
                          value="text"
                          className="data-[state=active]:bg-[#F4D96D] data-[state=active]:shadow-sm"
                        >
                          Text Input
                        </TabsTrigger>
                        <TabsTrigger
                          value="url"
                          className="data-[state=active]:bg-[#F4D96D] data-[state=active]:shadow-sm"
                        >
                          URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="space-y-4">
                        <Label
                          htmlFor="admin-text-input"
                          className="text-base font-semibold"
                        >
                          Content to Verify
                        </Label>
                        <Textarea
                          id="admin-text-input"
                          placeholder="Enter content to fact-check..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          rows={6}
                          className="resize-none focus:ring-2 border-1 border-gray-300 focus:ring-blue-500"
                        />
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4 mb-7">
                        <Label
                          htmlFor="admin-url-input"
                          className="text-base font-semibold"
                        >
                          Article URL
                        </Label>
                        <Input
                          id="admin-url-input"
                          type="url"
                          placeholder="https://example.com/article"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="focus:ring-2 border-1 border-gray-300  focus:ring-blue-500"
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="min-h-[10px] flex items-center justify-center">
                      {(validationError || error) && (
                        <Alert variant="destructive" className="w-full">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>
                            {validationError ? "Validation Error" : "Error"}
                          </AlertTitle>
                          <AlertDescription className="pr-8">
                            {validationError || error}
                          </AlertDescription>
                          <button
                            onClick={() => {
                              setError("");
                              setValidationError("");
                            }}
                            className="absolute top-3 right-3 hover:bg-red-100 rounded p-1 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Alert>
                      )}
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-[#00A7EE] hover:bg-[#0092D1] text-white font-semibold py-6 shadow-md"
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
                  </div>

                  {result && (
                    <div className="mt-6 space-y-3 p-6 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <h4 className="text-lg font-semibold">
                          AI Analysis Result
                        </h4>
                        {getVerdictBadge(result.verdict)}
                      </div>

                      <div className="space-y-3">
                        <div className="pt-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Explanation:
                          </p>
                          <p className="text-sm leading-relaxed text-gray-800">
                            {result.explanation}
                          </p>
                        </div>

                        {result.related_article &&
                          result.related_article.url && (
                            <div className="mt-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                              <p className="text-sm font-semibold text-blue-900 mb-2">
                                Related Article:
                              </p>
                              <a
                                href={result.related_article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-900 underline font-medium text-sm"
                              >
                                {result.related_article.title}
                              </a>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0">
                <CardHeader className="border-b">
                  <CardTitle className="text-[23px] text-[var(--secondary)] ">
                    Recent Submissions</CardTitle>
                  <CardDescription className="text-2sm">
                    View history of fact-checked content
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-lg">Content</TableHead>
                        <TableHead className="font-semibold text-lg">Source</TableHead>
                        <TableHead className="font-semibold text-lg">Verdict</TableHead>
                        <TableHead className="font-semibold text-lg">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow
                          key={submission.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(submission)}
                        >
                          <TableCell className="max-w-xs">
                            <div className="line-clamp-2 text-3sm">
                              {submission.content}
                            </div>
                          </TableCell>
                          <TableCell className="text-3sm text-gray-600">
                            {submission.source}
                          </TableCell>
                          <TableCell>
                            {getVerdictBadge(submission.verdict)}
                          </TableCell>
                          <TableCell className="text-3sm text-gray-600">
                            {submission.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Card className="shadow-xl border-0">
                <CardHeader className="border-b">
                  <CardTitle className="text-[23px] text-[var(--secondary)] mb-1">
                    Statistics</CardTitle>
                </CardHeader>
                <CardContent className="pt-1 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Submissions
                      </p>
                      <p className="text-3xl font-bold text-blue-900 mt-1">
                        {submissions.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Verified True
                      </p>
                      <p className="text-3xl font-bold text-green-700 mt-1">
                        {submissions.filter((s) => s.verdict === "true").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Flagged False
                      </p>
                      <p className="text-3xl font-bold text-red-700 mt-1">
                        {
                          submissions.filter((s) => s.verdict === "false")
                            .length
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Misleading
                      </p>
                      <p className="text-3xl font-bold text-amber-700 mt-1">
                        {
                          submissions.filter((s) => s.verdict === "misleading")
                            .length
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="max-w-2xl p-6 bg-white rounded-lg shadow-xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-900">Submission Details</DialogTitle>
      <DialogDescription className="text-base text-gray-600 mb-4 pb-4 border-b border-gray-200">
        Complete information about this fact-check submission
      </DialogDescription>
    </DialogHeader>

    {selectedSubmission && (
      <div className="space-y-6">

        {/* Source & Date Box - NOW FIRST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-lg font-semibold text-gray-800 block mb-2">
              Source
            </Label>
            <p className="text-base text-gray-700">
              {selectedSubmission.source}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-lg font-semibold text-gray-800 block mb-2">
              Date
            </Label>
            <p className="text-base text-gray-700">
              {selectedSubmission.date}
            </p>
          </div>
        </div>

        {/* Content Box - NOW SECOND */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Label className="text-lg font-semibold text-gray-800 block mb-2">
            Content
          </Label>
          <p className="text-base text-gray-800 leading-relaxed">
            {selectedSubmission.content}
          </p>
        </div>

        {/* Verdict Box - NOW THIRD - with increased size and gap */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Label className="text-lg font-semibold text-gray-800 block mb-2">
            Verdict
          </Label>
          <div className="mt-2 pl-4"> {/* Added pl-4 for left gap */}
            {/* The badge itself needs styling for bigger text/padding */}
            {/* We will modify getVerdictBadge to allow for size variations */}
            {getVerdictBadge(selectedSubmission.verdict, 'large')}
          </div>
        </div>

      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}
