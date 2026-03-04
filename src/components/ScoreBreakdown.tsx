import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreBreakdownProps {
  return_score: number | null;
  vol_penalty: number | null;
  dd_penalty: number | null;
  risk_penalty: number | null;
  overall_score: number | null;
}

export function ScoreBreakdown({
  return_score,
  vol_penalty,
  dd_penalty,
  risk_penalty,
  overall_score,
}: ScoreBreakdownProps) {
  if (
    return_score === null ||
    vol_penalty === null ||
    dd_penalty === null ||
    risk_penalty === null ||
    overall_score === null
  ) {
    return null;
  }

  const formatScore = (value: number) => value.toFixed(1);

  const breakdownItems = [
    {
      label: "Return Score",
      value: return_score,
      formatted: formatScore(return_score),
      description: "Based on 6-month return",
      color: "text-success",
    },
    {
      label: "Volatility Penalty",
      value: vol_penalty,
      formatted: formatScore(vol_penalty),
      description: "Based on 30-day volatility",
      color: "text-warn",
    },
    {
      label: "Drawdown Penalty",
      value: dd_penalty,
      formatted: formatScore(dd_penalty),
      description: "Based on max drawdown",
      color: "text-warn",
    },
    {
      label: "Risk Penalty",
      value: risk_penalty,
      formatted: formatScore(risk_penalty),
      description: "60% vol + 40% drawdown",
      color: "text-danger",
    },
    {
      label: "Overall Score",
      value: overall_score,
      formatted: formatScore(overall_score),
      description: "75% return + 25% risk-adjusted",
      color: "text-primary",
      isOverall: true,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Score Breakdown
      </h2>
      <div className="space-y-3">
        {breakdownItems.map((item) => (
          <Card
            key={item.label}
            className={`p-4 border-border/50 ${item.isOverall ? "bg-primary/5 border-primary/20" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <span className={`font-mono text-lg font-bold ${item.color}`}>
                {item.formatted}
              </span>
            </div>
            <Progress value={item.value} className="h-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}
