# Context Strategy

## When to Act

- Before context window fills — preventive, not reactive
- At natural breakpoints — feature completions, phase transitions, commit points
- When quality degrades — coherence loss, forgotten patterns, repeated mistakes
- When agent wraps up prematurely — context anxiety signal

## Decision Rules

1. **Compaction first** — Try compaction before a full context reset
2. **Reset when anxious** — If the agent shows context anxiety, compaction won't help. Reset.
3. **Preserve decisions** — Architecture choices, naming conventions, and "why" reasoning are the most critical things to carry forward
4. **File map is mandatory** — Every handoff must include a file map so the new agent knows where things are

## Model Guidance

| Model | Context Anxiety | Strategy |
|-------|----------------|----------|
| Sonnet 4.5 | Strong | Context resets essential |
| Opus 4.5+ | Minimal | Compaction usually sufficient |
| Opus 4.6 | Minimal | Can run 2+ hours coherently |

## Handoff Checklist

Before a context reset, the handoff file MUST include:
- [ ] Project state (completed features list)
- [ ] Current task (what to do next)
- [ ] Architecture decisions (what and why)
- [ ] File map (key files and purposes)
- [ ] Known issues
- [ ] Established conventions
