import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { toast } from "../ui/sonner";
import { Download, Mail } from "lucide-react";
import { AssessmentType } from "./AssessmentHub";
import AssessmentHistoryChart from "./AssessmentHistoryChart";
import ClearHistoryButton from "../common/ClearHistoryButton";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { firestore, deleteAssessmentResults, deleteAssessmentResult } from "../../configs/firebase";
import { recordActivity } from "../../hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AssessmentHistoryEntry {
  userId: string;
  id: string;
  type: AssessmentType;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: Date;
}

interface AssessmentHistoryProps {
  onSelectAssessment: (type: AssessmentType) => void;
}

const AssessmentHistory = ({ onSelectAssessment }: AssessmentHistoryProps) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Defaults every new entry to selected, so "Download PDF" still means "all" until the user deselects something
  useEffect(() => {
    setSelectedIds(new Set(history.map((entry) => entry.id)));
  }, [history]);

  useEffect(() => {
    if (currentUser?.email) {
      setRecipientEmail(currentUser.email);
    }
  }, [currentUser]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!currentUser) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(firestore, "assessmentResults"),
      where("userId", "==", currentUser.id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          score: data.score,
          level: data.level,
          recommendations: data.recommendations || [],
          timestamp: (data.timestamp as Timestamp).toDate(),
        } as AssessmentHistoryEntry;
      });
      setHistory(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <p>Loading assessment history...</p>;
  }

  if (history.length === 0) {
    return <p className="text-muted-foreground">No assessment history yet.</p>;
  }

  // Group history by assessment type
  const groupedByType = history.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<AssessmentType, AssessmentHistoryEntry[]>);

  const selectedEntries = history.filter((entry) => selectedIds.has(entry.id));

  const buildReportEntries = () =>
    selectedEntries.map((entry) => ({
      type: entry.type,
      score: entry.score,
      level: entry.level,
      timestamp: entry.timestamp.toLocaleString(),
      recommendations: entry.recommendations,
    }));

  const reportUserName = () =>
    `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'MindCare User';

  const handleDownloadPdf = async () => {
    if (selectedEntries.length === 0) {
      toast.error('Nothing selected', { description: 'Select at least one assessment result to download.' });
      return;
    }
    setIsDownloading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/generate-report-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: reportUserName(), entries: buildReportEntries() }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mindcare_assessment_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded', { description: 'Your assessment report PDF has been saved.' });
      recordActivity('download', 'Downloaded Assessment Report PDF', 'AssessmentHistory');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Download failed', { description: 'Could not generate the PDF report. Please try again.' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Email required', { description: 'Please enter a recipient email address.' });
      return;
    }
    if (selectedEntries.length === 0) {
      toast.error('Nothing selected', { description: 'Select at least one assessment result to email.' });
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send-report-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: reportUserName(),
          entries: buildReportEntries(),
          recipient_email: recipientEmail,
        }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.detail || `Request failed with status ${res.status}`);
      }
      toast.success('Report sent', { description: `Your assessment report was emailed to ${recipientEmail}.` });
      recordActivity('email', 'Emailed Assessment Report', 'AssessmentHistory');
      setIsEmailDialogOpen(false);
    } catch (error) {
      console.error('Error emailing report:', error);
      toast.error('Could not send email', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDeleteSelected = async () => {
    const results = await Promise.all(selectedEntries.map((entry) => deleteAssessmentResult(entry.id)));
    const failed = results.filter((r) => !r.success).length;
    if (currentUser) {
      recordActivity('delete', `Deleted ${results.length - failed} assessment results`, 'AssessmentHistory');
    }
    return { success: failed === 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Assessment History</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelectedIds(
                selectedIds.size === history.length ? new Set() : new Set(history.map((e) => e.id))
              )
            }
          >
            {selectedIds.size === history.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Generating...' : `Download PDF (${selectedEntries.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsEmailDialogOpen(true)}
          >
            <Mail className="h-4 w-4" />
            Email Report ({selectedEntries.length})
          </Button>
          {currentUser?.id && selectedEntries.length > 0 && (
            <ClearHistoryButton
              itemLabel={`${selectedEntries.length} ${selectedEntries.length === 1 ? 'assessment result' : 'assessment results'}`}
              pageName="AssessmentHistory"
              mode="delete-selected"
              onConfirm={handleDeleteSelected}
            />
          )}
          {currentUser?.id && (
            <ClearHistoryButton
              itemLabel="assessment results"
              pageName="AssessmentHistory"
              onConfirm={() => deleteAssessmentResults(currentUser.id)}
            />
          )}
        </div>
      </div>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Email Report</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSendEmail} disabled={isSendingEmail} className="w-full">
              {isSendingEmail ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {Object.entries(groupedByType).map(([type, entries]) => (
          <Card key={type} className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{type} Assessment</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Latest Score: {entries[0].score}</p>
                <Badge
                  className={`${
                    entries[0].level?.includes("Low")
                      ? "bg-emerald-500"
                      : entries[0].level?.includes("Moderate")
                      ? "bg-amber-500"
                      : "bg-red-500"
                  } hover:${
                    entries[0].level?.includes("Low")
                      ? "bg-emerald-600"
                      : entries[0].level?.includes("Moderate")
                      ? "bg-amber-600"
                      : "bg-red-600"
                  }`}
                >
                  {entries[0].level || "Unknown"}
                </Badge>
              </div>

              <p className="text-muted-foreground">
                Latest Timestamp: {entries[0].timestamp.toLocaleString()}
              </p>
              <AssessmentHistoryChart
                assessmentType={type as AssessmentType}
                assessmentData={entries}
                userId={entries[0].userId}
              />

              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium text-muted-foreground">
                  Select which results to include in downloads/emails:
                </p>
                {entries.map((entry) => (
                  <label
                    key={entry.id}
                    className="flex items-center gap-3 text-sm py-1 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedIds.has(entry.id)}
                      onCheckedChange={() => toggleSelected(entry.id)}
                    />
                    <span>{entry.timestamp.toLocaleString()}</span>
                    <span className="text-muted-foreground">Score: {entry.score}</span>
                    <Badge variant="outline" className="ml-auto">{entry.level || "Unknown"}</Badge>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentHistory;
