#!/usr/bin/env node

/**
 * Hook runner with profile-based gating.
 *
 * Usage: node run-with-flags.js <hookId> <scriptPath> <profiles>
 *
 * Profiles: comma-separated list of profiles this hook runs under.
 *   - minimal: Only essential hooks (state persistence)
 *   - standard: Default — state persistence + iteration tracking
 *   - strict: All hooks including verbose logging
 *
 * Environment:
 *   - CC_HARNESS_PROFILE: Active profile (default: "standard")
 *   - CC_HARNESS_DISABLED_HOOKS: Comma-separated hook IDs to skip
 *   - CLAUDE_PLUGIN_ROOT: Plugin installation root
 */

const path = require("fs");
const { spawnSync } = require("child_process");

const [, , hookId, scriptRelPath, profiles = "standard,strict"] = process.argv;

if (!hookId || !scriptRelPath) {
  process.exit(0);
}

// Check profile
const activeProfile = process.env.CC_HARNESS_PROFILE || "standard";
const allowedProfiles = profiles.split(",").map((p) => p.trim());
if (!allowedProfiles.includes(activeProfile)) {
  process.exit(0);
}

// Check disabled hooks
const disabledHooks = (process.env.CC_HARNESS_DISABLED_HOOKS || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);
if (disabledHooks.includes(hookId)) {
  process.exit(0);
}

// Resolve script path
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || __dirname.replace(/[/\\]scripts[/\\]hooks$/, "");
const scriptPath = require("path").resolve(pluginRoot, scriptRelPath);

// Security: prevent path traversal
if (!scriptPath.startsWith(pluginRoot)) {
  console.error(`[cc-harness] Blocked path traversal attempt: ${scriptRelPath}`);
  process.exit(1);
}

// Read stdin (hook payload)
let stdin = "";
try {
  const fs = require("fs");
  stdin = fs.readFileSync(0, { encoding: "utf8", flag: "r" });
} catch {
  // No stdin available — that's fine
}

// Try to require the script if it exports a run() function
try {
  const mod = require(scriptPath);
  if (typeof mod.run === "function") {
    const result = mod.run(hookId, stdin, process.env);
    if (result && typeof result.then === "function") {
      result.catch(() => process.exit(0));
    }
    process.exit(0);
  }
} catch {
  // Fall through to spawn
}

// Fallback: spawn the script
const result = spawnSync(process.execPath, [scriptPath, hookId], {
  input: stdin,
  encoding: "utf8",
  timeout: 30000,
  env: { ...process.env, CC_HARNESS_HOOK_ID: hookId },
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status || 0);
