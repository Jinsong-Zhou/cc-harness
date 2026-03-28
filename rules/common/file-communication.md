# File-Based Communication

## Why Files

Agents communicate through files, not conversation context. This enables:
- Clean context separation between agents
- Auditable history of decisions and feedback
- Structured handoffs that survive context resets
- Parallel agent execution without shared state

## Directory Structure

All harness communication files live in `harness/`:

```
harness/
├── sprint-contract.md       # Generator → Evaluator: what "done" means
├── sprint-result.md         # Generator → Evaluator: what was built, how to test
├── qa-feedback.md           # Evaluator → Generator: grades, bugs, instructions
├── iteration-log.md         # Orchestrator: running log of all iterations and scores
├── context-handoff.md       # Any → Any: structured state for context resets
└── .harness-state.json      # Machine-readable session state
```

## Rules

- NEVER pass evaluation results through conversation. Write to `harness/qa-feedback.md`.
- NEVER pass sprint scope through conversation. Write to `harness/sprint-contract.md`.
- ALWAYS write files before the next agent reads them. Sequential, not parallel.
- ALWAYS overwrite (not append) sprint-contract, sprint-result, and qa-feedback for each new iteration.
- ALWAYS append to iteration-log.md — it's the permanent record.
