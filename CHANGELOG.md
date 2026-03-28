# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-03-28

### Added
- Rules system (`rules/common/`) with 4 prescriptive guidelines: harness-workflow, evaluator-discipline, context-strategy, file-communication
- Hook runner (`run-with-flags.js`) with profile-based gating (minimal/standard/strict)
- Reference documents: sprint-contract-examples.md, evaluation-examples.md, audit-template.md
- Few-shot QA examples in evaluator agent from real harness runs
- `origin` field in skill frontmatter
- `$ARGUMENTS` support in all commands
- Multi-language README (Chinese, Japanese, Korean)
- CLAUDE.md for plugin development guidance
- CHANGELOG.md

### Changed
- plugin.json: added explicit agent/command/skill paths, repository field, author URL
- Agents: planner restricted to read-only tools; evaluator enriched with 4 calibrated scoring examples
- Evaluator: replaced "Playwright MCP" references with "Playwright via Bash" (accurate tool usage)
- Skills: deeper content with references/ subdirectories
- Commands: `/harness` rewritten with explicit orchestration (agent invocation + iteration logging)
- Commands: `/evaluate` handles missing sprint contract, explicit scope determination
- README: added badges, full directory tree, component tables, hook profiles docs
- Hooks: SessionStart added (only fires when SPEC.md or harness/ exists), PostToolUse removed
- track-iteration.js: `log-iteration` now called explicitly by /harness orchestrator, not via hooks
- track-iteration.js: `sessionStart` only creates harness/ when a session is active
- run-with-flags.js: fixed wrong require, stdin hang, async error handling
- iteration-log.md writer changed from "Auto" to "Orchestrator" in documentation

### Fixed
- `run-with-flags.js` line 19: `require("fs")` → `require("path")`
- `run-with-flags.js`: stdin hang when no pipe (check `process.stdin.isTTY`)
- `run-with-flags.js`: async results silently swallowed by premature `process.exit(0)`
- `track-iteration.js`: stdin hang on direct invocation without pipe

## [1.0.0] - 2026-03-28

### Added
- Initial release
- Three agents: harness-planner, harness-generator, harness-evaluator
- Three skills: harness-loop, context-management, harness-tuning
- Three commands: /harness, /evaluate, /harness-status
- Hooks: PreCompact state save, Stop session summary
- Iteration tracking script (track-iteration.js)
- MIT license
