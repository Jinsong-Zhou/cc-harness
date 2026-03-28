---
description: Start a harnessed development session with planner → generator → evaluator loop for autonomous multi-hour coding
---

# /harness — Start Harnessed Development

Launch an autonomous development session using the three-agent harness architecture.

## What This Command Does

1. Creates the `harness/` directory and initializes `harness/iteration-log.md`
2. Invokes the **harness-planner** agent to expand your prompt into `SPEC.md`
3. Presents the spec for your approval
4. Runs the generator-evaluator loop for each feature:
   - **harness-generator** writes sprint contract → implements → commits → writes handoff
   - **harness-evaluator** tests the live app → grades → writes feedback
   - Iterates on failures (max 3 rounds per feature)
5. Runs a final end-to-end evaluation
6. Writes session summary to `harness/iteration-log.md`

## Arguments

`$ARGUMENTS` is your project prompt — a 1-4 sentence description of what to build.

**Examples:**
```
/harness Build a retro 2D game maker with sprite editor and level designer
/harness Create a browser-based DAW using the Web Audio API
/harness Build a collaborative markdown wiki with real-time editing
```

If no arguments are provided, you will be asked for a project description.

## How It Works

```
┌──────────┐     SPEC.md      ┌───────────┐    qa-feedback    ┌───────────┐
│ PLANNER  │────────────────►  │ GENERATOR │ ◄───────────────► │ EVALUATOR │
└──────────┘                   └───────────┘                   └───────────┘
                                    │                               │
                                git commit                    tests live app
                                    │                          via Playwright
                                    ▼
                              Working App
```

## Important Notes

- **Always review the spec** before approving — this sets the scope for hours of work
- **The evaluator is deliberately skeptical** — it will fail features with real bugs
- **2-3 iterations per feature is normal** — don't be alarmed by FAIL assessments
- **Git commits are checkpoints** — you can always roll back
- Use `/harness-status` to check progress mid-session
- Use `/evaluate` to trigger standalone evaluation at any point

## Related

- **harness-planner** agent — expands prompts into specs
- **harness-generator** agent — builds features iteratively
- **harness-evaluator** agent — skeptical QA testing
- **harness-loop** skill — full orchestration details
- **harness-tuning** skill — calibrating the evaluator
