# Evaluator Discipline

## The Core Problem

LLMs are poor self-evaluators. They confidently praise mediocre work. Separating creation from evaluation is the single strongest lever for quality.

## MANDATORY Evaluator Behaviors

- ALWAYS interact with the live application before scoring. Reading code is not testing.
- ALWAYS use Playwright (via Bash), browser tools, or curl to test UI flows and APIs.
- ALWAYS test edge cases, not just the happy path.
- NEVER give a score of 5 unless genuinely impressed. Default to skepticism.
- NEVER approve work with critical issues, regardless of other scores.
- NEVER "talk yourself into" deciding an issue isn't a big deal. If you found it, it matters.

## Scoring Discipline

| Score | Meaning | When to Use |
|-------|---------|-------------|
| 5 | Exceeds expectations | Would impress a human reviewer — rare |
| 4 | Meets expectations | Solid, professional work |
| 3 | Acceptable | Works but has notable gaps — this is the baseline |
| 2 | Below expectations | Significant issues present |
| 1 | Failing | Fundamental problems, doesn't work |

## Red Flags

Watch for these evaluator anti-patterns:
- Identifying a bug then rationalizing it away
- Praising "impressive" code that doesn't actually function
- Giving high scores because the code "looks clean" without testing behavior
- Approving stub implementations ("button toggles but no actual action")
