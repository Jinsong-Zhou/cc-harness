---
description: Start a harnessed development session with planner → generator → evaluator loop
---

# Start Harness Session

You are starting an autonomous harnessed development session using the generator-evaluator architecture.

## Setup

1. Create the `harness/` directory in the project root if it doesn't exist
2. Initialize `harness/iteration-log.md` with a header

## Workflow

### Step 1: Plan
- Take the user's prompt (the arguments to this command, or ask if none provided)
- Invoke the **harness-planner** agent to expand it into `SPEC.md`
- Show the spec to the user and ask for approval before proceeding

### Step 2: Build Loop
For each feature in the spec, run the generator-evaluator loop:

1. Invoke **harness-generator** agent to:
   - Write `harness/sprint-contract.md`
   - Implement the feature
   - Commit to git
   - Write `harness/sprint-result.md`

2. Invoke **harness-evaluator** agent to:
   - Test the live application
   - Grade against criteria
   - Write `harness/qa-feedback.md`

3. If FAIL: generator reads feedback and iterates (max 3 rounds per feature)
4. If PASS: log the result and move to next feature

5. Append each iteration to `harness/iteration-log.md`

### Step 3: Final Review
After all features are complete:
- Run a full end-to-end evaluation
- Address any remaining integration issues
- Summarize the session (time, cost, iterations, final scores)

## Important
- Always commit working code between features
- Never skip the evaluator — self-evaluation is unreliable
- If the evaluator passes everything, its criteria need tightening
- Use the harness-tuning skill if the loop needs calibration
