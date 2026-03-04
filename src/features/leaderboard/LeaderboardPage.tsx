"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard, type Idea } from "@/lib/mockData";
import { ScoreBadge, RiskPill, DirectionArrow } from "@/components/ScoreBadge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export function LeaderboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then((d) => { setIdeas(d); setLoading(false); });
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-heading font-bold mb-2">Leaderboard</h1>
      <p className="text-muted-foreground mb-8">Top investment ideas ranked by score.</p>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {["#", "Ticker", "Direction", "Score", "Risk", "University", "Submitted"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></td></tr>
              ) : ideas.map((idea, i) => (
                <tr key={idea.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/idea/${idea.id}`} className="font-mono font-medium text-foreground hover:text-primary transition-colors">
                      {idea.ticker}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><DirectionArrow direction={idea.direction} /></td>
                  <td className="px-4 py-3">
                    {idea.status === "failed" ? (
                      <span className="text-danger font-medium text-xs">Error</span>
                    ) : idea.overall_score !== null ? (
                      <ScoreBadge score={idea.overall_score} />
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">{idea.risk_tag ? <RiskPill risk={idea.risk_tag} /> : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{idea.university || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{format(new Date(idea.created_at), "MMM d, HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
