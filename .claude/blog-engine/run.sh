#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
TS="$(date +%Y-%m-%d_%H-%M-%S)"
LOG=".claude/blog-engine/logs/${TS}.log"
echo "== blog-engine run ${TS} ==" | tee -a "$LOG"
claude -p "$(cat .claude/blog-engine/write-next-post.md)" --permission-mode acceptEdits >> "$LOG" 2>&1
echo "== done ${TS} ==" | tee -a "$LOG"
