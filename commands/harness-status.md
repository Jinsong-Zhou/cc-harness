---
description: Show current harness session status — iteration count, scores, feature progress, and session metrics
---

# /harness-status — Session Status

Display the current state of the harness session with feature progress, scores, and metrics.

## What This Command Does

1. Reads `SPEC.md` for the total feature list
2. Reads `harness/.harness-state.json` for session metrics
3. Reads `harness/iteration-log.md` for completed iterations
4. Reads `harness/qa-feedback.md` for the latest evaluation
5. Reads `harness/sprint-contract.md` for current in-progress work
6. Displays a formatted status dashboard

## Output Format

```
## Harness Status

**Project:** RetroForge — 2D Retro Game Maker
**Duration:** 2 hr 15 min
**Progress:** 6/16 features complete
**Current:** Sprite Editor — Animation Frames (iteration 2/3)
**Avg Score:** 3.4

### Feature Progress
| # | Feature | Status | Iterations | Avg Score |
|---|---------|--------|------------|-----------|
| 1 | Project Dashboard | PASS | 1 | 4.0 |
| 2 | Canvas Setup | PASS | 2 | 3.5 |
| 3 | Tile Palette | PASS | 1 | 3.8 |
| 4 | Basic Tile Placement | PASS | 1 | 4.2 |
| 5 | Sprite Editor — Drawing | PASS | 3 | 3.2 |
| 6 | Sprite Editor — Animation | FAIL (2/3) | 2 | 2.5 |
| 7 | Entity System | Pending | — | — |
| … | … | … | … | … |

### Latest Evaluation
**Feature:** Sprite Editor — Animation Frames
**Result:** FAIL
**Critical Issues:** Frame reorder API returns 422 (route ordering bug)

### Session Metrics
| Metric | Value |
|--------|-------|
| Compactions | 1 |
| Git commits | 8 |
| QA rounds | 9 |
```

## No Active Session

If no harness session exists (no `harness/` directory or `SPEC.md`):

> No active harness session found. Use `/harness <your project description>` to start one.

## Related

- `/harness` — Start a new session
- `/evaluate` — Trigger standalone evaluation
- **harness-loop** skill — Full orchestration details
