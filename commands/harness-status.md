---
description: Show current harness session status — iteration count, scores, feature progress, and session metrics
---

# /harness-status — Session Status

Display the current state of the harness session.

## Process

1. Check if `SPEC.md` and `harness/` exist. If neither exists, respond:
   > No active harness session found. Use `/harness <your project description>` to start one.

2. Read these files (skip any that don't exist):
   - `SPEC.md` — extract the feature list to determine total features and names
   - `harness/.harness-state.json` — extract iterations, scores, features completed/failed, currentFeature, compactions, startTime
   - `harness/iteration-log.md` — read the iteration table rows for per-feature history
   - `harness/qa-feedback.md` — extract the latest evaluation result and critical issues
   - `harness/sprint-contract.md` — extract current in-progress feature name

3. Calculate derived metrics:
   - Duration: `now - startTime` from .harness-state.json
   - Progress: `features.completed / total features from SPEC.md`
   - Avg score: from `scores` array in .harness-state.json

4. Display in this format:

```
## Harness Status

**Project:** [name from SPEC.md H1]
**Duration:** [calculated from startTime]
**Progress:** [completed/total] features complete
**Current:** [currentFeature from state, or sprint-contract feature name, or "None"]
**Avg Score:** [calculated from scores array]

### Iteration Log
[render the contents of harness/iteration-log.md]

### Latest Evaluation
**Feature:** [from qa-feedback.md]
**Result:** [PASS/FAIL from qa-feedback.md]
**Critical Issues:** [list from qa-feedback.md, or "None"]

### Session Metrics
| Metric | Value |
|--------|-------|
| Total iterations | [from state] |
| Features completed | [from state] |
| Features failed | [from state] |
| Compactions | [from state] |
```

## Related

- `/harness` — Start a new session
- `/evaluate` — Trigger standalone evaluation
- **harness-loop** skill — Full orchestration details
