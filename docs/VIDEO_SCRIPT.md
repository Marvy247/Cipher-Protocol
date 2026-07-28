# Demo Video Script — Cipher Protocol

**Total length**: 2:45  
**Tone**: Professional, fast-paced, confident  
**Music**: Low-energy ambient/cinematic (starts subtle, builds at 1:30)  
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
**Visual**: Fade/transition to the dashboard page. Show the full dashboard overview — the 4 stat cards (Transactions, Flagged, Blocked, Processing), the Live Transactions stream on the left, Agent Status on the right.

**Narrator**:  
> Cipher Protocol is the first autonomous AML/KYC layer built natively for the Arc blockchain.  
> Five specialized AI agents work together to screen every transaction — from monitoring and risk scoring to cross-chain intelligence, sanctions screening, and regulatory reporting.  
> The result: enterprise-grade compliance at 49x lower cost.

**Visual**: Scroll down to the "Compliance Pipeline" 5-step visual. Briefly highlight each step.

**Narrator**:  
> Each agent operates independently, runs in milliseconds, and leaves a full audit trail.  
> And every compliance check is settled on-chain using Circle USDC.

---

## 1:00 – 1:40 | Live Demo — Run a Compliance Check

**Visual**: Click the "Run Live Compliance Check" button. Show the empty state with the 3 scenario buttons (Normal, Suspicious, Sanctioned). Click "Normal ($5K USDC)". Click the big "Run Live Compliance Check" button.

**Narrator**:  
> Let's see it in action.  
> I'll select a normal $5,000 USDC transaction and run all five agents live.

**Visual**: Watch the agent steps reveal one by one — Monitor completes, Risk Scorer completes, Cross-Chain Intel completes, Sanctions Screener completes, Reporting Agent completes. Show the pulsing "Processing" badge on each current step.

**Narrator**:  
> The Transaction Monitor parses and validates the input.  
> The Risk Scorer assigns a risk score — eight out of one hundred, low risk.  
> Cross-Chain Intel checks for multi-chain layering — none found.  
> Sanctions Screener checks OFAC, EU, and UN lists — all clear.  
> The Reporting Agent confirms: no SAR needed.

**Visual**: The decision panel springs in — green APPROVE verdict, $0.001 USDC fee badge, and the big "View Transaction on Arcscan" button.

**Narrator**:  
> Final decision: APPROVE. Total time: less than half a second.  
> A $0.001 USDC compliance fee is charged on-chain — settled via Circle.

---

## 1:40 – 2:15 | On-Chain Proof

**Visual**: Hover over the "View Transaction on Arcscan" button — show the hover glow effect. Click it. The browser opens Arcscan to the real tx page. Show the Arcscan page — the USDC transfer, the from/to addresses, the block confirmation.

**Narrator**:  
> Here's the proof — a real USDC transfer on the Arc testnet, confirmed in block 54,111,971.  
> The sender is our compliance wallet. The recipient is the Cipher Protocol gateway.  
> Every single compliance check generates this same on-chain proof.

**Visual**: Close Arcscan tab. Back on the dashboard, scroll up to the "Circle Product Usage" section. Show the call counters incrementing.

**Narrator**:  
> Every Circle integration call is tracked in real-time — App Kits, Nanopayments, Agent Stack, Arc RPC.  
> Judges can see exactly how many API calls were made, success rates, and latency.  
> Full transparency into the integration.

---

## 2:15 – 2:35 | Suspicious & Sanctioned Scenarios

**Visual**: Click "Suspicious ($150K)" scenario, then "Run Again". Watch the pipeline run. Show the amber "HOLD_FOR_REVIEW" verdict.

**Narrator**:  
> Let's try a suspicious scenario — $150,000 USDC at 3 AM from a new address.  
> The Risk Scorer flags it at 92 out of 100. Cross-Chain Intel detects a bridge from a mixer.  
> Final decision: HOLD_FOR_REVIEW. A SAR is automatically filed.

**Visual**: Click "Sanctioned (OFAC)" scenario, then "Run Again". Show the red "BLOCK" verdict.

**Narrator**:  
> And if someone tries to send funds to an OFAC-sanctioned address — the pipeline blocks it instantly.  
> Three scenarios, one pipeline, real results.

---

## 2:35 – 2:45 | Close + CTA

**Visual**: Zoom out to full dashboard. Then fade to the landing page hero with the "Run Live Check" button centered.

**Text overlay**: "cipher-protocol.vercel.app" + "Presented at [hackathon name]"

**Narrator**:  
> Cipher Protocol — autonomous AML compliance for the Arc blockchain.  
> Real agents, real on-chain settlements, real compliance.  
> Try it yourself at the link on screen.

---

## Production Notes

**Audio**: Use a directional lavalier mic. Record in a quiet room with soft furnishings to reduce echo.

**Screen recording**: 2560x1440 at 60fps. Cursor should be clearly visible with a highlight halo. Zoom in on UI interactions (button clicks, hover states, Arcscan page).

**Pacing**: Speak at ~150 words/min. Pause 0.5s between major section transitions (the beat between "Hook" → "Product" → "Demo" → "Proof").

**Captions**: Add burned-in subtitles (white text with black drop shadow, bottom third). This significantly improves retention, especially for viewers watching without sound.

**B-roll inserts**: If possible, capture a phone recording of someone swiping through the Gamma pitch deck as a 3-second insert during the "cost problem" section.

**Music**: Recommend "Circuitry" by Ben Winwood or "Entropy" by Daniel Deuschle — available on Epidemic Sound / Artlist. Low drone that doesn't compete with narration.
