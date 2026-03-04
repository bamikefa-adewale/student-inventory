"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { submitIdea, type Direction, type Horizon } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const directions: Direction[] = ["LONG", "SHORT"];
const horizons: Horizon[] = ["1W", "1M", "3M", "6M"];

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function SubmitIdeaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    display_name: "",
    university: "",
    ticker: "",
    direction: "" as Direction | "",
    horizon: "" as Horizon | "",
    thesis_text: "",
    user_confidence: 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const wc = wordCount(form.thesis_text);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.ticker.trim()) e.ticker = "Ticker is required";
    if (!form.direction) e.direction = "Pick a direction";
    if (!form.horizon) e.horizon = "Pick a horizon";
    if (wc < 100) e.thesis_text = "Minimum 100 words required";
    if (wc > 300) e.thesis_text = "Maximum 300 words allowed";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const idea = await submitIdea({
        display_name: form.display_name || "Anonymous",
        university: form.university,
        ticker: form.ticker.toUpperCase().trim(),
        direction: form.direction as Direction,
        horizon: form.horizon as Horizon,
        thesis_text: form.thesis_text.trim(),
        user_confidence: form.user_confidence,
      });
      toast({ title: "Idea scored successfully!", description: `Your score: ${idea.overall_score}/100` });
      router.push(`/idea/${idea.id}`);
    } catch (err: any) {
      toast({ title: "Scoring failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function setField(key: string, val: any) {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  }

  return (
    <div className="container max-w-xl py-12">
      <h1 className="text-3xl font-heading font-bold mb-2">Submit Your Idea</h1>
      <p className="text-muted-foreground mb-8">Share your stock thesis and we'll score it.</p>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Scoring your idea...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Display Name</Label>
            <Input placeholder="Anonymous" value={form.display_name} onChange={(e) => setField("display_name", e.target.value)} />
          </div>
          <div>
            <Label>University</Label>
            <Input placeholder="Your university" value={form.university} onChange={(e) => setField("university", e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Ticker *</Label>
          <Input placeholder="e.g. AAPL" value={form.ticker} onChange={(e) => setField("ticker", e.target.value.toUpperCase())} className="font-mono uppercase" />
          {errors.ticker && <p className="text-sm text-danger mt-1">{errors.ticker}</p>}
        </div>

        <div>
          <Label>Direction *</Label>
          <div className="flex gap-2 mt-1">
            {directions.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setField("direction", d)}
                className={cn(
                  "flex-1 rounded-md border px-4 py-2 text-sm font-mono font-medium transition-colors",
                  form.direction === d
                    ? d === "LONG" ? "border-success bg-success/10 text-success" : "border-danger bg-danger/10 text-danger"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {d === "LONG" ? "▲" : "▼"} {d}
              </button>
            ))}
          </div>
          {errors.direction && <p className="text-sm text-danger mt-1">{errors.direction}</p>}
        </div>

        <div>
          <Label>Horizon *</Label>
          <div className="flex gap-2 mt-1">
            {horizons.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setField("horizon", h)}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-sm font-mono font-medium transition-colors",
                  form.horizon === h ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {h}
              </button>
            ))}
          </div>
          {errors.horizon && <p className="text-sm text-danger mt-1">{errors.horizon}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Thesis *</Label>
            <span className={cn("text-xs font-mono", wc < 100 || wc > 300 ? "text-danger" : "text-muted-foreground")}>
              {wc}/300 words
            </span>
          </div>
          <Textarea
            placeholder="Explain your investment thesis (100–300 words)..."
            rows={8}
            value={form.thesis_text}
            onChange={(e) => setField("thesis_text", e.target.value)}
            className="mt-1"
          />
          {errors.thesis_text && <p className="text-sm text-danger mt-1">{errors.thesis_text}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Confidence</Label>
            <span className="font-mono text-sm text-primary">{form.user_confidence}/10</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[form.user_confidence]}
            onValueChange={([v]) => setField("user_confidence", v)}
            className="mt-2"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          Submit Idea
        </Button>
      </form>
    </div>
  );
}
