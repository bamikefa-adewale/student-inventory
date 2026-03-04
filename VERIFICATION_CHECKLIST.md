# Verification Checklist: Project Description Coverage

This document verifies that all elements from `project_decription.md` are explained in `PROJECT_EXPLANATION.md`.

## ✅ Coverage Verification

### 1. Project Overview & Title
- ✅ Title: "Build MVP: Student Investment Idea Scoring Website"
- ✅ Description: MVP web app, 24-48 hours timeline
- ✅ Purpose: Scoreboard for investment ideas with automated scoring

### 2. Technology Stack
- ✅ Frontend: Lovable (or equivalent)
- ✅ Database/Auth: Supabase
- ✅ Backend options: Node/Express, Python/FastAPI, or Supabase Edge Function
- ✅ Market data: Yahoo Finance (or similar)

### 3. Application Pages

#### Home Page
- ✅ Short description of platform
- ✅ "Submit an idea" button
- ✅ "View leaderboard" button

#### Submit Idea Page
- ✅ All form fields covered:
  - ✅ display_name (optional)
  - ✅ university (optional)
  - ✅ ticker (required)
  - ✅ direction: LONG/SHORT (required)
  - ✅ horizon: 1W/1M/3M/6M (required)
  - ✅ thesis_text (required, 100-300 words)
  - ✅ user_confidence (required, 1-10)
- ✅ On submit behavior: Save to Supabase, trigger scoring, store computed fields

#### Leaderboard Page
- ✅ Table format
- ✅ Sorted by score descending
- ✅ All columns covered:
  - ✅ ticker
  - ✅ direction
  - ✅ overall_score (0-100)
  - ✅ risk_tag (Low/Medium/High)
  - ✅ created_at
  - ✅ link to details

#### Idea Detail Page
- ✅ Thesis + meta (direction, horizon, confidence)
- ✅ Computed metrics (6M return, 30D vol, max drawdown)
- ✅ Score breakdown
- ✅ "Confidence gap" indicator

### 4. Scoring Requirements

#### Data Source
- ✅ Daily adjusted close prices
- ✅ 252 trading days preferred, 180 minimum

#### Metrics Calculation
- ✅ Return_6M:
  - ✅ 126 trading days (6 months)
  - ✅ Formula: (Price_today / Price_126daysAgo) - 1
- ✅ Vol_30D:
  - ✅ Daily log returns for last 30 trading days
  - ✅ Formula: std(daily_returns_30D) * sqrt(252)
- ✅ MaxDrawdown_6M:
  - ✅ Last 126 trading days
  - ✅ Running peak method

#### Normalization (0-100)
- ✅ ReturnScore formula with clipping
- ✅ Mapping explanation (-20% to 0, +40% to 100)
- ✅ VolPenalty formula with clipping
- ✅ Mapping explanation (15% to 0, 50% to 100)
- ✅ DDPenalty formula with clipping
- ✅ Mapping explanation (10% to 0, 40% to 100)

#### Overall Score
- ✅ RiskPenalty = 0.6 * VolPenalty + 0.4 * DDPenalty
- ✅ OverallScore formula with weights (75% return, 25% risk-adjusted)

#### Risk Tag
- ✅ Low: RiskPenalty < 33
- ✅ Medium: 33 ≤ RiskPenalty < 66
- ✅ High: RiskPenalty ≥ 66

#### Confidence Gap
- ✅ ConfidenceScaled = user_confidence * 10
- ✅ ConfidenceGap = ConfidenceScaled - OverallScore
- ✅ Indicator trigger: ConfidenceGap ≥ 25
- ✅ Label: "High conviction vs weaker data support"

### 5. Important Constraints
- ✅ Invalid ticker handling: status = "failed" + error_message
- ✅ Graceful UI error display
- ✅ Caching per ticker per day (optional)

### 6. Supabase Schema

#### User-Submitted Fields
- ✅ id (uuid, pk, default uuid_generate_v4())
- ✅ created_at (timestamp, default now())
- ✅ display_name (text, nullable)
- ✅ university (text, nullable)
- ✅ ticker (text, required)
- ✅ direction (text, required) - LONG/SHORT
- ✅ horizon (text, required) - 1W/1M/3M/6M
- ✅ thesis_text (text, required)
- ✅ user_confidence (int, required) - 1 to 10

#### Computed Fields
- ✅ status (text, required, default "pending") - pending/scored/failed
- ✅ return_6m (numeric, nullable)
- ✅ vol_30d (numeric, nullable)
- ✅ max_drawdown_6m (numeric, nullable)
- ✅ return_score (numeric, nullable)
- ✅ vol_penalty (numeric, nullable)
- ✅ dd_penalty (numeric, nullable)
- ✅ risk_penalty (numeric, nullable)
- ✅ overall_score (numeric, nullable)
- ✅ risk_tag (text, nullable) - Low/Medium/High
- ✅ confidence_gap (numeric, nullable)
- ✅ error_message (text, nullable)

### 7. Backend Behavior
- ✅ When record inserted (status=pending):
  - ✅ Backend fetches price history
  - ✅ Computes metrics
  - ✅ Updates row with computed fields + status=scored
- ✅ Error handling: status=failed + error_message

### 8. Acceptance Tests
- ✅ AAPL submission test: valid score 0-100, status=scored
- ✅ Leaderboard test: at least 5 demo submissions, sorted correctly
- ✅ Detail page test: displays numbers and labels correctly
- ✅ Invalid ticker test: "AAAAAAPPP" shows status=failed gracefully

### 9. Deliverables
- ✅ Live deployed app link
- ✅ Supabase project (tables + RLS basic setup)
- ✅ Source code (backend) in repo or zipped folder
- ✅ README: how to run / change weights / environment variables

### 10. Timeline & Budget
- ✅ Timeline: 24-48 hours (today or tomorrow)
- ✅ Budget: Fixed price preferred
- ✅ Application requirement: Share 1-2 examples of similar quick MVPs

### 11. Optional Nice-to-Haves
- ✅ Mini line chart of last 6M price on idea detail page
- ✅ "Top ideas this week" filter
- ✅ Basic spam protection (limit submissions per IP)

## Summary

**✅ ALL REQUIREMENTS COVERED**

Every element from `project_decription.md` has been explained in detail in `PROJECT_EXPLANATION.md`. The explanation document provides:
- Clear structure and organization
- Detailed explanations of formulas and calculations
- Step-by-step breakdowns of complex processes
- Additional context and examples where helpful
- Complete coverage of all specifications

The explanation document is comprehensive and ready for use as a reference during development.
