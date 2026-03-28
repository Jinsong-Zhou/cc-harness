---
name: harness-tuning
description: Use when optimizing or simplifying a multi-agent harness - guides systematic removal of components as models improve, evaluator calibration, and prompt engineering for grading criteria
origin: cc-harness
---

# Harness Tuning and Evolution

Every component in a harness encodes an assumption about what the model can't do on its own. This skill guides systematic tuning to match current model capabilities.

> "The space of interesting harness combinations doesn't shrink as models improve. Instead, it moves, and the interesting work for AI engineers is to keep finding the next novel combination."

## When to Use

- Setting up a harness for a new model version
- Evaluator is too lenient or too harsh
- Harness feels like unnecessary overhead
- Wanting to reduce cost/latency
- Adapting an existing harness to a newer model
- After completing a harness run and reviewing results

## Evaluator Calibration

The evaluator is the most critical and most fragile component.

### The Core Problem

> "Out of the box, Claude is a poor QA agent. In early runs, I watched it identify legitimate issues, then talk itself into deciding they weren't a big deal and approve the work anyway."

### Calibration Loop

1. **Run** the harness on a realistic task
2. **Read** evaluator logs — what did it score? What did it say?
3. **Compare** against your judgment — where does it diverge?
4. **Update** the evaluator prompt to fix divergence
5. **Repeat** — takes several rounds before grading is reasonable

### Common Failures and Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Passes everything | Default LLM generosity | Add "never give 5 unless genuinely impressed" |
| Identifies bugs then approves | Conflict avoidance | Add "if ANY critical issue exists, assessment is FAIL" |
| Scores inflate over iterations | Anchoring to previous scores | Reset score context each evaluation |
| Misses functional bugs | Only reads code | REQUIRE browser/API interaction before scoring |
| Too harsh on style | Over-indexing on craft | Reweight: functionality > originality > craft |
| Generic praise before issues | Politeness pattern | Add "lead with issues, not praise" |

### Few-Shot Calibration

Provide worked examples matching your quality bar. See `references/audit-template.md` for the format.

**Calibrated FAIL example:**
```
Product Depth: 2 — Form renders but validation is display-only, invalid submissions go through
Functionality: 1 — Core feature is broken
Visual Design: 3 — Looks acceptable but generic
Code Quality: 2 — No input sanitization
Overall: FAIL — Cannot ship a login that doesn't validate
```

**Calibrated PASS example:**
```
Product Depth: 4 — Full CRUD workflow completes end-to-end including edge cases
Functionality: 4 — All happy paths work, error handling covers expected failures
Visual Design: 3 — Clean but unremarkable — consistent spacing and colors
Code Quality: 4 — Well-structured, appropriate error handling, no security issues
Overall: PASS — Solid implementation, ready for next feature
```

## Prompt Engineering for Criteria

The wording of grading criteria directly shapes generator behavior, independent of evaluator feedback.

### Observed Effects

| Criterion Wording | Effect on Output |
|-------------------|-----------------|
| "Museum quality" | Pushes toward polished but visually convergent designs |
| "Penalize AI-generated patterns" | Encourages aesthetic risk-taking |
| "A human designer should recognize deliberate creative choices" | Drives away from template defaults |
| "Usability independent of aesthetics" | Keeps functionality grounded during experimental design |
| "Purple gradients over white cards fail here" | Specifically steers away from common AI visual clichés |

### Writing Effective Criteria

1. **Be specific about failure** — "purple gradients over white cards" > "generic AI patterns"
2. **Weight intentionally** — Emphasize what the model is weak at, not what it already does well
3. **Include negative examples** — Show what to avoid, not just what to aim for
4. **Avoid vague superlatives** — "Would pass code review at a startup" > "professional quality"
5. **Anticipate gaming** — If the criterion says "no stubs," define what counts as a stub

## Component Removal Protocol

When a new model arrives, systematically test each component:

### Step 1: List Components

- [ ] Planner (prompt → spec expansion)
- [ ] Sprint decomposition (spec → sequential features)
- [ ] Sprint contracts (pre-negotiated success criteria)
- [ ] Generator self-evaluation
- [ ] Evaluator (skeptical QA)
- [ ] Context resets
- [ ] File-based handoffs
- [ ] Visual design language in spec

### Step 2: Remove One at a Time

For each:
1. Remove it from the harness
2. Run the same task
3. Compare output quality (use the evaluator to grade both versions)
4. If quality holds → not load-bearing → remove it
5. If quality drops → still needed → keep it

### Step 3: Document Results

Use the audit template in `references/audit-template.md` to record findings.

## Evolution History

Real progression showing how harness simplified as models improved:

### Sonnet 4.5 → Opus 4.5
- ✅ **Removed:** Context resets (Opus 4.5 doesn't exhibit context anxiety)
- ❌ **Kept:** Sprint decomposition, evaluator, planner
- **Impact:** Simpler harness, same quality, lower cost

### Opus 4.5 → Opus 4.6
- ✅ **Removed:** Sprint decomposition (model maintains coherence over 2+ hour builds)
- ❌ **Kept:** Planner, evaluator
- **Impact:** Generator runs as one continuous session; most time in builder

### What Persists Across All Versions
- **Evaluator** — Self-evaluation bias is persistent across all model versions
- **Planner** — Models don't naturally expand scope ambitiously from brief prompts
- **File communication** — Structured handoffs remain valuable for multi-agent coordination

## Cost-Quality Tradeoffs

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Solo agent | ~20 min | ~$9 | Superficially impressive, core features broken |
| Full harness (sprints) | ~6 hr | ~$200 | Working features, polished UI, real functionality |
| Simplified harness (no sprints) | ~4 hr | ~$125 | Working features, comparable quality |

### DAW Build Breakdown (Opus 4.6, Simplified Harness)

| Phase | Duration | Cost |
|-------|----------|------|
| Planner | 4.7 min | $0.46 |
| Build Round 1 | 2 hr 7 min | $71.08 |
| QA Round 1 | 8.8 min | $3.24 |
| Build Round 2 | 1 hr 2 min | $36.89 |
| QA Round 2 | 6.8 min | $3.09 |
| Build Round 3 | 10.9 min | $5.88 |
| QA Round 3 | 9.6 min | $4.06 |
| **Total** | **3 hr 50 min** | **$124.70** |

Most time goes to the builder. QA rounds are cheap (~3-4 min, ~$3-4 each) but catch real issues.

## Guidelines

- **Don't add complexity speculatively** — Only add components that solve observed problems
- **Remove before adding** — When a new model arrives, try removing components first
- **The evaluator is almost always load-bearing** — Self-evaluation bias persists
- **The planner is usually load-bearing** — Brief prompts don't naturally expand ambitiously
- **Sprint decomposition is model-dependent** — Test whether the current model needs it
- **Context resets are model-dependent** — Some models need them, newer ones usually don't

*"Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing."*
