# 🌳 Sefirotic Orchestrator - Architecture

## Overview

The Sefirotic Orchestrator is a decision-making framework based on the Kabbalistic Tree of Life. It provides a structured topology for classifying, expanding, constraining, and delivering AI agent responses.

**Philosophy**: The skill teaches OpenClaw a decision-making framework, not just a tool.

---

## Core Architecture

### The Tree of Life Topology

```
                    ┌─────────┐
                    │  KETER  │ ← Intent Classification (World: Atzilut)
                    │ (Crown) │
                    └────┬────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
     ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
     │  CHOKMAH  │ │   DA'AT   │ │   BINAH   │ ← World: Beriah
     │ (Wisdom)  │ │(Knowledge)│ │(Underst.) │
     │ Expansion │ │ Hot Cache │ │ Restrict  │
     └─────┬─────┘ └───────────┘ └─────┬─────┘
           │                           │
     ┌─────▼─────┐               ┌─────▼─────┐
     │  CHESED   │               │  GEVURAH  │ ← World: Yetzirah
     │  (Mercy)  │               │(Severity) │
     │  Skills   │               │  Security │
     └─────┬─────┘               └─────┬─────┘
           │                           │
           └───────────┬───────────────┘
                       │
                 ┌─────▼─────┐
                 │  TIFERET  │ ← Central Orchestrator (Heart)
                 │ (Beauty)  │   8 connections
                 └─────┬─────┘
                       │
           ┌───────────┼───────────┐
           │                       │
     ┌─────▼─────┐           ┌─────▼─────┐
     │  NETZACH  │           │    HOD    │
     │ (Victory) │           │  (Glory)  │
     │ Proactive │           │  Output   │
     └─────┬─────┘           └─────┬─────┘
           │                       │
           └───────────┬───────────┘
                       │
                 ┌─────▼─────┐
                 │   YESOD   │ ← Memory/Persistence (World: Assiah)
                 │(Foundation)│
                 └─────┬─────┘
                       │
                 ┌─────▼─────┐
                 │  MALKUTH  │ ← Channel Delivery
                 │ (Kingdom) │
                 └─────────────┘
```

---

## Three Pillars

| Pillar | Hebrew | Sefirot | Function |
|--------|--------|---------|----------|
| **Right (Chesed)** | חסד | Chokmah → Chesed → Netzach | Expansion, generosity, action |
| **Left (Gevurah)** | גבורה | Binah → Gevurah → Hod | Restriction, discipline, structure |
| **Middle (Tiferet)** | תפארת | Keter → Da'at → Tiferet → Yesod → Malkuth | Balance, harmony, integration |

### Pillar Execution

- **Left and Right pillars can execute in parallel** (expansion vs restriction)
- **Middle pillar orchestrates** (Tiferet coordinates)
- **Balance is achieved** when both pillars contribute to Tiferet

---

## Four Worlds

| World | Hebrew | Meaning | Sefirot | Function |
|-------|--------|---------|---------|----------|
| **Atzilut** | אצילות | Emanation | Keter | Pure intent, classification |
| **Beriah** | בריאה | Creation | Chokmah, Binah, Da'at | Ideas, analysis, context |
| **Yetzirah** | יצירה | Formation | Chesed, Gevurah, Tiferet, Netzach, Hod | Structure, skills, orchestration |
| **Assiah** | עשיה | Action | Yesod, Malkuth | Memory, manifestation, delivery |

---

## Sefirot Functions

### 1. Keter (Crown) - Intent Classification
**File**: `src/complexity.ts`

- Analyzes task complexity using heuristic scoring
- Determines path: Fast (⚡) vs Graph (🌳) vs Abort (🛡️)
- Detects language (EN/ES/Mixed)
- First sefirah in all paths

### 2. Chokmah (Wisdom) - Creative Expansion
**File**: `src/orchestrator.ts` → `processChokmah()`

- Generates creative alternatives
- Suggests expansions and possibilities
- Right pillar (expansion tendency)

### 3. Binah (Understanding) - Analytical Restriction
**File**: `src/orchestrator.ts` → `processBinah()`

- Applies constraints and analysis
- Identifies risks and requirements
- Left pillar (restriction tendency)

### 4. Da'at (Knowledge) - Hot Context Cache
**File**: `src/memory-writer.ts` → `getHotContext()`

- Session-relevant context (distinct from Yesod)
- Provides recent memory for current task
- Hidden sefirah (not counted in 10)

### 5. Chesed (Mercy) - Skill Expansion
**File**: `src/skill-scanner.ts`

- **Dual matching**: Scanner + Keywords
- Discovers available skills
- Matches skills to task needs
- Right pillar

### 6. Gevurah (Severity) - Security Gate
**File**: `src/shield.ts`

- SHIELD v2 pattern matching (18+ patterns)
- Critical threats → Abort
- High threats → Confirm
- **Blocks, not filters** (design decision)
- Left pillar

### 7. Tiferet (Beauty) - Central Orchestrator
**File**: `src/orchestrator.ts` → `processTiferet()`

- The heart of the tree (8 connections)
- Harmonizes all inputs
- Respects Gevurah blocks
- Middle pillar (balance)

