export type IdeaStatus = "scored" | "pending" | "failed";
export type Direction = "LONG" | "SHORT";
export type Horizon = "1W" | "1M" | "3M" | "6M";
export type RiskTag = "Low" | "Medium" | "High";

export interface Idea {
  id: string;
  display_name: string;
  university: string;
  ticker: string;
  direction: Direction;
  horizon: Horizon;
  thesis_text: string;
  user_confidence: number;
  overall_score: number | null;
  risk_tag: RiskTag | null;
  status: IdeaStatus;
  created_at: string;
  // Computed fields from scoring algorithm
  return_6m: number | null;
  vol_30d: number | null;
  max_drawdown_6m: number | null;
  return_score: number | null;
  vol_penalty: number | null;
  dd_penalty: number | null;
  risk_penalty: number | null;
  confidence_gap: number | null;
  error_message: string | null;
}

const MOCK_IDEAS: Idea[] = [
  {
    id: "1",
    display_name: "Alex Chen",
    university: "MIT",
    ticker: "NVDA",
    direction: "LONG",
    horizon: "3M",
    thesis_text: "NVIDIA continues to dominate the AI chip market with its H100 and upcoming B200 GPUs. The company's data center revenue has grown over 400% YoY, and with enterprises accelerating AI infrastructure spending, this trend shows no signs of slowing. Their CUDA ecosystem creates a significant moat that AMD and Intel cannot easily replicate. The recent partnerships with major cloud providers and sovereign AI initiatives worldwide provide additional revenue catalysts. While the stock trades at a premium, the growth trajectory justifies the valuation given the total addressable market expansion in AI inference workloads.",
    user_confidence: 9,
    overall_score: 87,
    risk_tag: "Medium",
    status: "scored",
    created_at: "2026-03-01T10:30:00Z",
    return_6m: 0.35,
    vol_30d: 0.28,
    max_drawdown_6m: 0.15,
    return_score: 91.67,
    vol_penalty: 37.14,
    dd_penalty: 16.67,
    risk_penalty: 28.57,
    confidence_gap: 3,
    error_message: null,
  },
  {
    id: "2",
    display_name: "Sarah Kim",
    university: "Stanford",
    ticker: "AAPL",
    direction: "LONG",
    horizon: "6M",
    thesis_text: "Apple's services segment continues to grow at double digits, now representing over 25% of total revenue with significantly higher margins than hardware. The upcoming Vision Pro iteration and spatial computing platform opens an entirely new ecosystem opportunity. iPhone replacement cycles are shortening due to AI features requiring newer hardware, which should drive a super cycle. The company's installed base of over 2 billion devices provides an unmatched distribution advantage for new services and subscriptions. Capital returns through buybacks continue to provide floor support for the stock.",
    user_confidence: 7,
    overall_score: 72,
    risk_tag: "Low",
    status: "scored",
    created_at: "2026-03-01T14:15:00Z",
    return_6m: 0.18,
    vol_30d: 0.18,
    max_drawdown_6m: 0.08,
    return_score: 63.33,
    vol_penalty: 8.57,
    dd_penalty: 0,
    risk_penalty: 5.14,
    confidence_gap: -2,
    error_message: null,
  },
  {
    id: "3",
    display_name: "Anonymous",
    university: "Harvard",
    ticker: "TSLA",
    direction: "SHORT",
    horizon: "1M",
    thesis_text: "Tesla faces increasing competition in the EV market from Chinese manufacturers like BYD who offer comparable vehicles at significantly lower price points. Margins have been compressing due to repeated price cuts, and the Cybertruck has failed to achieve volume production targets. The autonomous driving narrative remains largely unfulfilled despite years of promises, and regulatory scrutiny is increasing. The stock trades at an extreme premium to traditional automakers without the revenue growth to justify it. Energy storage is growing but not fast enough to offset automotive margin pressure.",
    user_confidence: 6,
    overall_score: 45,
    risk_tag: "High",
    status: "scored",
    created_at: "2026-03-02T09:00:00Z",
    return_6m: -0.12,
    vol_30d: 0.45,
    max_drawdown_6m: 0.32,
    return_score: 13.33,
    vol_penalty: 85.71,
    dd_penalty: 73.33,
    risk_penalty: 80.57,
    confidence_gap: 15,
    error_message: null,
  },
  {
    id: "4",
    display_name: "Jordan Lee",
    university: "Wharton",
    ticker: "MSFT",
    direction: "LONG",
    horizon: "3M",
    thesis_text: "Microsoft's Azure cloud platform is the clear number two behind AWS and is gaining market share, particularly with enterprises adopting AI workloads through the OpenAI partnership. Copilot integration across the Office 365 suite creates a powerful upsell opportunity to their existing 400 million commercial users. The GitHub Copilot developer tool has already crossed 1.8 million paid subscribers, demonstrating willingness to pay for AI-enhanced productivity. LinkedIn continues its steady growth with increasing monetization. The company's diversified revenue streams and strong free cash flow generation make it a compelling risk-adjusted investment.",
    user_confidence: 8,
    overall_score: 79,
    risk_tag: "Low",
    status: "scored",
    created_at: "2026-03-02T11:30:00Z",
    return_6m: 0.22,
    vol_30d: 0.16,
    max_drawdown_6m: 0.09,
    return_score: 70,
    vol_penalty: 2.86,
    dd_penalty: 0,
    risk_penalty: 1.71,
    confidence_gap: 1,
    error_message: null,
  },
  {
    id: "5",
    display_name: "Priya Patel",
    university: "Columbia",
    ticker: "COIN",
    direction: "LONG",
    horizon: "1W",
    thesis_text: "Coinbase is well-positioned to benefit from the growing adoption of cryptocurrency trading and institutional interest in digital assets. The platform's regulatory compliance and strong brand recognition make it a preferred choice for both retail and institutional investors. As crypto markets mature and more traditional financial institutions enter the space, Coinbase stands to capture significant market share. The company's diversified revenue streams beyond trading fees, including staking and custody services, provide additional growth opportunities. While volatility remains a concern, the long-term trend toward digital asset adoption supports a bullish thesis.",
    user_confidence: 5,
    overall_score: 58,
    risk_tag: "High",
    status: "scored",
    created_at: "2026-03-03T08:00:00Z",
    return_6m: 0.12,
    vol_30d: 0.52,
    max_drawdown_6m: 0.28,
    return_score: 53.33,
    vol_penalty: 105.71,
    dd_penalty: 60,
    risk_penalty: 87.43,
    confidence_gap: -8,
    error_message: null,
  },
  {
    id: "6",
    display_name: "Anonymous",
    university: "",
    ticker: "XYZZ",
    direction: "LONG",
    horizon: "1M",
    thesis_text: "This is a test thesis for an invalid ticker symbol that should fail validation and scoring. The system should detect that XYZZ is not a real ticker and return an error status. We need at least one hundred words to pass the minimum word count validation so I am adding some additional text here to make sure we hit that threshold for testing purposes only and nothing more than that is needed.",
    user_confidence: 3,
    overall_score: 42,
    risk_tag: "Medium",
    status: "scored",
    created_at: "2026-03-03T07:45:00Z",
    return_6m: 0.05,
    vol_30d: 0.32,
    max_drawdown_6m: 0.18,
    return_score: 41.67,
    vol_penalty: 48.57,
    dd_penalty: 26.67,
    risk_penalty: 40,
    confidence_gap: -12,
    error_message: null,
  },
];

