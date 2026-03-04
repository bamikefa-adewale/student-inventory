import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ComputedMetricsDisplayProps {
  return_6m: number | null;
  vol_30d: number | null;
  max_drawdown_6m: number | null;
}

export function ComputedMetricsDisplay({ return_6m, vol_30d, max_drawdown_6m }: ComputedMetricsDisplayProps) {
  if (return_6m === null || vol_30d === null || max_drawdown_6m === null) {
    return null;
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${(value * 100).toFixed(2)}%`;
  };

  const metrics = [
    {
      label: "6-Month Return",
      value: return_6m,
      formatted: formatPercent(return_6m),
      color: return_6m >= 0 ? "text-success" : "text-danger",
    },
    {
      label: "30-Day Volatility",
      value: vol_30d,
      formatted: formatPercent(vol_30d),
      color: "text-foreground",
    },
    {
      label: "Max Drawdown (6M)",
      value: max_drawdown_6m,
      formatted: formatPercent(max_drawdown_6m),
      color: "text-danger",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Computed Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </span>
              <span className={`font-mono text-sm font-medium ${metric.color}`}>
                {metric.formatted}
              </span>
            </div>
            <Progress 
              value={Math.min(100, Math.abs(metric.value) * 200)} 
              className="h-1.5" 
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
