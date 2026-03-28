#!/usr/bin/env node

/**
 * Harness iteration tracker
 *
 * Tracks iteration state across compaction and session boundaries.
 * Invoked by hooks to preserve harness context.
 */

const fs = require("fs");
const path = require("path");

const command = process.argv[2];
const cwd = process.env.CLAUDE_WORKING_DIRECTORY || process.cwd();
const harnessDir = path.join(cwd, "harness");
const logFile = path.join(harnessDir, "iteration-log.md");
const stateFile = path.join(harnessDir, ".harness-state.json");

function readState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    return {
      startTime: new Date().toISOString(),
      iterations: 0,
      features: { completed: 0, failed: 0, pending: 0 },
      currentFeature: null,
    };
  }
}

function writeState(state) {
  if (!fs.existsSync(harnessDir)) return;
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function preCompact() {
  // Before compaction, save current harness state so it survives context compression
  const state = readState();
  state.lastCompaction = new Date().toISOString();
  writeState(state);

  // Append a note to the iteration log
  if (fs.existsSync(logFile)) {
    const note = `\n---\n*Context compacted at ${new Date().toISOString()}*\n`;
    fs.appendFileSync(logFile, note);
  }
}

function sessionSummary() {
  if (!fs.existsSync(harnessDir)) return;

  const state = readState();
  const duration = state.startTime
    ? Math.round((Date.now() - new Date(state.startTime).getTime()) / 60000)
    : 0;

  const summary = [
    "",
    "---",
    `## Session Summary — ${new Date().toISOString()}`,
    "",
    `- **Duration:** ${duration} minutes`,
    `- **Iterations:** ${state.iterations}`,
    `- **Features completed:** ${state.features.completed}`,
    `- **Features failed:** ${state.features.failed}`,
    `- **Compactions:** ${state.lastCompaction ? "yes" : "none"}`,
    "",
  ].join("\n");

  if (fs.existsSync(logFile)) {
    fs.appendFileSync(logFile, summary);
  }
}

switch (command) {
  case "pre-compact":
    preCompact();
    break;
  case "session-summary":
    sessionSummary();
    break;
  default:
    // Unknown command, silently ignore
    break;
}
