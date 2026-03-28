---
description: Start a harnessed development session with planner → generator → evaluator loop for autonomous multi-hour coding
---

# /harness — Start Harnessed Development

You are orchestrating an autonomous development session using the three-agent harness architecture.

## Setup

1. Create the `harness/` directory: `mkdir -p harness`
2. Initialize iteration tracking by running:
   ```bash
   CLAUDE_WORKING_DIRECTORY="$(pwd)" node "${CLAUDE_PLUGIN_ROOT}/scripts/hooks/track-iteration.js" session-start
   ```

## Phase 1: Planning

1. Take `$ARGUMENTS` as the user's project prompt. If empty, ask the user for a 1-4 sentence project description.
2. Invoke the **harness-planner** agent via the Agent tool with the user's prompt.
3. The planner writes `SPEC.md`. Present it to the user and ask for approval before continuing.

## Phase 2: Build Loop

For each feature in the spec, execute this cycle:

### Step A: Generate

Invoke the **harness-generator** agent via the Agent tool. Tell it:
- Read `SPEC.md` for the product spec
- Which feature to implement next
- If this is a fix iteration (not the first attempt): read `harness/qa-feedback.md` for issues to fix

The generator will:
- Write `harness/sprint-contract.md` (defining "done")
- Implement the feature
- Commit to git
- Write `harness/sprint-result.md` (what was built, how to test)

### Step B: Evaluate

Invoke the **harness-evaluator** agent via the Agent tool. Tell it:
- Read `harness/sprint-contract.md` for success criteria
- Read `harness/sprint-result.md` for test instructions
- Start and test the live application
- Write results to `harness/qa-feedback.md`

### Step C: Log and Decide

After the evaluator finishes:

1. Read `harness/qa-feedback.md` to get the result (PASS/FAIL) and scores.

2. **Log the iteration** by piping JSON to the tracker:
   ```bash
   echo '{"feature":"FEATURE_NAME","result":"PASS_OR_FAIL","score":AVG_SCORE,"duration":"DURATION","nextFeature":"NEXT_FEATURE_OR_NULL"}' | CLAUDE_WORKING_DIRECTORY="$(pwd)" node "${CLAUDE_PLUGIN_ROOT}/scripts/hooks/track-iteration.js" log-iteration
   ```

3. **If FAIL** and fewer than 3 iterations on this feature: go back to Step A, telling the generator to read and fix the issues in `harness/qa-feedback.md`.
4. **If FAIL** and 3 iterations reached: report to the user that this feature needs manual intervention. Move to the next feature.
5. **If PASS**: move to the next feature in the spec.

### Repeat Steps A-B-C for each feature.

## Phase 3: Final Review

After all features are complete:
1. Invoke the **harness-evaluator** for a full end-to-end review of the entire application
2. If issues found, invoke the **harness-generator** to address integration problems
3. The Stop hook will automatically write a session summary to `harness/iteration-log.md`

## Arguments

`$ARGUMENTS` is your project prompt — a 1-4 sentence description of what to build.

**Examples:**
```
/harness Build a retro 2D game maker with sprite editor and level designer
/harness Create a browser-based DAW using the Web Audio API
/harness Build a collaborative markdown wiki with real-time editing
```

If no arguments are provided, ask the user for a project description.

## Important

- **Always review the spec** before proceeding — this sets the scope for hours of work
- **The evaluator is deliberately skeptical** — FAIL assessments are expected and healthy
- **2-3 iterations per feature is normal** — never skip the evaluate step
- **Git commits are checkpoints** — commit after each passing feature
- Use `/harness-status` to check progress mid-session
- Use `/evaluate` for standalone evaluation at any point
