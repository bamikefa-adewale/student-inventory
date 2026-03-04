"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getIdeaById, type Idea } from "@/lib/mockData";
import { ScoreBadge, RiskPill, DirectionArrow } from "@/components/ScoreBadge";
import { ComputedMetricsDisplay } from "@/components/ComputedMetricsDisplay";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { ConfidenceGapIndicator } from "@/components/ConfidenceGapIndicator";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function IdeaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getIdeaById(id).then((d) => { setIdea(d); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!idea) return <div className="container py-12 text-center text-muted-foreground">Idea not found.</div>;

  return (
    <div className="container max-w-2xl py-12">
      <Link href="/leaderboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Leaderboard
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-heading font-bold font-mono">{idea.ticker}</h1>
            <DirectionArrow direction={idea.direction} />
          </div>
          <p className="text-muted-foreground text-sm">
            by {idea.display_name} {idea.university && `· ${idea.university}`} · {format(new Date(idea.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <div className="text-right">
          {idea.overall_score !== null && (
            <div className="text-4xl font-mono font-bold text-foreground">
              {idea.overall_score.toFixed(1)}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          )}
          {idea.status === "pending" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Scoring...</span>
            </div>
          )}
          {idea.status === "failed" && (
            <div className="text-danger text-sm font-medium">Failed</div>
          )}
          {idea.risk_tag && <div className="mt-1"><RiskPill risk={idea.risk_tag} /></div>}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
        <span className="font-mono bg-muted px-2 py-0.5 rounded">{idea.horizon}</span>
        <span>Confidence: <span className="font-mono text-foreground">{idea.user_confidence}/10</span></span>
      </div>

      {idea.status === "failed" && idea.error_message && (
        <Alert className="mb-8 border-danger/50 bg-danger/10">
          <AlertCircle className="h-4 w-4 text-danger" />
          <AlertTitle className="text-danger font-medium">Scoring Failed</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground mt-1">
            {idea.error_message}
          </AlertDescription>
        </Alert>
      )}

      {idea.status === "scored" && (
        <>
          <ConfidenceGapIndicator
            confidence_gap={idea.confidence_gap}
            user_confidence={idea.user_confidence}
            overall_score={idea.overall_score}
          />

          <ComputedMetricsDisplay
            return_6m={idea.return_6m}
            vol_30d={idea.vol_30d}
            max_drawdown_6m={idea.max_drawdown_6m}
          />

          <ScoreBreakdown
            return_score={idea.return_score}
            vol_penalty={idea.vol_penalty}
            dd_penalty={idea.dd_penalty}
            risk_penalty={idea.risk_penalty}
            overall_score={idea.overall_score}
          />
        </>
      )}

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Thesis</h2>
        <p className="text-foreground leading-relaxed">{idea.thesis_text || "No thesis provided."}</p>
      </div>
    </div>
  );
}
