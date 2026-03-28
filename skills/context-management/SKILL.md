---
name: context-management
description: Use when running long coding sessions that approach context limits - provides strategies for compaction vs context resets, structured handoffs, and managing context anxiety across model versions
origin: cc-harness
---

# Context Management for Long-Running Tasks

Strategies for maintaining coherence and performance during multi-hour autonomous coding sessions. Based on lessons from building complex applications over 3-6+ hour sessions.

## When to Use

- Sessions approaching context window limits
- Observing degraded output quality mid-session
- Agent appears to be "wrapping up" prematurely (context anxiety)
- Planning a task expected to run 1+ hours
- Deciding between compaction and context reset strategies
- After a harness phase transition (planning → building → evaluating)

## Two Failure Modes

### 1. Context Window Deterioration

Models lose coherence on lengthy tasks as the context fills. Symptoms:
- Forgetting established patterns and conventions
- Repeating earlier mistakes that were already fixed
- Inconsistent naming, styling, or architecture decisions
- Drift from the original spec
- Introducing bugs in previously working code

### 2. Context Anxiety

Some models begin wrapping up work prematurely as they approach what they believe is their context limit. Symptoms:
- Skipping planned features ("I'll leave this for later")
- Producing minimal stub implementations
- Adding "TODO" comments instead of implementing
- Summarizing remaining work instead of doing it
- Rushing through the last few features with lower quality

> "Claude Sonnet 4.5 exhibited context anxiety strongly enough that compaction alone wasn't sufficient to enable strong long task performance, so context resets became essential."

## Strategy: Compaction

**What:** Summarize earlier conversation in place so the same agent continues on shortened history.

**When to use:**
- Agent performing well but approaching limits
- Continuity matters — agent has built up important state
- Model handles compaction well (Opus 4.5+ generally does)
- No signs of context anxiety

**Strengths:**
- Preserves conversation continuity
- No handoff overhead
- Agent retains implicit understanding

**Weaknesses:**
- Doesn't eliminate context anxiety in prone models
- Summarization may lose important details
- Compounding summaries degrade over time

## Strategy: Context Reset

**What:** Clear the context window entirely, start a fresh agent with structured handoff.

**When to use:**
- Compaction alone isn't sufficient (agent shows context anxiety)
- Natural breakpoint between features or phases
- Agent has gone off track and needs a clean start
- Switching between harness phases (build → evaluate)

**Strengths:**
- Eliminates context anxiety completely
- Fresh agent with full context budget
- Clean separation of concerns

**Weaknesses:**
- Requires structured handoff (overhead)
- Loses implicit context
- Handoff artifacts must be comprehensive

## Model-Specific Behavior

| Model | Context Anxiety | Coherence Duration | Recommended Strategy |
|-------|----------------|-------------------|---------------------|
| Sonnet 4.5 | Strong | ~30 min | Context resets essential |
| Opus 4.5 | Minimal | ~1-2 hours | Compaction usually sufficient |
| Opus 4.6 | Minimal | 2+ hours | Compaction sufficient; can run coherently for full builds |

## Decision Framework

```
Is the agent showing context anxiety?
├── Yes → Context reset with structured handoff
└── No
    ├── Is quality degrading? (inconsistencies, forgotten patterns)
    │   ├── Yes → Try compaction first, reset if no improvement
    │   └── No → Continue, monitor for degradation
    └── At a natural breakpoint? (feature complete, phase transition)
        ├── Yes → Good time for preventive compaction
        └── No → Continue
```

## Structured Handoff Protocol

When performing a context reset, write `harness/context-handoff.md`:

```markdown
# Context Handoff

## Project State
[What has been built — completed features with status]
- Feature 1: PASS (2 iterations)
- Feature 2: PASS (1 iteration)
- Feature 3: In progress — sprint contract written, not yet implemented

## Current Task
[What the new agent should work on next — be specific]

## Architecture Decisions
[Key decisions that must be preserved — include reasoning]
- Using Zustand for state management — chosen over Redux for simplicity,
  all stores in `src/store/`
- API routes prefixed with `/api/v1/` — versioned for future compatibility
- SQLite with WAL mode — single-file DB in `data/app.db`

## File Map
[Key files and their purposes — the new agent needs this to navigate]
- `src/components/Editor.tsx` — Main editor component (canvas + tools)
- `src/components/Sidebar.tsx` — Tool palette and settings panels
- `src/api/routes/` — All FastAPI route modules
- `src/store/editorStore.ts` — Editor state (zoom, tool, selection)
- `SPEC.md` — Product specification (source of truth)
- `harness/` — Harness communication files

## Known Issues
[Problems discovered but not yet fixed]
- Tile palette scrollbar barely visible in dark theme
- Grid overlay flickers during rapid zoom changes

## Conventions Established
[Patterns the new agent must follow for consistency]
- Components: PascalCase, one component per file
- API routes: snake_case, grouped by resource in separate modules
- State: Zustand stores, named `*Store.ts`
- Styling: Tailwind CSS with project-specific color tokens in tailwind.config
- Error handling: try/catch on all API calls, toast notifications for user-facing errors

## Next Steps
1. Implement Feature 3 per the sprint contract in harness/sprint-contract.md
2. After completion, write sprint-result.md for evaluator
3. Remaining features from SPEC.md: Feature 4, Feature 5, Feature 6
```

## Guidelines

- **Preventive > reactive** — Compact or reset before quality degrades, not after
- **Natural breakpoints** — Feature completions, phase transitions, and commit points are ideal
- **Preserve decisions** — Architecture choices, naming conventions, and "why" reasoning are most critical
- **File map is mandatory** — The new agent needs to know where things are without re-exploring
- **Test after reset** — Verify the new agent can build and run the app before resuming
- **Don't over-handoff** — If the model can run 2+ hours coherently (Opus 4.6), don't reset unnecessarily
