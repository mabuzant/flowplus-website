#!/usr/bin/env bash
# flow+ auto-blog engine — weekly runner.
# Ensures we are on a clean `main` (the branch Railway deploys), then lets the
# Claude CLI write + publish the next post headless. No paid APIs.
set -euo pipefail
cd "$(dirname "$0")/../.."

TS="$(date +%Y-%m-%d_%H-%M-%S)"
LOG=".claude/blog-engine/logs/${TS}.log"
log() { echo "$@" | tee -a "$LOG"; }

log "== blog-engine run ${TS} =="

# Refuse to run on a dirty tree — the engine commits with `git add -A`, so any
# unrelated uncommitted work would be swept into the published commit.
if [ -n "$(git status --porcelain)" ]; then
  log "ABORT: working tree is not clean. Commit or stash changes before running."
  exit 1
fi

# The engine publishes to `main` (Railway auto-deploys `main`). Switch to it and
# fast-forward so the new post lands on the deployed branch, not a stale checkout.
git checkout main >> "$LOG" 2>&1
git pull --ff-only origin main >> "$LOG" 2>&1

claude -p "$(cat .claude/blog-engine/write-next-post.md)" --permission-mode acceptEdits >> "$LOG" 2>&1

log "== done ${TS} =="
