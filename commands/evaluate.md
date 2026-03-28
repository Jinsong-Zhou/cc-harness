---
description: Trigger a standalone evaluation of the current application using the skeptical evaluator agent
---

# /evaluate — Run QA Evaluation

Run the harness evaluator against the current application state, independent of the full harness loop. Useful for spot-checking quality at any point during development.

## Process

1. Create `harness/` directory if it doesn't exist: `mkdir -p harness`
2. Determine evaluation scope:
   - If `harness/sprint-contract.md` exists and `$ARGUMENTS` is empty: evaluate against the sprint contract
   - If `$ARGUMENTS` is provided: use it as the evaluation scope (e.g., "the login flow", "frontend design")
   - If neither: evaluate the full application against `SPEC.md` if it exists, or ask the user what to evaluate
3. Invoke the **harness-evaluator** agent via the Agent tool. Tell it:
   - The evaluation scope (sprint contract, specific feature, or full app)
   - Which grading criteria to use (full-stack or frontend design)
   - To start the application and test it interactively
   - To write results to `harness/qa-feedback.md`
4. After the evaluator finishes, read `harness/qa-feedback.md` and display the summary to the user

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
