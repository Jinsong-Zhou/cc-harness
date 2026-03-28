---
description: Trigger a standalone evaluation of the current application using the skeptical evaluator agent
---

# /evaluate — Run QA Evaluation

Run the harness evaluator against the current application state, independent of the full harness loop. Useful for spot-checking quality at any point during development.

## What This Command Does

1. Checks for an active sprint contract (`harness/sprint-contract.md`)
2. Starts the application if not already running
3. Invokes the **harness-evaluator** agent to test the live app
4. Writes results to `harness/qa-feedback.md`
5. Displays the evaluation summary with scores and issues

## Arguments

`$ARGUMENTS` specifies the evaluation scope. If omitted, runs a full application evaluation.

**Examples:**
```
/evaluate                          # Full application evaluation
/evaluate the login flow           # Evaluate a specific feature
/evaluate frontend design          # Use frontend design criteria
/evaluate api endpoints            # Focus on API testing
/evaluate against sprint contract  # Evaluate against current contract
```

## Evaluation Criteria

**Full-stack scope** (default):
| Criterion | Weight |
|-----------|--------|
| Product Depth | HIGH |
| Functionality | HIGH |
| Visual Design | MEDIUM |
| Code Quality | LOW |

**Frontend design scope** (when `$ARGUMENTS` mentions "design" or "frontend"):
| Criterion | Weight |
|-----------|--------|
| Design Quality | HIGH |
| Originality | HIGH |
| Craft | MEDIUM |
| Functionality | MEDIUM |

## Important Notes

- The evaluator **must interact with the live application** — ensure it's running
- Results are written to `harness/qa-feedback.md` (overwrites previous)
- The evaluator is deliberately skeptical — a score of 3 is "acceptable"
- Use this between features to catch integration issues early

## Related

- **harness-evaluator** agent — the QA agent invoked by this command
- **harness-tuning** skill — calibrating the evaluator's judgment
