# Project Explanation: Student Investment Idea Scoring Website

## Overview

This document explains the requirements for building an MVP (Minimum Viable Product) web application called **"Student Investment Idea Scoreboard"**. The project is a time-sensitive build (24-48 hours) that allows students to submit investment ideas and receive automated scoring based on market data analysis.

## Project Purpose

The application serves as a platform where users can:
- Submit investment ideas with a stock ticker and thesis
- Receive an automated score (0-100) based on market metrics
- View a leaderboard of all submitted ideas ranked by score
- See detailed breakdowns of how scores are calculated

## Technology Stack

### Frontend
- **Lovable** (or equivalent quick web builder) - for rapid UI development
- Clean and simple user interface

### Backend & Database
- **Supabase** - handles database and authentication
- **Backend API** - one of the following:
  - Node.js/Express
  - Python/FastAPI
  - Supabase Edge Function
- **Market Data Source**: Yahoo Finance (or similar) for stock price data

## Application Pages

### 1. Home Page
- Short description of the platform
- Two main action buttons:
  - "Submit an idea"
  - "View leaderboard"

### 2. Submit Idea Page
A form with the following fields:

**Required Fields:**
- `ticker` - Stock ticker symbol (e.g., AAPL, TSLA)
- `direction` - Either "LONG" or "SHORT"
- `horizon` - Investment time horizon: "1W", "1M", "3M", or "6M"
- `thesis_text` - Investment thesis (100-300 words)
- `user_confidence` - Confidence level from 1-10

**Optional Fields:**
- `display_name` - User's display name
- `university` - User's university

**On Submit:**
1. Data is saved to Supabase database
2. Backend scoring process is triggered
3. Computed metrics and scores are stored

### 3. Leaderboard Page
A table displaying all investment ideas sorted by `overall_score` (descending).

**Columns:**
- Ticker symbol
- Direction (LONG/SHORT)
- Overall score (0-100)
- Risk tag (Low/Medium/High)
- Created date/time
- Link to detailed view

### 4. Idea Detail Page
Shows comprehensive information about a single investment idea:

**User-Submitted Information:**
- Thesis text
- Direction, horizon, and user confidence

**Computed Metrics:**
- 6-month return (`return_6m`)
- 30-day volatility (`vol_30d`)
- Maximum drawdown over 6 months (`max_drawdown_6m`)

**Score Breakdown:**
- Individual component scores
- Overall score explanation

**Confidence Gap Indicator:**
- Shows when user confidence significantly exceeds the calculated score

## Scoring Algorithm

### Data Requirements
- Use daily adjusted close prices for the ticker
- Minimum 180 trading days of data required
- Preferred: 252 trading days (approximately 1 year)

### Core Metrics Calculation

#### 1. Return_6M (6-Month Return)
- **Time Period**: 126 trading days (approximately 6 months)
- **Formula**: `Return_6M = (Price_today / Price_126daysAgo) - 1`
- Example: If price today is $120 and 126 days ago was $100, return = 20%

#### 2. Vol_30D (30-Day Volatility)
- **Time Period**: Last 30 trading days
- **Calculation Steps**:
  1. Compute daily log returns for the last 30 days
  2. Calculate standard deviation of these returns
  3. Annualize: `Vol_30D = std(daily_returns_30D) * sqrt(252)`
- This gives annualized volatility percentage

#### 3. MaxDrawdown_6M (Maximum Drawdown)
- **Time Period**: Last 126 trading days
- **Method**: Running peak method
- Measures the largest peak-to-trough decline in price

### Score Normalization (0-100 Scale)

All metrics are normalized to a 0-100 scale using clipping and linear scaling:

#### ReturnScore
- **Formula**: `clip((Return_6M * 100 + 20) / 60 * 100, 0, 100)`
- **Mapping**:
  - -20% return → Score of 0
  - +40% return → Score of 100
  - Linear scaling between these points

#### VolPenalty (Volatility Penalty)
- **Formula**: `clip((Vol_30D * 100 - 15) / 35 * 100, 0, 100)`
- **Mapping**:
  - 15% volatility → 0 penalty (best)
  - 50% volatility → 100 penalty (worst)
- Higher volatility = higher penalty

#### DDPenalty (Drawdown Penalty)
- **Formula**: `clip((MaxDrawdown_6M * 100 - 10) / 30 * 100, 0, 100)`
- **Mapping**:
  - 10% drawdown → 0 penalty (best)
  - 40% drawdown → 100 penalty (worst)
- Higher drawdown = higher penalty

### Overall Score Calculation

**Step 1: Calculate Risk Penalty**
```
RiskPenalty = 0.6 * VolPenalty + 0.4 * DDPenalty
```
- Volatility weighted at 60%
- Drawdown weighted at 40%

**Step 2: Calculate Overall Score**
```
OverallScore = clip(0.75 * ReturnScore + 0.25 * (100 - RiskPenalty), 0, 100)
```
- Return score weighted at 75%
- Risk-adjusted component weighted at 25%
- Final score clipped to 0-100 range

