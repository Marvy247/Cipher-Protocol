# Demo Video Script — Cipher Protocol

**Total length**: 3:05  
**Tone**: Professional, fast-paced, confident  
**Music**: Low-energy ambient/cinematic (starts subtle, builds at 1:40, swells at close)  
**Delivery**: Clear, steady — no rushing

---

## 0:00 – 0:20 | Hook + Problem

**Visual**: Full-screen landing page at `cipher-protocol.vercel.app`. Hero section visible with "Autonomous AML Compliance for the Arc blockchain" headline. Slowly scroll down to the ROI cards.  
**Text overlay**: "AML compliance costs fintechs $2–5M per year."

**Narrator**:
> Every year, fintechs and crypto platforms spend millions on compliance — hiring teams, buying licenses, stitching together sanctions lists.
> The cost of being compliant is so high that most startups just... skip it.
> We built Cipher Protocol to change that.

---

## 0:20 – 1:00 | The Product

**Visual**: Zoom to the ROI comparison cards. Red card "$2-5M" → green card "<$50K" → glow on "49x ROI".  
**Visual**: Fade to the dashboard. Slow scroll from the top: the 4 stat cards (Transactions, Flagged, Blocked, Processing), then pause on the **Agent Flow Sankey** — the animated 5-agent pipeline flowing into APPROVE / HOLD / BLOCKED branches.

**Narrator**:
> Cipher Protocol is the first autonomous AML/KYC layer built natively for the Arc blockchain.
> Five specialized AI agents work together to screen every transaction — from monitoring and risk scoring to cross-chain intelligence, sanctions screening, and regulatory reporting.
> Every transaction flows through the same pipeline, then branches into an approved, hold, or blocked outcome — automatically.

**Visual**: Continue scrolling — On-Chain Proof panel and Revenue Chart come into view. Mouse over the chart's last bar.

**Narrator**:
> It's enterprise-grade compliance at 49x lower cost — and every check is settled on-chain using Circle USDC.

---

## 1:00 – 1:35 | Live Demo — Run a Compliance Check

**Visual**: Scroll to the Live Compliance Check. Click "Normal ($5K USDC)". Click the big "Run Live Compliance Check" button.

**Narrator**:
> Let's see it in action. I'll select a normal $5,000 USDC transaction and run all five agents live.

**Visual**: Watch the agent steps reveal one by one — Monitor, Risk Scorer, Cross-Chain Intel, Sanctions Screener, Reporting Agent. Pause on the pulsing "Processing" badge of each.

**Narrator**:
> The Transaction Monitor parses and validates the input.
> The Risk Scorer assigns a score — eight out of one hundred, low risk.
> Cross-Chain Intel finds no multi-chain layering.
> Sanctions Screener clears OFAC, EU, and UN lists.
> The Reporting Agent confirms — no SAR needed.

**Visual**: The decision panel springs in — green APPROVE verdict, $0.001 USDC fee badge, the big "View Transaction on Arcscan" button.

**Narrator**:
> Final decision: APPROVE. Total time: under half a second.
> A $0.001 USDC compliance fee is charged on-chain — settled via Circle.

---

## 1:35 – 1:55 | On-Chain Proof — The Receipt

**Visual**: Click "View Transaction on Arcscan". The browser opens the real Arcscan tx page — show the USDC transfer, from/to addresses, block confirmation. Close the tab.

**Visual**: Back on the dashboard, scroll up to the **On-Chain Proof** panel. Point at the list of settled payments and the live count badge.

**Narrator**:
> Here's the receipt — a real USDC transfer on the Arc testnet, confirmed on-chain.
> It streams into our proof feed live. These aren't mock numbers — every entry is pulled straight from the Arc blockchain, and every one is verifiable on Arcscan.
> This is the audit trail Jinja regulatory teams ask for — automatic, and free to verify.

---

## 1:55 – 2:20 | Payment Failure → Report Locked

**Visual**: Click the "Payment failure" toggle in the Live Compliance Check. Click "Run Again." Watch the same 5 agents run, then the red panel springs in: "REPORT LOCKED — payment required," with "Final decision: withheld."

**Narrator**:
> Here's the business model in action.
> I'll simulate a failed $0.001 USDC payment — watch what happens.
> The agents do all the work, but the compliance report stays locked until the payment settles.
> Pay-per-check isn't just our pricing — it enforces autonomous settlement.

**Visual**: Click "Run with payment". The green APPROVE verdict returns with the on-chain Arcscan button.

**Narrator**:
> Rerun with payment — and it's approved instantly, fee settled on-chain.

---

## 2:20 – 2:40 | Revenue + Sanctions Heatmap

**Visual**: Scroll to the **Compliance Fee Revenue** chart. Hover the today bar, then point at "Projected annual revenue" and "49x cheaper" card.

**Narrator**:
> Every check grows a real revenue stream — thirty days of fee data, projected annual revenue, at 1/49th the cost of legacy compliance.

**Visual**: Continue scrolling to the **OFAC Sanctions Heatmap**. Hover a clean (green) cell, then hover a red sanctioned cell — show the flagged list pop in.

**Narrator**:
> And this is our live sanctions exposure map — hundreds of counterparties screened against OFAC, EU, and UN consolidated lists.
> One glance shows you exactly where your money is touching high risk.

---

## 2:40 – 3:00 | The API Playground

**Visual**: Scroll to the top of the landing page, click "Playground" in the nav (or scroll down). The Verify box is empty. Type or paste a random-looking hash. Click "Verify — Suspicious". Watch the 5 steps stream in, then the red BLOCK verdict + the settled-fee receipt button.

**Narrator**:
> Anyone can open this URL and run the same pipeline on their own transaction — no account, no setup.
> I'll paste a hash, pick Suspicious, and verify.
> Five agents, a verdict, and a payable on-chain fee — in seconds.
> That's compliance as a service, available to every builder on Arc.

---

## 3:00 – 3:05 | Close + CTA

**Visual**: Quick cut back to the hero with "Run Live Check" button centered.  
**Text overlay**: "cipher-protocol.vercel.app" + "Presented at [hackathon name]".

**Narrator**:
> Cipher Protocol — autonomous AML compliance for the Arc blockchain.
> Real agents, real on-chain settlements, real compliance.
> Try it yourself at the link on screen.

---

## Production Notes

**Audio**: Use a directional lavalier mic. Record in a quiet room with soft furnishings to reduce echo.

**Screen recording**: 2560x1440 at 60fps. Cursor should be clearly visible with a highlight halo. Zoom in on UI interactions (button clicks, hover states, Arcscan page). For the Playground section, zoom into the input on focus — a big cursor makes the typing feel live.

**Pacing**: Speak at ~150 words/min. Pause 0.5s between major section transitions (the beat between "Hook" → "Product" → "Demo" → "Proof" → "Payment" → "Heatmap" → "Playground").

**Captions**: Add burned-in subtitles (white text with black drop shadow, bottom third). Keep on-screen text overlays to 2 words.

**B-roll inserts**: If possible, capture a phone recording of someone swiping through the Gamma pitch deck as a 3-second insert during the "cost problem" section.

**Music**: Recommend "Circuitry" by Ben Winwood or "Entropy" by Daniel Deuschle — available on Epidemic Sound / Artlist. Low drone that doesn't compete with narration.