#!/usr/bin/env node

/**
 * Harness iteration tracker.
 *
 * Can be invoked directly or via require() from run-with-flags.js.
 * Tracks iteration state across compaction and session boundaries.
 *
 * Commands:
 *   pre-compact     — Save harness state before context compaction
 *   session-start   — Initialize or restore harness state
 *   session-summary — Write session summary on stop
 *   log-iteration   — Append an iteration to the log
 */

const fs = require("fs");
const path = require("path");

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
      compactions: 0,
      features: { completed: 0, failed: 0, pending: 0 },
      currentFeature: null,
      scores: [],
    };
  }
}

function writeState(state) {
  if (!fs.existsSync(harnessDir)) return;
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function ensureLogFile() {
  if (!fs.existsSync(harnessDir)) {
    fs.mkdirSync(harnessDir, { recursive: true });
  }
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(
      logFile,
      "# Harness Iteration Log\n\n" +
        "| # | Feature | Result | Score | Duration | Timestamp |\n" +
        "|---|---------|--------|-------|----------|-----------|\n"
    );
  }
}

function preCompact() {
  if (!fs.existsSync(harnessDir)) return;

  const state = readState();
  state.compactions = (state.compactions || 0) + 1;
  state.lastCompaction = new Date().toISOString();
  writeState(state);

  if (fs.existsSync(logFile)) {
    const note = `\n> *Context compacted at ${new Date().toISOString()} (compaction #${state.compactions})*\n`;
    fs.appendFileSync(logFile, note);
  }
}

function sessionStart() {
  ensureLogFile();
  const state = readState();

  // If there's an existing state with a startTime, this is a resume
  if (state.startTime && state.iterations > 0) {
    // Emit a resume note
    if (fs.existsSync(logFile)) {
      const note = `\n> *Session resumed at ${new Date().toISOString()} (${state.iterations} prior iterations)*\n`;
      fs.appendFileSync(logFile, note);
    }
  } else {
    // Fresh session
    state.startTime = new Date().toISOString();
    writeState(state);
  }
}

function sessionSummary() {
  if (!fs.existsSync(harnessDir)) return;

  const state = readState();
  const duration = state.startTime
    ? Math.round((Date.now() - new Date(state.startTime).getTime()) / 60000)
    : 0;

  const avgScore =
    state.scores && state.scores.length > 0
      ? (state.scores.reduce((a, b) => a + b, 0) / state.scores.length).toFixed(1)
      : "N/A";

  const summary = [
    "",
    "---",
    "",
    `## Session Summary`,
    "",
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Duration | ${duration} min |`,
    `| Total iterations | ${state.iterations} |`,
    `| Features completed | ${state.features.completed} |`,
    `| Features failed | ${state.features.failed} |`,
    `| Avg score | ${avgScore} |`,
    `| Compactions | ${state.compactions || 0} |`,
    `| Timestamp | ${new Date().toISOString()} |`,
    "",
  ].join("\n");

  if (fs.existsSync(logFile)) {
    fs.appendFileSync(logFile, summary);
  }
}

function logIteration(hookId, stdin) {
  ensureLogFile();
  const state = readState();
  state.iterations++;

  // Try to parse iteration data from stdin
  let data = {};
  try {
    data = JSON.parse(stdin || "{}");
  } catch {
    // No structured data
  }

  const feature = data.feature || state.currentFeature || "unknown";
  const result = data.result || "—";
  const score = data.score || "—";
  const duration = data.duration || "—";

  if (typeof data.score === "number") {
    state.scores = state.scores || [];
    state.scores.push(data.score);
  }

  if (result === "PASS") {
    state.features.completed++;
  } else if (result === "FAIL") {
    state.features.failed++;
  }

  state.currentFeature = data.nextFeature || null;
  writeState(state);

  const row = `| ${state.iterations} | ${feature} | ${result} | ${score} | ${duration} | ${new Date().toISOString()} |\n`;
  fs.appendFileSync(logFile, row);
}

// Export for require() usage from run-with-flags.js
module.exports.run = function (hookId, stdin, env) {
  switch (hookId) {
    case "pre-compact":
      preCompact();
      break;
    case "session-start":
      sessionStart();
      break;
    case "session-summary":
      sessionSummary();
      break;
    case "log-iteration":
      logIteration(hookId, stdin);
      break;
  }
};

// Direct invocation
if (require.main === module) {
  const command = process.argv[2];
  let stdin = "";
  try {
    stdin = require("fs").readFileSync(0, { encoding: "utf8", flag: "r" });
  } catch {
    // No stdin
  }
  module.exports.run(command, stdin, process.env);
}
