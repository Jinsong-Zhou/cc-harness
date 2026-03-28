---
name: context-management
description: Use when running long coding sessions that approach context limits - provides strategies for compaction vs context resets, structured handoffs, and managing context anxiety
---

# Context Management for Long-Running Tasks

Strategies for maintaining coherence and performance during multi-hour autonomous coding sessions. Based on lessons learned from building complex applications with Claude over 3-6+ hour sessions.

## When to Use

- Sessions approaching context window limits
- Observing degraded output quality mid-session
- Agent appears to be "wrapping up" prematurely
- Planning a task expected to run 1+ hours
- Deciding between compaction and context reset strategies

## Two Failure Modes

### 1. Context Window Deterioration

Models lose coherence on lengthy tasks as the context window fills. Earlier instructions get compressed or lost, leading to:
- Forgetting established patterns and conventions
- Repeating earlier mistakes
- Inconsistent naming, styling, or architecture decisions
- Drift from the original spec

### 2. Context Anxiety

Some models begin wrapping up work prematurely as they approach what they believe is their context limit. Symptoms:
- Skipping planned features
- Producing minimal implementations
- Adding "TODO" comments instead of implementing
- Summarizing remaining work instead of doing it

## Strategy: Compaction

**What it is:** Summarizing earlier parts of the conversation in place so the same agent can keep going on shortened history.

**When to use:**
- The agent is performing well but approaching context limits
- Continuity matters — the agent has built up important local state/understanding
- The model handles compaction well (Opus 4.5+ generally does)

**Strengths:**
- Preserves conversation continuity
- No handoff overhead
- Agent retains implicit understanding of decisions made

**Weaknesses:**
- Doesn't eliminate context anxiety in models prone to it
- Summarization may lose important details
- Compounding summaries degrade over time

## Strategy: Context Reset

**What it is:** Clearing the context window entirely and starting a fresh agent with a structured handoff.

**When to use:**
- Compaction alone isn't sufficient (agent shows context anxiety)
- Natural breakpoint between features/phases
- Agent has gone off track and needs a clean start
- Switching between build and evaluate phases

**Strengths:**
- Eliminates context anxiety completely
- Fresh agent with full context budget
- Clean separation of concerns

**Weaknesses:**
- Requires structured handoff (overhead)
- Loses implicit context the previous agent built up
- Handoff artifacts must be comprehensive

## Structured Handoff Protocol

When performing a context reset, write a handoff file that the new agent reads:

```markdown
# Context Handoff

## Project State
[What has been built so far — list of completed features]

## Current Task
[What the new agent should work on next]

## Architecture Decisions
[Key decisions made during the session that must be preserved]
- Decision 1: [what and why]
- Decision 2: [what and why]

## File Map
[Key files and their purposes]
- `src/components/Editor.tsx` — Main editor component
- `src/api/routes.py` — API endpoint definitions

## Known Issues
[Problems discovered but not yet fixed]

## Conventions Established
[Patterns the new agent must follow]
- Naming: camelCase for components, snake_case for API
- State: Zustand store in `src/store/`
- API: REST, all routes under `/api/v1/`

## Next Steps
1. [Specific next task]
2. [Following task]
```

## Model-Specific Behavior

| Model | Context Anxiety | Recommended Strategy |
|-------|----------------|---------------------|
| Sonnet 4.5 | Strong | Context resets essential |
| Opus 4.5 | Minimal | Compaction usually sufficient |
| Opus 4.6 | Minimal | Compaction usually sufficient; can run 2+ hours coherently |

## Decision Framework

```
Is the agent showing context anxiety?
├── Yes → Use context reset with structured handoff
└── No
    ├── Is quality degrading?
    │   ├── Yes → Try compaction first, reset if no improvement
    │   └── No → Continue, monitor for degradation
    └── At a natural breakpoint (feature complete)?
        ├── Yes → Good time for preventive compaction
        └── No → Continue
```

## Guidelines

- **Preventive > reactive** — Compact or reset before quality degrades, not after
- **Natural breakpoints** — Feature completions, phase transitions, and commit points are ideal times
- **Preserve decisions** — Architecture choices, naming conventions, and "why" reasoning are the most important things to carry forward
- **File map is critical** — The new agent needs to know where things are without exploring the entire codebase
- **Test after reset** — Verify the new agent can build and run the app before resuming feature work
