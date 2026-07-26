# Instructions for AI Agent Building This Project

## 🎯 YOUR MISSION

You are building **Cipher Protocol** - an autonomous AML/KYC compliance system for Arc blockchain that will win the Agentic Economy track of the Arc Hackathon.

**THIS IS CRITICAL:** This project solves Circle's #1 problem (enterprise adoption blocked by compliance costs) and uses ALL their products deeply. If built correctly, this WILL win.

---

## 📋 WHAT HAS BEEN PROVIDED

1. **PLAN.md** - Complete project overview, architecture, success criteria
2. **IMPLEMENTATION_GUIDE.md** - Days 1-3 (Foundation phase)
3. **IMPLEMENTATION_GUIDE_PART2.md** - Days 4-7 (Agent system)
4. **IMPLEMENTATION_GUIDE_PART3.md** - Days 15-21 (Circle integration)
5. **IMPLEMENTATION_GUIDE_PART4.md** - Days 22-28 (Dashboard & demo)
6. **.env.example** - Environment variables template
7. **scripts/setup.sh** - Quick setup script
8. **dashboard/** - Complete Next.js frontend (already provided by user)

---

## 🚀 IMPLEMENTATION STRATEGY

### Phase 1: Foundation (Days 1-7) - DO THIS FIRST
**Priority: CRITICAL**

1. **Day 1**: Backend API Server
   - Create all files in `backend/` as shown in IMPLEMENTATION_GUIDE.md
   - Set up FastAPI with WebSocket support
   - Test all endpoints work

2. **Day 2**: Arc Connection
   - Implement `integrations/arc_connector.py`
   - Verify connection to Arc Testnet
   - Test transaction fetching

3. **Day 3**: OpenAML Integration
   - Clone OpenAML repo: `https://github.com/finos-labs/dtcch-2025-OpenAML`
   - Copy models to `ml/models/openaml/`
   - Implement `ml/openaml_adapter.py` and `ml/feature_engineering.py`
   - Test risk scoring

4. **Days 4-5**: Basic Agents
   - Create `agents/base_agent.py`
   - Implement first 3 agents:
     - `agents/transaction_monitor.py`
     - `agents/risk_scorer.py`
     - `agents/sanctions_screener.py`
   - Test each agent individually

5. **Days 6-7**: Agent Orchestration
   - Install LangGraph: `pip install langgraph`
   - Implement `agents/orchestrator.py`
   - Test full pipeline: transaction → all agents → decision

**Checkpoint 1 (Day 7)**: You should have:
- ✅ Backend API running
- ✅ Arc connection working
- ✅ 3 agents processing transactions
- ✅ Basic orchestration working

### Phase 2: Circle Integration (Days 15-21) - MOST IMPORTANT
**Priority: CRITICAL - This is what wins!**

6. **Days 15-16**: App Kits Integration
   - Implement `integrations/app_kits.py`
   - Focus on the `detect_cross_chain_risk()` method - this is unique!
   - Create `agents/cross_chain_intel.py`
   - **KEY**: Show how App Kits detect sophisticated attacks

7. **Days 17-18**: Agent Stack & Nanopayments
   - Implement `integrations/agent_stack.py`
   - Create wallets for each agent
   - Implement `integrations/nanopayments.py`
   - Charge $0.001 per compliance check

8. **Days 19-20**: Reporting Agent
   - Implement `agents/reporting_agent.py`
   - Auto-generate SARs
   - Create compliance reports

9. **Day 21**: Update Orchestrator
   - Add all 5 agents to LangGraph workflow
   - Test end-to-end with all Circle products

**Checkpoint 2 (Day 21)**: You should have:
- ✅ All 5 agents working
- ✅ App Kits showing cross-chain intelligence
- ✅ Agents paying with USDC
- ✅ SARs auto-generated

### Phase 3: Dashboard & Demo (Days 22-28) - MAKE IT SHINE
**Priority: HIGH - Judges see this!**

10. **Days 22-23**: Connect Dashboard
    - Implement `dashboard/lib/api.ts`
    - Create `dashboard/hooks/use-realtime.ts`
    - Update `dashboard/components/dashboard-overview.tsx`
    - Test real-time WebSocket updates

11. **Days 24-25**: Demo Scenarios
    - Implement `scripts/demo_scenarios.py`
    - Test all 5 scenarios
    - Make sure they're impressive!

12. **Days 26-27**: Video & Presentation
    - Record 3-minute video following `docs/VIDEO_SCRIPT.md`
    - Create presentation deck
    - Practice demo until perfect

13. **Day 28**: Final Polish
    - Clean up code
    - Update README.md
    - Test everything one final time
    - Deploy and verify

---

## 🎯 CRITICAL SUCCESS FACTORS

### Must Have for Winning:

1. **All 5 Agents Working**
   - Transaction Monitor
   - Risk Scorer
   - Cross-Chain Intelligence (uses App Kits!)
   - Sanctions Screener
   - Reporting Agent

2. **Deep Circle Integration**
   - Agent Stack (wallets for each agent)
   - App Kits (Bridge, Swap, Send, Unified Balance)
   - Nanopayments ($0.001 per check)
   - USDC for all payments

3. **Real Arc Transactions**
   - Monitor actual Arc Testnet
   - Show real transaction hashes
   - Sub-second processing

4. **Impressive Demo**
   - Live dashboard with real-time updates
   - All 5 scenarios working flawlessly
   - 3-minute video that WOWs judges

5. **Clean Documentation**
   - README.md explains everything
   - Setup instructions work perfectly
   - Code is clean and commented

---

## ⚠️ COMMON PITFALLS TO AVOID

1. **Don't skip Circle products** - Must use ALL of them
2. **Don't fake the data** - Real Arc transactions only
3. **Don't overcomplicate** - Follow the provided structure
4. **Don't ignore the dashboard** - It must look professional
5. **Don't rush the demo** - Practice until perfect

---

## 📚 KEY RESOURCES

### Essential Reading:
1. **Arc Docs**: https://docs.arc.network
2. **Circle Agent Stack**: https://developers.circle.com/agent-stack
3. **App Kits**: https://developers.circle.com/app-kits
4. **OpenAML**: https://github.com/finos-labs/dtcch-2025-OpenAML
5. **LangGraph**: https://langchain-ai.github.io/langgraph/

### Get These Keys:
1. **Arc Testnet USDC**: https://faucet.circle.com
2. **Circle API Key**: https://console.circle.com
3. **OpenAI API Key**: https://platform.openai.com

### Contract Addresses (Arc Testnet):
- USDC: `0x3600000000000000000000000000000000000000`
- EURC: `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`
- Gateway Wallet: `0x0077777d7EBA4688BDeF3E311b846F25870A19B9`
- Arc RPC: `https://rpc.testnet.arc.network`

---

## 🔍 TESTING CHECKLIST

Before considering any phase complete, verify:

**Phase 1:**
- [ ] Backend runs without errors: `python backend/main.py`
- [ ] Can connect to Arc: Test with `tests/test_arc_connection.py`
- [ ] Risk scoring works: Test with sample transaction
- [ ] All endpoints return data: `curl http://localhost:8000/api/v1/agents/status`

**Phase 2:**
- [ ] All 5 agents process transactions
- [ ] Cross-chain intelligence shows App Kits data
- [ ] Agents have individual wallets (Agent Stack)
- [ ] Nanopayments charge fees
- [ ] SARs are auto-generated

**Phase 3:**
- [ ] Dashboard shows real-time data
- [ ] WebSocket connection stable
- [ ] All 5 demo scenarios work
- [ ] Video is exactly 3 minutes
- [ ] GitHub repo is clean

---

## 🎬 DEMO DAY CHECKLIST

**30 minutes before:**
- [ ] Backend running smoothly
- [ ] Dashboard loaded and responsive
- [ ] Demo scenarios tested
- [ ] Video queued up
- [ ] Presentation deck ready

**During demo:**
- [ ] Show live Arc transactions
- [ ] Demonstrate all 5 agents coordinating
- [ ] Highlight App Kits cross-chain intelligence
- [ ] Show auto-generated SAR
- [ ] Emphasize sub-second processing

**Key talking points:**
- "Solves Circle's #1 enterprise adoption barrier"
- "First autonomous compliance for stablecoins"
- "Uses ALL Circle products meaningfully"
- "Real agents making real decisions, not AI wrappers"

---

## 💡 TIPS FOR SUCCESS

1. **Start simple, then enhance**: Get basic version working first
2. **Test constantly**: Don't wait until the end
3. **Use the provided structure**: Don't reinvent
4. **Make it look professional**: Polish matters
5. **Practice the demo**: You should be able to do it in your sleep

---

## 🚨 IF YOU GET STUCK

**Problem**: Can't connect to Arc
- **Solution**: Check `.env` has correct `ARC_RPC_URL`
- Verify wallet has testnet USDC from faucet

**Problem**: OpenAML models not loading
- **Solution**: Clone repo manually and copy to `ml/models/`
- Use rule-based scoring as fallback (already in code)

**Problem**: Dashboard not showing data
- **Solution**: Check WebSocket connection
- Verify backend API is running
- Check CORS settings in `backend/main.py`

**Problem**: Demo scenarios not impressive
- **Solution**: Add more details to console output
- Show agent reasoning clearly
- Emphasize the speed (sub-second)

---

## 🏆 WINNING CRITERIA

Judges will evaluate:
1. **Problem solved** (30%) - Does it address real need?
2. **Technical execution** (30%) - Does it work well?
3. **Circle integration** (20%) - Deep product usage?
4. **Autonomy** (10%) - Real agent decisions?
5. **Presentation** (10%) - Clear and compelling?

**Your project scores high on ALL of these!**

---

## 📝 FINAL WORDS

You're building something that Circle actually needs. This isn't a hackathon toy - it's infrastructure for enterprise adoption of Arc.

**Build it like you're shipping to production.**

**Make every agent decision transparent and auditable.**

**Show that autonomous compliance is not only possible, but better than manual.**

**You've got this. Now go win! 🚀**

---

## 📞 NEXT STEPS

1. **Read PLAN.md** - Understand the complete vision
2. **Run setup.sh** - Get environment ready
3. **Follow IMPLEMENTATION_GUIDE.md** - Build step by step
4. **Test constantly** - Don't wait until the end
5. **Make it impressive** - Polish matters


**Good luck! This project will win if executed correctly.** 🏆
