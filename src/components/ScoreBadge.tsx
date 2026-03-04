import { cn } from "@/lib/utils";

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 67 ? "bg-success/15 text-success" : score >= 34 ? "bg-warn/15 text-warn" : "bg-danger/15 text-danger";
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 font-mono text-sm font-medium", color)}>
      {score}
    </span>
  );
}

export function RiskPill({ risk }: { risk: "Low" | "Medium" | "High" }) {
  const color = risk === "Low" ? "bg-success/15 text-success" : risk === "Medium" ? "bg-warn/15 text-warn" : "bg-danger/15 text-danger";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", color)}>
      {risk}
    </span>
  );
}

export function DirectionArrow({ direction }: { direction: "LONG" | "SHORT" }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-mono text-sm font-medium", direction === "LONG" ? "text-success" : "text-danger")}>
      {direction === "LONG" ? "▲" : "▼"} {direction}
    </span>
  );
}
