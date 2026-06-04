# Design Prompt — AI Finance Tracker Web App

Use this prompt with any AI design tool (v0.dev, Vercel v0, Galileo AI, Figma AI, or Claude itself).

---

## Prompt

Design a **personal AI finance tracker web app** called **"Flo"** — a minimalist, modern money management tool built for young professionals in Southeast Asia. The app should feel like a premium product: calm, focused, and intelligent — not flashy or corporate.

---

### Visual Identity

**Aesthetic direction:** Refined minimalism with warm depth. Think Notion meets Linear meets a high-end banking app. Clean surfaces, intentional whitespace, subtle warmth. Nothing decorative that doesn't serve the data.

**Color palette:**

- Background: `#0F0F10` (near-black, not pure black — warmer)
- Surface / card: `#1A1A1E` (slightly lifted from background)
- Surface elevated: `#242428` (modals, dropdowns, FAB)
- Primary accent: `#7C6EF7` (soft violet — trust, intelligence, calm)
- Accent secondary: `#4ECDC4` (teal — positive values, savings, gains)
- Danger / over budget: `#FF6B6B` (soft red — never harsh)
- Text primary: `#F0EFE9` (warm white — not pure #FFFFFF)
- Text secondary: `#8A8A8A`
- Text muted: `#4A4A4A`
- Border: `rgba(255, 255, 255, 0.06)` (barely-there separation)

**Typography:**

- Display / headings: `Geist` or `DM Sans` — geometric, clean, modern
- Body / UI: `Inter` — only acceptable here because it pairs with the display font
- Numbers / amounts: `Geist Mono` — monospaced for financial data alignment
- Font sizes: tight scale — 12 / 14 / 16 / 20 / 28 / 40px

**Borders & Radius:**

- Cards: `12px` border radius
- Inputs, buttons: `8px`
- FAB / pill buttons: `9999px` (fully rounded)
- No harsh borders — use `box-shadow: 0 0 0 1px rgba(255,255,255,0.06)` instead

**Elevation system:**

- Background → Surface → Elevated — three levels only, no more
- Use subtle box shadows (`0 2px 8px rgba(0,0,0,0.4)`) for elevation, not borders

---

### Pages to Design

#### 1. Dashboard (main page)

Layout: sidebar (240px) + main content area

**Sidebar:**
- App name "Flo" with a small violet dot logo
- Navigation links: Dashboard, Transactions, Budget, Insights
- Bottom: avatar + name + settings gear icon
- Active state: violet left-border accent + slightly brighter text

**Main content — top row (summary cards, 3 across):**
- "Spent this month" — large number in `Geist Mono`, subtitle "of ₱25,000 budget"
- "Biggest category" — category icon + name + amount
- "Days left" — number of days until month end + daily budget remaining

**Main content — charts row:**
- Left (60%): Line chart — "Spending over time" — last 30 days — use the teal accent for the line, a subtle violet fill under the curve
- Right (40%): Donut chart — "By category" — 5–6 slices, use a curated palette: violet, teal, amber, coral, slate, sage

**Main content — recent transactions:**
- Table-style list, no harsh grid lines — just spacing
- Each row: category icon (colored dot) · description · date · amount (red if expense, teal if income)
- Hover state: subtle `#1E1E22` background shift

---

#### 2. Transaction List page

- Search bar at top (full width, `#1A1A1E` bg, icon left)
- Filter pills: All · Food · Transport · Bills · Entertainment · Health
- Transaction rows grouped by date ("Today", "Yesterday", "Nov 12")
- Each row: 48px height · icon · description + auto-category badge · amount
- Category badge: small pill, colored background at 15% opacity, matching text color

---

#### 3. Quick Entry — FAB (Floating Action Button)

This is the most important UI element. Design it with care.

**Closed state:**
- Fixed bottom-right: `bottom: 28px; right: 28px`
- A pill button: `+ Add` with a soft violet background (`#7C6EF7`)
- Subtle pulse animation — a soft glow ring that breathes every 3 seconds
- On hover: slightly lighter, scale up 1.02x

**Open state (slide-up drawer, 380px wide, full mobile width):**
- Appears from the bottom with a spring animation (not linear — use ease-out spring)
- Dark backdrop blur behind it (`backdrop-filter: blur(8px)` + `rgba(0,0,0,0.6)`)
- Drawer background: `#1A1A1E`, top radius `20px`
- Drag handle bar at top (40px × 4px, `rgba(255,255,255,0.15)`)

**Inside the drawer:**
- Title: "New entry" in 16px medium
- Description input (large, 20px, auto-focus) — placeholder: "What did you spend on?"
- As user types: AI category suggestion appears as a pill below the input — e.g. 🍔 Food · 85% match — with a subtle shimmer/typing animation while AI is thinking
- Amount input: large `Geist Mono` number, currency prefix `₱` fixed to left, auto-select on focus
- Date: defaults to today, tappable to change
- Category: auto-filled from AI, tappable to override — opens a bottom sheet with category grid
- Save button: full width, violet, rounded, 52px height — label "Save entry"
- Keyboard-aware: drawer slides up when keyboard appears on mobile

---

#### 4. Insights page

- Hero section: AI-generated monthly summary in a card — violet left border accent, italic serif quote style for the AI text, "Generated by AI" badge in top right
- Below: 3 insight cards
  - "Dining out is up 40% this month" — with a small inline sparkline
  - "You're on track to save ₱4,200 this month" — teal accent
  - "3 subscriptions you haven't used in 30 days" — with a list below
- Tone: warm, non-judgmental. The AI sounds like a smart friend, not a bank

---

### Mobile Considerations

- Sidebar collapses to a bottom tab bar on mobile (4 tabs: Dashboard, Transactions, Budget, Insights)
- FAB moves to `bottom: 80px` on mobile to sit above the tab bar
- Cards stack vertically
- Charts are touch-friendly — tap a slice/point to see the value

---

### Motion & Micro-interactions

- Page transitions: fade + 4px upward slide (150ms ease-out)
- Numbers animate when they change — count up/down (300ms)
- Chart lines draw on enter (600ms ease-out)
- Donut chart segments fan in with a stagger (80ms delay per segment)
- FAB drawer: spring physics — `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot)
- Category suggestion in FAB: shimmer skeleton → pill snap-in (200ms)
- Hover states everywhere: 120ms ease — no jarring instant transitions

---

### What to Avoid

- No white backgrounds — this is a dark-mode-first app
- No rainbow color palettes — curated, intentional colors only
- No rounded cards with drop shadows that look like Bootstrap
- No gradient text (it's 2024, not 2018)
- No loading spinners — use skeleton screens instead
- No modal dialogs for simple actions — use drawers and inline states
- No font sizes below 12px

---

### Reference Aesthetic

If you need visual reference points: Linear.app (precision + dark surfaces) · Vercel dashboard (data density + clean type) · Raycast (dark + violet accent + speed) · Stripe Dashboard (trust + financial data clarity)

The app should feel like it was designed by someone who cares deeply about both money and good software. Calm intelligence. Zero noise.