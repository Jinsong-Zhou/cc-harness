# Harness Audit Template

Use this template when evaluating whether harness components are still load-bearing for a given model version.

## Instructions

1. Copy this template to `harness/audit-YYYY-MM-DD.md`
2. Fill in the model and task details
3. For each component, run the task with and without it
4. Record quality impact and decision

---

## Harness Audit: [Date]

### Configuration
- **Model:** [e.g., Opus 4.6]
- **Task:** [Brief description of the test task]
- **Baseline:** [Full harness run — duration, cost, quality score]

### Component Analysis

| Component | Tested Without? | Quality Impact | Decision | Notes |
|-----------|----------------|---------------|----------|-------|
| Planner | [ ] | | Keep / Remove | |
| Sprint decomposition | [ ] | | Keep / Remove | |
| Sprint contracts | [ ] | | Keep / Remove | |
| Generator self-eval | [ ] | | Keep / Remove | |
| Evaluator (QA) | [ ] | | Keep / Remove | |
| Context resets | [ ] | | Keep / Remove | |
| File-based handoffs | [ ] | | Keep / Remove | |
| Visual design language | [ ] | | Keep / Remove | |

### Quality Comparison

| Metric | Full Harness | Without [Component] | Delta |
|--------|-------------|-------------------|-------|
| Duration | | | |
| Cost | | | |
| Features working | | | |
| Avg evaluator score | | | |
| Critical bugs found | | | |

### Recommendations

**Remove:**
- [Component] — [Why it's no longer needed]

**Keep:**
- [Component] — [Why it's still load-bearing]

**Add:**
- [New component idea] — [What problem it would solve]

### Conclusions

[Summary of what changed, what the harness looks like now, what to test next time]
