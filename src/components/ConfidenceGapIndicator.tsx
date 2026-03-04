import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ConfidenceGapIndicatorProps {
  confidence_gap: number | null;
  user_confidence: number;
  overall_score: number | null;
}

export function ConfidenceGapIndicator({
  confidence_gap,
  user_confidence,
  overall_score,
}: ConfidenceGapIndicatorProps) {
  // Calculate confidence gap if not provided
  const gap = confidence_gap !== null 
    ? confidence_gap 
    : overall_score !== null 
      ? user_confidence * 10 - overall_score 
      : null;

  if (gap === null || gap < 25) {
    return null;
  }

  return (
    <Alert className="mb-8 border-warn/50 bg-warn/10">
      <AlertTriangle className="h-4 w-4 text-warn" />
      <AlertTitle className="text-warn font-medium">
        High Conviction vs Weaker Data Support
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground mt-1">
        Your confidence level ({user_confidence}/10) significantly exceeds the calculated score
        ({overall_score?.toFixed(1)}/100). Confidence gap: <span className="font-mono font-medium text-foreground">+{gap.toFixed(1)}</span>
      </AlertDescription>
    </Alert>
  );
}