### 8. Netzach (Victory) - Proactive Actions
**File**: `src/orchestrator.ts` → `processNetzach()`

- Suggests follow-up actions
- Scheduling and monitoring
- Right pillar

### 9. Hod (Glory) - Structured Output
**File**: `src/orchestrator.ts` → `processHod()`

- Formats and structures response
- Applies templates
- Left pillar

### 10. Yesod (Foundation) - Memory/Persistence
**File**: `src/memory-writer.ts`

- Writes to MEMORY.md
- Persistent storage (distinct from Da'at)
- Middle pillar

### 11. Malkuth (Kingdom) - Channel Delivery
**File**: `src/orchestrator.ts` → `processMalkuth()`

- Formats for specific channel (WhatsApp, Slack, Email, CLI)
- Final output delivery
- Middle pillar

---

## 22 Paths (Senderos)

The 22 paths connect the sefirot, based on the 22 Hebrew letters.

**File**: `src/paths.ts`

### Path Types
- **Unconditional**: Always active (e.g., Tiferet → Yesod)
- **Conditional**: Require context flags (e.g., Keter → Tiferet only if complexity < 45)

### Cross-Pillar Communication
Paths 10 (Chesed → Gevurah) and 18 (Netzach → Hod) enable cross-pillar synthesis.

---

## Execution Paths

### ⚡ Fast Path (Score < 45)
```
Keter → Tiferet → Hod → Malkuth
```
- Minimal traversal
- Simple tasks (greetings, lookups)
- No memory storage

### 🌳 Graph Path (Score >= 45)
```
Keter → Chokmah → Binah → Da'at → Chesed → Gevurah →
Tiferet → Netzach → Hod → Yesod → Malkuth
```
- Full traversal
- Complex tasks
- Memory storage enabled

### 🛡️ Abort Path (SHIELD Critical)
```
Keter → Gevurah → Malkuth
```
- Security block
- Immediate termination
- Warning delivery

### 💬 Consultation Path (v0.3 Planned)
```
Keter → Chokmah → Binah → Tiferet → Hod → Malkuth
```
- Analysis without execution
- Advice mode

### 🧠 Mental Model (Option C)
No script execution - apply framework cognitively:
1. Keter: What is the true intent?
2. Chokmah: What creative expansions?
3. Binah: What constraints apply?
4. etc.

---

## Design Decisions

1. **Serial by default, parallel on pillars**
   - Left and Right pillars can run concurrently
   - Promise.all for pillar operations

2. **Da'at as hot context (distinct from Yesod)**
   - Da'at: Session context
   - Yesod: Persistent memory

3. **Gevurah blocks, not filters**
   - Threats abort, not sanitize
   - Security is non-negotiable

4. **Tiferet as the heart**
   - Central hub with 8 connections
   - All paths flow through Tiferet

5. **Framework, not just tool (Option C)**
   - Mental model enables cognitive use
   - Script is optional

6. **Dual matching in Chesed**
   - Scanner: Discover real skills
   - Keywords: Relevance fallback

7. **22 Paths for conditional routing**
   - Hebrew letters as path identifiers
   - Context-driven activation

---

## File Structure

```
sefirotic-orchestrator/
├── SKILL.md              # Main documentation (restored Option C, Examples, Scoring)
├── _meta.json            # OpenClaw metadata
├── package.json          # Node.js configuration
├── tsconfig.json         # TypeScript configuration
├── run-demo.ts           # Test runner and CLI
├── src/
│   ├── index.ts          # Main exports
│   ├── types.ts          # TypeScript interfaces
│   ├── tree.ts           # Tree topology (10 sefirot + Da'at)
│   ├── paths.ts          # 22 senderos
│   ├── complexity.ts     # Scoring (Keter)
│   ├── shield.ts         # SHIELD v2 (Gevurah)
│   ├── skill-scanner.ts  # Dual matching (Chesed)
│   ├── memory-writer.ts  # Persistence (Yesod)
│   └── orchestrator.ts   # Core (Tiferet)
├── docs/
│   └── architecture.md   # This file
└── examples/
    └── (usage examples)
```

---

## Audit Compliance (v0.3)

### P0 - Restored Items ✅
- [x] Option C (Mental Model) in SKILL.md
- [x] Examples section with scoring
- [x] Complexity Scoring table
- [x] Dual matching in Chesed (scanner + keywords)

### P1 - Validation
- [x] Test suite in run-demo.ts
- [x] Bilingual test cases
- [x] Abort path tests
- [ ] E2E OpenClaw integration test (requires OpenClaw CLI)

### P2 - Documentation
- [x] Design decisions documented
- [x] Architecture reference
- [x] Philosophy statement ("framework, not tool")

---

## Future Roadmap

### v0.3 (Planned)
- [ ] Event Bus for observability
- [ ] Circuit breakers for resilience
- [ ] SHIELD v3 with policy engine
- [ ] Consultation Path (3rd path)
- [ ] LLM integration in Keter
- [ ] Vector search in Yesod
- [ ] Da'at learning loop (feedback to Keter)

### Future
- [ ] React visualization of tree
- [ ] Real-time metrics dashboard
- [ ] Multi-agent coordination

---

*The skill teaches OpenClaw a decision-making framework, not just a tool.*