### Risk Tag Assignment

Based on `RiskPenalty` value:
- **Low Risk**: RiskPenalty < 33
- **Medium Risk**: 33 ≤ RiskPenalty < 66
- **High Risk**: RiskPenalty ≥ 66 (original spec says "= 66", interpreted as ≥ 66)

### Confidence Gap Calculation

**Purpose**: Identify when users are overconfident compared to data

**Formula**:
```
ConfidenceScaled = user_confidence * 10
ConfidenceGap = ConfidenceScaled - OverallScore
```

**Indicator Trigger**:
- If `ConfidenceGap ≥ 25`, display: **"High conviction vs weaker data support"**
- This warns when user confidence (scaled 10-100) significantly exceeds the calculated score

## Database Schema

### Table: `investment_ideas`

#### User-Submitted Fields
- `id` (uuid, primary key, default: `uuid_generate_v4()`)
- `created_at` (timestamp, default: `now()`)
- `display_name` (text, nullable)
- `university` (text, nullable)
- `ticker` (text, required)
- `direction` (text, required) - Values: "LONG" or "SHORT"
- `horizon` (text, required) - Values: "1W", "1M", "3M", or "6M"
- `thesis_text` (text, required)
- `user_confidence` (integer, required) - Range: 1 to 10

#### Computed Fields (Backend-Generated)
- `status` (text, required, default: "pending") - Values: "pending", "scored", or "failed"
- `return_6m` (numeric, nullable)
- `vol_30d` (numeric, nullable)
- `max_drawdown_6m` (numeric, nullable)
- `return_score` (numeric, nullable)
- `vol_penalty` (numeric, nullable)
- `dd_penalty` (numeric, nullable)
- `risk_penalty` (numeric, nullable)
- `overall_score` (numeric, nullable)
- `risk_tag` (text, nullable) - Values: "Low", "Medium", or "High"
- `confidence_gap` (numeric, nullable)
- `error_message` (text, nullable) - Used when status = "failed"

## Backend Workflow

### Processing Flow

1. **User submits form** → Record inserted with `status = "pending"`

2. **Backend triggered** (via webhook, cron, or edge function):
   - Fetches historical price data for the ticker
   - Calculates all metrics (Return_6M, Vol_30D, MaxDrawdown_6M)
   - Computes normalized scores
   - Calculates overall score and risk tag
   - Updates the same database record with:
     - All computed fields
     - `status = "scored"`

3. **Error Handling**:
   - If ticker is invalid or data unavailable:
     - Set `status = "failed"`
     - Store error message in `error_message` field
     - Display error gracefully in UI

### Optional Optimization
- **Caching**: Cache results per ticker per day to avoid redundant API calls

## Acceptance Criteria

The MVP must pass these tests:

1. **Valid Ticker Test**: Submitting "AAPL" returns:
   - Valid `overall_score` between 0-100
   - `status = "scored"`
   - All computed fields populated

2. **Leaderboard Test**: 
   - Shows at least 5 demo submissions (developer can seed database)
   - Sorted correctly by score (descending)

3. **Detail Page Test**:
   - Displays all computed numbers correctly
   - Shows risk tags and labels properly

4. **Error Handling Test**:
   - Invalid ticker (e.g., "AAAAAAPPP") shows:
     - `status = "failed"`
     - Error message displayed gracefully
     - No crashes or broken UI

## Deliverables

1. **Live Deployed Application** - Working URL accessible to users
2. **Supabase Project** - Database tables with Row Level Security (RLS) configured
3. **Source Code** - Backend code in repository or zipped folder
4. **README Documentation** - Includes:
   - How to run the application
   - How to modify scoring weights
   - Environment variables setup
   - Note: The original spec mentions "how to run / change weights / environment variables"

## Timeline & Budget

- **Timeline**: 24-48 hours (must be completed within 1-2 days)
- **Budget**: Fixed price preferred (applicants should quote)
- **Application Requirement**: Share 1-2 examples of similar quick MVPs

## Optional Features (Nice-to-Haves)

Only implement if time allows:

1. **Price Chart**: Mini line chart showing last 6 months of price on idea detail page
2. **Time Filter**: "Top ideas this week" filter option
3. **Spam Protection**: Limit submissions per IP address

## Key Constraints & Considerations

1. **Data Availability**: Must handle cases where ticker data is unavailable
2. **Performance**: Consider caching to reduce API calls
3. **User Experience**: Error states must be handled gracefully
4. **Scoring Accuracy**: Must implement scoring algorithm exactly as specified
5. **Speed**: MVP focus - prioritize core functionality over polish

## Summary

This is a rapid MVP build that combines:
- **User-generated content** (investment ideas and theses)
- **Financial data integration** (Yahoo Finance API)
- **Automated scoring** (complex mathematical calculations)
- **Social features** (leaderboard and rankings)

The core value proposition is providing students with an objective, data-driven score for their investment ideas, helping them understand how market metrics support or contradict their thesis.
