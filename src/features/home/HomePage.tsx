"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getStats } from "@/lib/mockData";
import { ArrowRight, BarChart3, GraduationCap, Trophy } from "lucide-react";

const defaultStats = { ideas: 0, universities: 0, topScore: 0 };

export function HomePage() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const statCards = [
    { label: "Ideas Submitted", value: stats.ideas, icon: BarChart3 },
    { label: "Universities", value: stats.universities, icon: GraduationCap },
    { label: "Top Score This Week", value: stats.topScore, icon: Trophy },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight leading-tight">
          Student Investment
          <br />
          <span className="text-primary">Scoreboard</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Submit your best stock thesis. We score it with real market data.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="gap-2">
            <Link href="/submit">Submit an Idea <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-2xl">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-border/50 bg-card p-5 glow-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <s.icon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-3xl font-mono font-medium text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
