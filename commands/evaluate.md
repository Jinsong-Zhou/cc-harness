---
description: Trigger a standalone evaluation of the current application state using the skeptical evaluator agent
---

# Evaluate Current State

Run the harness evaluator against the current application state, independent of the full harness loop.

## Process

1. Check if `harness/sprint-contract.md` exists — if so, evaluate against it
2. If no sprint contract exists, ask the user what to evaluate:
   - Overall application quality
   - A specific feature or page
   - Frontend design quality
   - API functionality

3. Invoke the **harness-evaluator** agent with the appropriate scope

4. Write results to `harness/qa-feedback.md`

5. Display the evaluation summary:
   - Overall PASS/FAIL assessment
   - Criterion scores table
   - Critical issues found
   - Recommendations

## Options

If arguments are provided, use them as the evaluation scope:
- `/evaluate the login flow` — evaluate the login feature specifically
- `/evaluate frontend design` — use frontend design criteria (design quality, originality, craft, functionality)
- `/evaluate api endpoints` — focus on API testing
- `/evaluate` (no args) — full application evaluation

## Important
- The evaluator must interact with the live application, not just read code
- Ensure the application is running before invoking evaluation
- Results should be specific and actionable, not generic praise
