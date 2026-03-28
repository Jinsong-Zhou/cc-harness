# cc-harness — Development Guide

This is a Claude Code plugin, not a standalone application.

## Project Structure

```
agents/        — Agent definitions (markdown + YAML frontmatter)
skills/        — Skills with SKILL.md + references/ subdirectories
commands/      — Slash command definitions (markdown + YAML frontmatter)
rules/common/  — Always-loaded prescriptive rules (plain markdown)
hooks/         — hooks.json (auto-loaded by Claude Code, do NOT reference in plugin.json)
scripts/hooks/ — Node.js hook implementations
.claude-plugin/ — Plugin manifests only (plugin.json, marketplace.json)
```

## Key Rules

- **hooks.json is auto-loaded** — Do NOT add a `hooks` field to plugin.json (causes duplicate errors)
- **`${CLAUDE_PLUGIN_ROOT}`** — Always use this variable for paths in hooks.json, never hardcode
- **plugin.json + marketplace.json + package.json** — Keep version numbers in sync across all three
- **agents use explicit paths** in plugin.json (`./agents/planner.md`), commands/skills use directory paths (`./commands/`)
- **`harness/` is a runtime directory** — Created in the user's project by track-iteration.js, not part of plugin source

## File Formats

- **Agents**: YAML frontmatter with `name`, `description`, `tools` (array), `model` (opus/sonnet)
- **Skills**: YAML frontmatter with `name`, `description`, `origin`
- **Commands**: YAML frontmatter with `description`
- **Rules**: Plain markdown, no frontmatter, imperative tone

## Testing Changes

```bash
# Install from local source
/plugin marketplace add /path/to/cc-harness
/plugin install cc-harness@cc-harness-dev

# Restart Claude Code, then test
/harness <test prompt>
/evaluate
/harness-status

# Uninstall when done
/plugin uninstall cc-harness@cc-harness-dev
```

## Hook Scripts

- Written in Node.js (not bash) for cross-platform compatibility
- All hooks go through `run-with-flags.js` for profile-based gating
- Scripts export a `run(hookId, stdin, env)` function for fast require()-based loading
- Use `process.stdin.isTTY` check before reading stdin to avoid hanging

## Conventions

- JS files use CommonJS (`require`), not ESM
- Markdown content uses direct quotes from the Anthropic blog post where applicable
- Evaluator content emphasizes skepticism — avoid language that softens QA feedback
