<p align="center">
  <strong>🌐 Language / 语言</strong><br>
  <a href="README.md">English</a> •
  <a href="README.zh-CN.md">简体中文</a> •
  <a href="README.ja.md">日本語</a> •
  <a href="README.ko.md">한국어</a>
</p>

# cc-harness

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-orange)](https://github.com/Jinsong-Zhou/cc-harness)

**Multi-agent harness framework for long-running application development with Claude Code.**

Based on Anthropic's research: [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

---

## Why This Exists

Single-agent approaches to complex coding tasks produce superficially impressive but often **broken** results. Two persistent problems:

1. **Self-evaluation bias** — Models confidently praise their own mediocre work. Separating creation from evaluation is the strongest lever for quality.
2. **Context deterioration** — Models lose coherence over long sessions. Structured handoffs and context management keep multi-hour builds on track.

This plugin implements a **generator-evaluator architecture** (inspired by GANs) that drives real quality through iterative feedback loops.

## Architecture

```
User Prompt (1-4 sentences)
        │
        ▼
┌──────────────┐
│   PLANNER    │──→ SPEC.md (ambitious product spec)
│  (read-only) │
└──────────────┘
        │
        ▼
┌──────────────┐         file-based          ┌──────────────┐
│  GENERATOR   │◄──────communication────────►│  EVALUATOR   │
│  (builds)    │                              │  (tests)     │
└──────────────┘                              └──────────────┘
        │                                            │
   git commit                                  tests live app
        ▲                                     via Playwright/
        └────────iterate if FAIL──────────────browser tools
```

## Quick Start

### Installation

```bash
# Add the marketplace
/plugin marketplace add Jinsong-Zhou/cc-harness

# Install the plugin
/plugin install cc-harness@cc-harness-marketplace
```

Then restart Claude Code.

### Usage

```bash
# Start a harnessed development session
/harness Build a browser-based DAW using the Web Audio API

# Evaluate current work at any point
/evaluate
/evaluate the login flow
/evaluate frontend design

# Check session progress
/harness-status
```

## What's Inside

```
cc-harness/
├── .claude-plugin/
│   ├── plugin.json                              # Plugin identity & metadata
│   └── marketplace.json                         # Marketplace distribution config
│
├── agents/
│   ├── planner.md                               # Expands prompts → ambitious product specs
│   ├── generator.md                             # Builds features one at a time, commits to git
│   └── evaluator.md                             # Skeptical QA — tests live apps, grades against criteria
│
├── skills/
│   ├── harness-loop/
│   │   ├── SKILL.md                             # Core generator-evaluator iteration loop orchestration
│   │   └── references/
│   │       ├── sprint-contract-examples.md      # Worked examples of sprint contracts
│   │       └── evaluation-examples.md           # Calibrated QA feedback examples from real runs
│   ├── context-management/
│   │   └── SKILL.md                             # Compaction vs reset strategies for long sessions
│   └── harness-tuning/
│       ├── SKILL.md                             # Evaluator calibration & harness simplification
│       └── references/
│           └── audit-template.md                # Template for auditing harness component necessity
│
├── commands/
│   ├── harness.md                               # /harness — start a harnessed development session
│   ├── evaluate.md                              # /evaluate — trigger standalone QA evaluation
│   └── harness-status.md                        # /harness-status — show session progress & scores
│
├── rules/
│   └── common/
│       ├── harness-workflow.md                  # Mandatory pipeline: plan → contract → build → evaluate
│       ├── evaluator-discipline.md              # Evaluator mindset rules — skepticism over politeness
│       ├── context-strategy.md                  # When to compact vs reset, model-specific guidance
│       └── file-communication.md                # File-based agent communication protocol
│
├── hooks/
│   └── hooks.json                               # Lifecycle hooks: SessionStart, PreCompact, Stop
│
├── scripts/
│   └── hooks/
│       ├── run-with-flags.js                    # Profile-based hook runner (minimal/standard/strict)
│       └── track-iteration.js                   # Iteration counter, state persistence, session summaries
│
├── examples/
│   └── todo-app-harness/                        # Complete worked example of a harness session
│       ├── SPEC.md                              # Example planner output
│       ├── sprint-contract.md                   # Example sprint contract
│       ├── sprint-result.md                     # Example generator handoff
│       └── qa-feedback.md                       # Example evaluator feedback (FAIL with bugs)
│
├── package.json
├── CLAUDE.md                                     # Plugin development guide
├── CHANGELOG.md                                  # Version history
├── LICENSE                                       # MIT
└── README.md
```

## Examples

The `examples/todo-app-harness/` directory contains a complete worked example showing what each harness artifact looks like in practice — from planner spec through evaluator feedback with real bug reports. Review these to understand the expected depth and format.

## Components

### Agents

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| `harness-planner` | Opus | Read-only | Converts 1-4 sentence prompts into ambitious product specs |
| `harness-generator` | Opus | Full write | Builds features iteratively with git commits |
| `harness-evaluator` | Opus | Read + Bash | Skeptical QA — tests live apps via Playwright/browser |

### Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `harness-loop` | Building complex apps autonomously | Orchestrates the full planner → generator → evaluator loop |
| `context-management` | Long sessions approaching limits | Strategies for compaction vs resets, structured handoffs |
| `harness-tuning` | Optimizing harness performance | Evaluator calibration, component removal, prompt engineering |

### Commands

| Command | Purpose |
|---------|---------|
| `/harness <prompt>` | Start a harnessed development session |
| `/evaluate [scope]` | Trigger standalone evaluation |
| `/harness-status` | Show session progress and scores |

### Rules

Always-loaded prescriptive guidelines:
- **harness-workflow** — Mandatory pipeline for complex builds
- **evaluator-discipline** — Skepticism over politeness in QA
- **context-strategy** — When and how to manage context
- **file-communication** — Protocol for inter-agent file communication

### Hooks

| Event | Profile | Purpose |
|-------|---------|---------|
| `SessionStart` | minimal+ | Initialize or restore harness state (only when SPEC.md or harness/ exists) |
| `PreCompact` | minimal+ | Save state before context compaction |
| `Stop` | minimal+ | Write session summary with metrics |

**Hook profiles:** Control verbosity via `CC_HARNESS_PROFILE` env var:
- `minimal` — State persistence only
- `standard` (default) — State + iteration tracking
- `strict` — All hooks including verbose logging

## Grading Criteria

### Full-Stack Applications

| Criterion | Weight | Measures |
|-----------|--------|----------|
| Product Depth | HIGH | Real functionality vs facades — can users complete workflows? |
| Functionality | HIGH | Does it actually work? Bugs, edge cases, error states? |
| Visual Design | MEDIUM | Polished, consistent, full-viewport UI with coherent identity |
| Code Quality | LOW | Competence check — broken fundamentals only |

### Frontend Design

| Criterion | Weight | Measures |
|-----------|--------|----------|
| Design Quality | HIGH | Coherent whole vs collection of parts — mood and identity |
| Originality | HIGH | Custom decisions vs AI patterns / template defaults |
| Craft | MEDIUM | Typography, spacing, color harmony, contrast |
| Functionality | MEDIUM | Usability independent of aesthetics |

## File-Based Communication

Agents communicate through files in `harness/`, not conversation context:

```
harness/
├── sprint-contract.md       # Generator → Evaluator: what "done" means
├── sprint-result.md         # Generator → Evaluator: what was built
├── qa-feedback.md           # Evaluator → Generator: grades + issues
├── iteration-log.md         # Running log of all iterations
├── context-handoff.md       # Structured state for context resets
└── .harness-state.json      # Machine-readable session metrics
```

## Cost Reference

| Approach | Duration | Cost | Quality |
|----------|----------|------|---------|
| Solo agent (no harness) | ~20 min | ~$9 | Broken core features |
| Full harness (with sprints) | ~6 hours | ~$200 | Working, polished |
| Simplified harness (no sprints) | ~4 hours | ~$125 | Working, comparable |

> The full harness costs ~20x more than solo but produces **actually working** applications.

## Adapting to New Models

Every harness component encodes an assumption about model limitations. Use the `harness-tuning` skill to systematically audit which components are still load-bearing:

| Component | Status with Opus 4.6 |
|-----------|---------------------|
| Planner | **Keep** — models don't naturally expand scope ambitiously |
| Evaluator | **Keep** — self-evaluation bias persists across all versions |
| Sprint decomposition | **Removed** — model maintains coherence over 2+ hour builds |
| Context resets | **Removed** — no context anxiety in recent models |

## Credits

Based on research by Prithvi Rajasekaran at Anthropic:
[Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

## License

MIT
