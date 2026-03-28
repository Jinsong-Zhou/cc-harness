# Harness Workflow

## Mandatory Pipeline

All complex builds (3+ features, 1+ hour expected) MUST use the harness pipeline:

1. **Plan** — Planner expands prompt into SPEC.md
2. **Contract** — Generator proposes sprint contract, evaluator reviews
3. **Build** — Generator implements one feature at a time
4. **Evaluate** — Evaluator tests live application, grades against criteria
5. **Iterate** — Fix failures before moving to next feature (max 3 rounds)
6. **Commit** — Git commit after each passing feature

## Rules

- NEVER skip the evaluator. Self-evaluation is unreliable.
- NEVER implement multiple features simultaneously. One at a time.
- ALWAYS commit working code between features. The app must build and run after every commit.
- ALWAYS write sprint contracts before implementation. Agreeing on "done" prevents scope drift.
- Use the **harness-planner** agent for planning. Use the **harness-generator** agent for building. Use the **harness-evaluator** agent for QA.

## File Communication

Agents communicate through files in `harness/`, not through conversation context:

| File | Writer | Reader |
|------|--------|--------|
| `SPEC.md` | Planner | Generator, Evaluator |
| `harness/sprint-contract.md` | Generator | Evaluator |
| `harness/sprint-result.md` | Generator | Evaluator |
| `harness/qa-feedback.md` | Evaluator | Generator |