export function getLeaderboard(): Promise<Idea[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...MOCK_IDEAS].sort((a, b) => (b.overall_score ?? -1) - (a.overall_score ?? -1));
      resolve(sorted);
    }, 600);
  });
}

export function getIdeaById(id: string): Promise<Idea | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_IDEAS.find((i) => i.id === id) ?? null);
    }, 400);
  });
}

export function getStats(): Promise<{ ideas: number; universities: number; topScore: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const unis = new Set(MOCK_IDEAS.filter((i) => i.university).map((i) => i.university));
      const topScore = Math.max(...MOCK_IDEAS.filter((i) => i.overall_score !== null).map((i) => i.overall_score!));
      resolve({ ideas: MOCK_IDEAS.length, universities: unis.size, topScore });
    }, 300);
  });
}

let nextId = 7;
export function submitIdea(data: Omit<Idea, "id" | "overall_score" | "risk_tag" | "status" | "created_at" | "return_6m" | "vol_30d" | "max_drawdown_6m" | "return_score" | "vol_penalty" | "dd_penalty" | "risk_penalty" | "confidence_gap" | "error_message">): Promise<Idea> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.ticker === "XYZZ" || data.ticker === "FAKE") {
        reject(new Error("Invalid ticker symbol. Please enter a valid stock ticker."));
        return;
      }
      
      // Generate mock computed metrics
      const return_6m = (Math.random() * 0.6) - 0.2; // -20% to +40%
      const vol_30d = 0.15 + (Math.random() * 0.35); // 15% to 50%
      const max_drawdown_6m = 0.10 + (Math.random() * 0.30); // 10% to 40%
      
      // Calculate scores according to spec formulas
      const return_score = Math.max(0, Math.min(100, ((return_6m * 100 + 20) / 60) * 100));
      const vol_penalty = Math.max(0, Math.min(100, ((vol_30d * 100 - 15) / 35) * 100));
      const dd_penalty = Math.max(0, Math.min(100, ((max_drawdown_6m * 100 - 10) / 30) * 100));
      const risk_penalty = 0.6 * vol_penalty + 0.4 * dd_penalty;
      const overall_score = Math.max(0, Math.min(100, 0.75 * return_score + 0.25 * (100 - risk_penalty)));
      
      // Determine risk tag
      let risk_tag: RiskTag = "Low";
      if (risk_penalty >= 66) risk_tag = "High";
      else if (risk_penalty >= 33) risk_tag = "Medium";
      
      // Calculate confidence gap
      const confidence_scaled = data.user_confidence * 10;
      const confidence_gap = confidence_scaled - overall_score;
      
      const newIdea: Idea = {
        ...data,
        id: String(nextId++),
        overall_score: Math.round(overall_score * 100) / 100,
        risk_tag,
        status: "scored",
        created_at: new Date().toISOString(),
        return_6m: Math.round(return_6m * 10000) / 10000,
        vol_30d: Math.round(vol_30d * 10000) / 10000,
        max_drawdown_6m: Math.round(max_drawdown_6m * 10000) / 10000,
        return_score: Math.round(return_score * 100) / 100,
        vol_penalty: Math.round(vol_penalty * 100) / 100,
        dd_penalty: Math.round(dd_penalty * 100) / 100,
        risk_penalty: Math.round(risk_penalty * 100) / 100,
        confidence_gap: Math.round(confidence_gap * 100) / 100,
        error_message: null,
      };
      MOCK_IDEAS.push(newIdea);
      resolve(newIdea);
    }, 2000);
  });
}
