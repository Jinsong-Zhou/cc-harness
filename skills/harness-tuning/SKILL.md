---
name: harness-tuning
description: Use when optimizing or simplifying a multi-agent harness - guides systematic removal of components as models improve, evaluator calibration, and prompt engineering for grading criteria
---

# Harness Tuning and Evolution

Every component in a harness encodes an assumption about what the model can't do on its own. This skill guides systematic tuning of harness components to match current model capabilities.

## When to Use

- Setting up a harness for a new model version
- Evaluator is too lenient or too harsh
- Harness feels like unnecessary overhead for the task
- Wanting to reduce cost/latency of the harness pipeline
- Adapting an existing harness to a newer model

## Core Principle

As models improve, harness complexity should decrease incrementally. The space of interesting harness combinations doesn't shrink — it moves. The work is finding the next novel combination.

## Evaluator Calibration

The evaluator is the most critical component to tune. Out of the box, Claude is a poor QA agent — it identifies legitimate issues then talks itself into approving the work anyway.

### Calibration Loop

1. **Run the harness** on a realistic task
2. **Read evaluator logs** — look at what it scored and what it said
3. **Compare against your judgment** — where does the evaluator diverge from you?
4. **Update the evaluator prompt** to fix the divergence
5. **Repeat** — it takes several rounds before grading is reasonable

### Common Evaluator Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Passes everything | Default LLM generosity | Add explicit "never give 5 unless genuinely impressed" |
| Identifies bugs then approves | Conflict avoidance | Add "if you find a critical issue, the assessment is FAIL regardless" |
| Scores inflate over iterations | Anchoring to previous scores | Reset score context each evaluation |
| Misses functional bugs | Only reads code, doesn't test | Require browser/API interaction before scoring |
| Too harsh on style | Over-indexing on craft | Reweight criteria: functionality > originality > craft |

### Few-Shot Calibration

Provide the evaluator with example score breakdowns that match your preferences:

```markdown
## Example: Login form with broken validation
- Product Depth: 2 — Form renders but validation is display-only, invalid submissions go through
- Functionality: 1 — Core feature is broken
- Visual Design: 3 — Looks acceptable but generic
- Code Quality: 2 — No input sanitization
- Overall: FAIL — Cannot ship a login that doesn't validate
```

## Prompt Engineering for Criteria

The wording of grading criteria directly shapes generator behavior, independent of the evaluator's feedback loop.

### Observed Effects

- **"Museum quality"** in design criteria → pushes toward specific visual convergence (polished but similar-looking outputs)
- **"Penalize AI-generated patterns"** → encourages more aesthetic risk-taking and distinctive choices
- **"A human designer should recognize deliberate creative choices"** → drives away from template defaults
- **"Usability independent of aesthetics"** → keeps functionality grounded even when design gets experimental

### Guidelines for Writing Criteria

1. **Be specific about what failure looks like** — "purple gradients over white cards" is better than "generic AI patterns"
2. **Weight criteria intentionally** — Emphasize what the model is weak at, not what it already does well
3. **Include negative examples** — Show what to avoid, not just what to aim for
4. **Avoid vague superlatives** — "Professional quality" means nothing; "would pass code review at a startup" is concrete

## Component Removal Protocol

When a new model arrives, systematically test whether each harness component is still load-bearing:

### Step 1: Identify Components
List every component in your harness:
- [ ] Planner (prompt → spec expansion)
- [ ] Sprint decomposition (spec → sequential features)
- [ ] Sprint contracts (pre-negotiated success criteria)
- [ ] Generator self-evaluation
- [ ] Evaluator (skeptical QA)
- [ ] Context resets
- [ ] File-based handoffs

### Step 2: Remove One at a Time
For each component:
1. Remove it from the harness
2. Run the same task
3. Compare output quality
4. If quality holds → component is no longer load-bearing, remove it
5. If quality drops → component is still needed, keep it

### Step 3: Document Results

```markdown
## Harness Audit: [Model Version]

| Component | Removed? | Quality Impact | Decision |
|-----------|----------|---------------|----------|
| Sprint decomposition | Yes | None — model maintains coherence over 2+ hr builds | Remove |
| Planner | No | Significant — model doesn't expand scope ambitiously enough alone | Keep |
| Evaluator | No | Critical — self-evaluation bias persists | Keep |
| Context resets | Yes | None — model no longer shows context anxiety | Remove |
```

## Evolution Examples

### Sonnet 4.5 → Opus 4.5
- **Removed:** Context resets (Opus 4.5 doesn't exhibit context anxiety)
- **Kept:** Sprint decomposition, evaluator, planner
- **Result:** Simpler harness, same quality, lower cost

### Opus 4.5 → Opus 4.6
- **Removed:** Sprint decomposition (model maintains coherence over 2+ hour builds)
- **Kept:** Planner, evaluator
- **Result:** Generator runs as one continuous session; planner and evaluator still add obvious value

## Cost-Quality Tradeoffs

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Solo agent (no harness) | ~20 min | ~$9 | Superficially impressive, core features broken |
| Full harness (sprints) | ~6 hours | ~$200 | Working features, polished UI, real functionality |
| Simplified harness (no sprints) | ~4 hours | ~$125 | Working features, comparable quality |

The full harness costs ~20x more than solo but produces actually working applications. The simplified harness recovers ~40% of the cost while maintaining quality.

## Guidelines

- **Don't add complexity speculatively** — Only add components that solve observed problems
- **Remove before adding** — When a new model arrives, try removing components before adding new ones
- **The evaluator is almost always load-bearing** — Self-evaluation bias is persistent across model versions
- **The planner is usually load-bearing** — Models don't naturally expand scope ambitiously from brief prompts
- **Sprint decomposition is model-dependent** — Test whether the current model needs it
- **Context resets are model-dependent** — Some models need them, newer ones usually don't
