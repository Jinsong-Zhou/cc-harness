---
description: Show current harness session status — iteration count, scores, and progress through the spec
---

# Harness Status

Display the current state of the harness session.

## Process

1. Read `SPEC.md` to get the total feature list
2. Read `harness/iteration-log.md` to get completed iterations
3. Read `harness/qa-feedback.md` for the latest evaluation
4. Read `harness/sprint-contract.md` for current in-progress work

## Display Format

```
## Harness Status

**Spec:** [Project name from SPEC.md]
**Progress:** [X/Y features complete]
**Current Feature:** [Name from sprint-contract.md or "None"]
**Total Iterations:** [N]

### Feature Progress
| # | Feature | Status | Iterations | Score |
|---|---------|--------|------------|-------|
| 1 | Feature name | PASS | 2 | 4.2 |
| 2 | Feature name | FAIL (iter 1/3) | 1 | 2.5 |
| 3 | Feature name | Pending | - | - |

### Latest Evaluation
[Summary from most recent qa-feedback.md]
```

If no harness session is active (no `harness/` directory or `SPEC.md`), inform the user:
> No active harness session. Use `/harness` to start one.
