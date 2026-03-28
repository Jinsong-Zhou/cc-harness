# cc-harness

A Claude Code plugin that implements a multi-agent harness framework for long-running application development. Based on Anthropic's research on [harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps).

## What It Does

Single-agent approaches to complex coding tasks produce superficially impressive but often broken results. This plugin provides a **generator-evaluator architecture** — inspired by GANs — that separates creation from evaluation, driving real quality through iterative feedback loops.

### Three-Agent Architecture

```
User Prompt → Planner → Generator ⇄ Evaluator → Working Application
```

- **Planner**: Expands 1-4 sentence prompts into ambitious product specs
- **Generator**: Implements features one at a time, commits to git
- **Evaluator**: Skeptical QA agent that tests the live application via browser/Playwright

### Why It Works

1. **Self-evaluation bias is real** — Models confidently praise their own mediocre work. Separating creation from evaluation is a strong lever.
2. **Context deterioration is manageable** — Structured handoffs and context management strategies keep multi-hour sessions coherent.
3. **Iterative improvement works** — 2-3 rounds of generate → evaluate → fix produces actually working applications vs. facades.

## Installation

```bash
/plugin marketplace add <your-github-username>/cc-harness
/plugin install cc-harness@<marketplace-name>
```

Then restart Claude Code.

## Usage

### Start a Harnessed Session

```
/harness Build a retro 2D game maker with sprite editor and level designer
```

This will:
1. Expand your prompt into a detailed product spec
2. Show you the spec for approval
3. Build features one at a time with QA evaluation after each
4. Iterate on failures until quality criteria are met

### Evaluate Current Work

```
/evaluate                    # Full application evaluation
/evaluate the login flow     # Evaluate a specific feature
/evaluate frontend design    # Use frontend design criteria
```

### Check Progress

```
/harness-status
```

## Components

### Agents

| Agent | Purpose |
|-------|---------|
| `harness-planner` | Converts brief prompts into ambitious product specs |
| `harness-generator` | Builds features iteratively with git commits |
| `harness-evaluator` | Skeptical QA — tests live apps, grades against criteria |

### Skills

| Skill | Purpose |
|-------|---------|
| `harness-loop` | Orchestrates the full generator-evaluator iteration loop |
| `context-management` | Strategies for compaction vs context resets in long sessions |
| `harness-tuning` | Guide for calibrating evaluator and simplifying harness over time |

### Commands

| Command | Purpose |
|---------|---------|
| `/harness` | Start a harnessed development session |
| `/evaluate` | Trigger standalone evaluation |
| `/harness-status` | Show session progress and scores |

### Hooks

- **PreCompact**: Saves harness state before context compaction
- **Stop**: Writes session summary with duration, iterations, and feature counts

## Grading Criteria

### Full-Stack Applications

| Criterion | Weight | Measures |
|-----------|--------|----------|
| Product Depth | High | Real functionality vs facades |
| Functionality | High | Does it actually work? |
| Visual Design | Medium | Polished, consistent UI |
| Code Quality | Low | Broken fundamentals only |

### Frontend Design

| Criterion | Weight | Measures |
|-----------|--------|----------|
| Design Quality | High | Coherent whole vs parts |
| Originality | High | Custom decisions vs AI patterns |
| Craft | Medium | Typography, spacing, color |
| Functionality | Medium | Usability |

## File-Based Communication

Agents communicate through files in the `harness/` directory:

```
harness/
├── sprint-contract.md    # Generator proposes what "done" means
├── sprint-result.md      # Generator describes what was built
├── qa-feedback.md        # Evaluator grades and lists issues
├── iteration-log.md      # Running log of all iterations
└── .harness-state.json   # Machine-readable session state
```

## Adapting to New Models

Every harness component encodes an assumption about model limitations. As models improve, use the `harness-tuning` skill to systematically remove components that are no longer load-bearing:

- Sprint decomposition was removed for Opus 4.6 (maintains coherence over 2+ hour builds)
- Context resets were removed for Opus 4.5+ (no context anxiety)
- The evaluator remains load-bearing across all model versions (self-evaluation bias persists)

## Cost Reference

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Solo agent | ~20 min | ~$9 | Broken core features |
| Full harness | ~6 hours | ~$200 | Working, polished |
| Simplified harness | ~4 hours | ~$125 | Working, comparable |

## Credits

Based on research by Prithvi Rajasekaran at Anthropic: [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

## License

MIT
