# Cipher Protocol — Demo Video Script

**Duration:** 3 minutes  
**Style:** Screen recording with voiceover, clean dark UI  
**Tone:** Professional, confident, technical but accessible

---

## Scene 1: Hook (0:00–0:15)

**Visual:** Cipher Protocol logo animation (shield hexagon with "C" cipher) on dark background. Text fades in: "Autonomous AML/KYC for Arc."

**Voiceover:**
> "Enterprises want to adopt Arc. But compliance is the barrier. Manual KYC costs millions. Cross-chain investigations take days. Sanctions lists change hourly. Cipher Protocol solves this — with five autonomous agents that monitor, score, screen, and report on every transaction on Arc in under 500 milliseconds."

---

## Scene 2: The Problem (0:15–0:35)

**Visual:** Split screen. Left side: Graph showing $2–5M annual compliance cost. Right side: Transaction flow with red X marks showing delays.

**Voiceover:**
> "Today, compliance means teams of analysts reviewing every flagged transaction. It takes hours per case. Cross-chain laundering — bridges, mixers, swaps across 8+ chains — is essentially invisible to single-chain monitors. And regulators are demanding real-time controls. The old model doesn't scale to Arc's sub-second settlement."

---

## Scene 3: Architecture Overview (0:35–0:55)

**Visual:** Animated diagram showing 5 connected hexagons forming a pipeline. Each lights up sequentially. Arc blockchain icon on the left, decision output (approve/hold/block) on the right.

**Voiceover:**
> "Cipher Protocol deploys five specialized agents. Each agent has its own wallet via Circle Agent Stack. They communicate through our orchestrator — a deterministic pipeline. Here's how it works."

---

## Scene 4: Agent Pipeline — Live Demo (0:55–2:15)

**Visual:** Screen recording of the dashboard's Agent Pipeline Demo component. Camera slowly scrolls through each step as it processes.

**Step 1 — Transaction Monitor (0:55–1:05)**
> "Agent one — Transaction Monitor. It validates the incoming Arc transaction, checking amount, timing, and sender history. For this $5,000 payment: clean. No flags."

**Step 2 — Risk Scorer (1:05–1:20)**
> "Agent two — Risk Scorer. It applies our OpenAML-trained XGBoost model. Score: 8 out of 100. Low risk. But now let's see what happens with a suspicious pattern. $150,000 at 3 AM to a new address. Score jumps to 92."

**Step 3 — Cross-Chain Intel (1:20–1:40)**
> "Agent three — Cross-Chain Intelligence. This is where Cipher Protocol differentiates. It calls Circle App Kits — Bridge Kit, Swap Kit, Unified Balance — to trace wallet activity across every chain. It detects the sender bridged from a mixing service three hours ago, then swapped USDC for EURC. Thirty points added to risk score. No single-chain system catches this."

**Step 4 — Sanctions Screener (1:40–1:55)**
> "Agent four — Sanctions Screener. It checks sender and recipient against OFAC, EU, and UN sanctions lists. Real-time. For the normal transaction: clear. For the sanctioned address: instant block."

**Step 5 — Reporting Agent (1:55–2:15)**
> "Agent five — Reporting Agent. If risk exceeds threshold, it generates a Suspicious Activity Report autonomously. SAR ID, transaction evidence, agent decisions — all filed in under a second. The report is saved to our audit trail and ready for regulator submission."

---

## Scene 5: Circle Integration (2:15–2:35)

**Visual:** Dashboard's Circle Product Usage component showing real-time call counts. Zoom into the live counter incrementing.

**Voiceover:**
> "Every agent call is tracked. Every Circle product used — App Kits for cross-chain intelligence, Agent Stack for autonomous wallets, Nanopayments for per-transaction compliance fees. The dashboard shows live usage: 168 integration calls during this demo, all successful. This is deep Circle product integration, not surface-level mentions."

---

## Scene 6: Cost & Impact (2:35–2:50)

**Visual:** Animated comparison card. Manual: $2–5M/year. Cipher: <$50K/year. ROI badge: 49x.

**Voiceover:**
> "The economics: manual compliance costs enterprises $2 to $5 million annually. Cipher Protocol costs less than $50,000. At $0.001 per transaction via Nanopayments, it scales from 1,000 to 10 million transactions without adding headcount. 49x ROI in year one."

---

## Scene 7: CTA (2:50–3:00)

**Visual:** Logo centered. Three links: GitHub, API Docs, Deployment Guide. Text: "Built for the Agentic Economy on Arc."

**Voiceover:**
> "Cipher Protocol — the compliance layer Circle needs for production. Open source, MIT licensed, live on Arc Testnet. Deploy your own agents, or integrate via our API. The agentic economy needs autonomous compliance. We built it."

---

## Production Notes

**Audio:**
- Use a professional voiceover artist (or clear, slow narration)
- Background music: Low, ambient, tech-focused (synth pads, subtle pulse)

**Screen Recording:**
- Record at 2560x1440, 60fps
- Cursor movements should be slow and deliberate
- Zoom into the Agent Pipeline Demo component for the main walkthrough
- Show the terminal autonomous demo for 5 seconds as a overlay at 1:15

**Captions:**
- Add white-on-dark captions for accessibility
- Highlight key metrics in bold or accent color (cyan)

**Thumbnail:**
- Logo shield on left, code terminal on right
- Text: "Real-Time AML/KYC on Arc"
- Subtitle: "5 Autonomous Agents · <500ms · 99% Cost Reduction"
