---
name: harness-loop
description: Use when building complex applications autonomously - orchestrates a generator-evaluator iteration loop with planner, generator, and evaluator agents for long-running multi-hour coding sessions
origin: cc-harness
---

# Generator-Evaluator Harness Loop

Orchestrates autonomous application development using a three-agent architecture inspired by GANs: a **planner** expands prompts into specs, a **generator** builds features iteratively, and a **skeptical evaluator** tests and grades the work.

## When to Use

- Building complete applications from brief prompts
- Long-running autonomous coding sessions (1-6+ hours)
- Projects requiring both frontend and backend work
- When single-agent approaches produce superficially impressive but broken results
- Any task where self-evaluation would be unreliable

## Why Naive Approaches Fail

Single-agent approaches hit two persistent failure modes:

**Context Window Deterioration** — Models lose coherence on lengthy tasks as the context fills. Earlier instructions get compressed, patterns get forgotten, naming becomes inconsistent.

**Self-Evaluation Bias** — "When asked to evaluate work they've produced, agents tend to respond by confidently praising the work — even when, to a human observer, the quality is obviously mediocre." Separating creation from evaluation is a strong lever. Tuning a standalone evaluator to be skeptical is far more tractable than making a generator critical of its own work.

## Architecture

```
User Prompt (1-4 sentences)
        │
        ▼
┌──────────────┐
│   PLANNER    │──→ SPEC.md (ambitious product spec)
│  (read-only) │     with visual design language
└──────────────┘
        │
        ▼
┌──────────────┐    harness/sprint-contract.md     ┌──────────────┐
│  GENERATOR   │◄─────────────────────────────────►│  EVALUATOR   │
│  (builds)    │    harness/sprint-result.md        │  (tests)     │
└──────────────┘                                    └──────────────┘
        │                                                  │
        ▼                                                  │
   git commit                harness/qa-feedback.md        │
        ▲                                                  │
        └──────────────────────────────────────────────────┘
                         (iterate if FAIL)
```

## Workflow

### Phase 1: Planning

1. Invoke the **harness-planner** agent with the user's prompt
2. The planner writes `SPEC.md` — an ambitious product spec with 10-20 features, including a visual design language
3. Review the spec with the user before proceeding

### Phase 2: Build Loop

For each feature in the spec:

**Step 1: Contract** — Generator writes `harness/sprint-contract.md` defining scope, success criteria, and verification plan.

**Step 2: Build** — Generator implements the feature using the specified stack.

**Step 3: Commit** — Generator commits working code to git.

**Step 4: Handoff** — Generator writes `harness/sprint-result.md` with what was built and how to test it.

**Step 5: Evaluate** — Evaluator interacts with the live application (Playwright MCP, curl, browser), grades against criteria, writes `harness/qa-feedback.md`.

**Step 6: Iterate or Proceed**
- **FAIL** → Generator reads feedback, fixes issues, resubmits (max 3 iterations)
- **PASS** → Append to `harness/iteration-log.md`, move to next feature

### Phase 3: Final Review

After all features:
1. Evaluator runs full end-to-end review
2. Generator addresses integration issues
3. Final commit and summary (duration, cost, iterations, scores)

## File-Based Communication

Agents communicate through files, not conversation context:

| File | Writer | Reader | Lifecycle |
|------|--------|--------|-----------|
| `SPEC.md` | Planner | Generator, Evaluator | Once |
| `harness/sprint-contract.md` | Generator | Evaluator | Overwritten per feature |
| `harness/sprint-result.md` | Generator | Evaluator | Overwritten per feature |
| `harness/qa-feedback.md` | Evaluator | Generator | Overwritten per evaluation |
| `harness/iteration-log.md` | Auto | All | Append-only |
| `harness/context-handoff.md` | Any | Any | On context reset |

For worked examples, read `references/sprint-contract-examples.md` and `references/evaluation-examples.md`.

## Grading Criteria

### Full-Stack Applications

| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| Product Depth | HIGH | Real functionality vs facades. Can users complete the workflow? |
| Functionality | HIGH | Does it actually work? Bugs? Edge cases? Error handling? |
| Visual Design | MEDIUM | Polished, consistent, full-viewport UI with coherent identity |
| Code Quality | LOW | Competence check — broken fundamentals only |

### Frontend Design

| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| Design Quality | HIGH | Coherent whole vs collection of parts — mood and identity |
| Originality | HIGH | Custom decisions vs AI patterns / template defaults |
| Craft | MEDIUM | Typography hierarchy, spacing, color harmony, contrast |
| Functionality | MEDIUM | Usability independent of aesthetics |

## Evaluator Calibration

The evaluator must be actively tuned. Common failure: evaluator identifies real issues then rationalizes approving the work.

**Calibration loop:**
1. Run the harness on a realistic task
2. Read evaluator logs — look at scores and reasoning
3. Compare against your judgment — where does it diverge?
4. Update the evaluator prompt to fix divergence
5. Repeat (several rounds needed)

For detailed calibration guidance, use the **harness-tuning** skill.

## Key Guidelines

- **5-15 iterations per design** is normal for frontend work
- **2-3 iterations per feature** is normal for full-stack features
- If the evaluator consistently passes everything, it's not skeptical enough
- If the generator repeatedly fails, the spec may be too ambitious for a single feature
- Use git commits as checkpoints — you can always roll back
- The planner should be ambitious; the evaluator should be skeptical; the generator should be resilient
- Every harness component encodes an assumption about model limitations — periodically test whether each is still load-bearing

## Cost Reference

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Solo agent (no harness) | ~20 min | ~$9 | Broken core features |
| Full harness (with sprints) | ~6 hours | ~$200 | Working, polished |
| Simplified harness (no sprints) | ~4 hours | ~$125 | Working, comparable |

*The full harness costs ~20x more than solo but produces actually working applications.*
