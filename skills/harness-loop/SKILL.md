---
name: harness-loop
description: Use when building complex applications autonomously - orchestrates a generator-evaluator iteration loop with planner, generator, and evaluator agents for long-running multi-hour coding sessions
---

# Generator-Evaluator Harness Loop

Orchestrates autonomous application development using a three-agent architecture inspired by GANs: a **planner** expands prompts into specs, a **generator** builds features iteratively, and a **skeptical evaluator** tests and grades the work.

## When to Use

- Building complete applications from brief prompts
- Long-running autonomous coding sessions (1-6+ hours)
- Projects requiring both frontend and backend work
- When single-agent approaches produce superficially impressive but broken results

## Why This Works

Single-agent approaches fail on complex tasks for two reasons:

1. **Context window deterioration** — Models lose coherence as context fills, and some exhibit "context anxiety" (wrapping up prematurely near perceived limits)
2. **Self-evaluation bias** — When asked to evaluate their own work, agents confidently praise mediocre output. Separating creation from evaluation is a strong lever.

Tuning a standalone evaluator to be skeptical is far more tractable than making a generator critical of its own work.

## Architecture

```
User Prompt (1-4 sentences)
        │
        ▼
   ┌─────────┐
   │ PLANNER  │──→ SPEC.md (ambitious product spec)
   └─────────┘
        │
        ▼
   ┌───────────┐    harness/sprint-contract.md
   │ GENERATOR │◄──────────────────────────────►┐
   └───────────┘    harness/sprint-result.md     │
        │                                        │
        ▼                                        ▼
   ┌───────────┐                          ┌───────────┐
   │   COMMIT  │                          │ EVALUATOR │
   └───────────┘                          └───────────┘
        ▲                                        │
        │         harness/qa-feedback.md          │
        └─────────────────────────────────────────┘
                    (iterate if FAIL)
```

## Workflow

### Phase 1: Planning

1. Invoke the **harness-planner** agent with the user's prompt
2. The planner writes `SPEC.md` — an ambitious product spec with 10-20 features
3. Review the spec with the user before proceeding

### Phase 2: Build Loop

For each feature in the spec:

1. **Generator proposes** — Writes `harness/sprint-contract.md` defining scope and success criteria
2. **Generator builds** — Implements the feature, commits to git
3. **Generator hands off** — Writes `harness/sprint-result.md` with test instructions
4. **Evaluator tests** — Interacts with the live app (Playwright/browser), grades against criteria
5. **Evaluator writes feedback** — `harness/qa-feedback.md` with PASS/FAIL and detailed issues
6. **If FAIL** — Generator reads feedback, fixes issues, resubmits (max 3 iterations per feature)
7. **If PASS** — Move to next feature

### Phase 3: Final Review

After all features are built:
1. Evaluator does a full end-to-end review of the complete application
2. Generator addresses any remaining integration issues
3. Final commit and cleanup

## File-Based Communication

Agents communicate through files in the `harness/` directory:

| File | Writer | Reader | Purpose |
|------|--------|--------|---------|
| `SPEC.md` | Planner | Generator, Evaluator | Product specification |
| `harness/sprint-contract.md` | Generator | Evaluator | What "done" means for current feature |
| `harness/sprint-result.md` | Generator | Evaluator | What was built and how to test it |
| `harness/qa-feedback.md` | Evaluator | Generator | Grades, bugs, and fix instructions |
| `harness/iteration-log.md` | Auto | All | Running log of iterations and scores |

## Grading Criteria

### Full-Stack Applications
| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| Product Depth | High | Real functionality vs facades |
| Functionality | High | Does it actually work? Bugs? Edge cases? |
| Visual Design | Medium | Polished, consistent, full-viewport UI |
| Code Quality | Low | Competence check — broken fundamentals only |

### Frontend Design
| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| Design Quality | High | Coherent whole vs collection of parts |
| Originality | High | Custom decisions vs AI patterns/templates |
| Craft | Medium | Typography, spacing, color harmony |
| Functionality | Medium | Usability independent of aesthetics |

## Evaluator Tuning

The evaluator must be actively tuned against its natural tendency to approve mediocre work:

- Read evaluator logs and compare against your own judgment
- When the evaluator's judgment diverges from yours, update its prompt
- It takes several rounds before the evaluator grades reasonably
- Common failure: evaluator identifies real issues then "talks itself into" approving anyway

## Key Guidelines

- **5-15 iterations per design** is normal for frontend work
- **2-3 iterations per feature** is normal for full-stack features
- If the evaluator consistently passes everything, it's not skeptical enough
- If the generator repeatedly fails, the spec may be too ambitious for a single feature
- Use git commits as checkpoints — you can always roll back
- The planner should be ambitious; the evaluator should be skeptical; the generator should be resilient

## Adapting to Model Capability

Every harness component encodes an assumption about what the model can't do alone. As models improve:

- **Remove sprint decomposition** if the model can maintain coherence over long builds
- **Simplify the planner** if the model produces good specs from brief prompts natively
- **Keep the evaluator** as long as self-evaluation bias exists (it's persistent)
- Test by removing components one at a time and measuring output quality
