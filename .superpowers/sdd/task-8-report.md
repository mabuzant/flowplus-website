# Task 8 Report — Blog engine: topics backlog, write-next-post workflow, sitemap regen

## Files created
- `.claude/blog-engine/topics.json` — 20 topics, all `used:false`
- `.claude/blog-engine/gen-sitemap.js` — exact code from plan
- `.claude/blog-engine/write-next-post.md` — headless workflow, 7 numbered steps
- `.claude/blog-engine/run.sh` — exact code from plan, `chmod +x` applied (mode 100755)
- `.claude/blog-engine/logs/.gitkeep`

## Topic count
20 topics. Verified programmatically: 20 unique slugs, 20 unique titles, mix of `audience` values — 11 `global` (creative-tech/AI-studio clients) and 9 `regional` (UAE/MENA workshop seekers). Each has a Reddit-style `question` field (e.g. "how do agencies actually use AI", "how much does an AI workshop cost in Abu Dhabi").

## gen-sitemap.js output
```
$ node .claude/blog-engine/gen-sitemap.js
sitemap regenerated with 1 posts
```
`git diff sitemap.xml` showed the seed post URL (`https://flowplus.ae/blog/ai-workshops-uae-guide`) still present, with a `<lastmod>2026-07-22</lastmod>` tag added (expected — the plan's exact `gen-sitemap.js` code adds `lastmod` from `posts.json`, which the manually-authored Task 6 sitemap entry didn't have). Diff was correct, so it was kept (no `git checkout` needed).

## CLI print flag confirmed
`claude --version` → `2.1.216 (Claude Code)`. `claude --help | grep -i -- '-p\|print'` confirms `-p, --print` is the correct non-interactive flag — matches `run.sh` verbatim from the plan; no adjustment needed.

## Dry-run guard result
1. Backed up `topics.json`, then set every topic's `used` to `true`.
2. Ran `bash .claude/blog-engine/run.sh` (real headless `claude -p` invocation, no mocking).
3. Log (`.claude/blog-engine/logs/2026-07-22_19-21-28.log`, deleted after inspection — not committed) showed:
   ```
   == blog-engine run 2026-07-22_19-21-28 ==
   ... no unused topics
   == done 2026-07-22_19-21-28 ==
   ```
4. Exit code `0`. `git status --porcelain` showed no new post file and no new commit — only the pre-existing `sitemap.xml` modification and untracked `.claude/blog-engine/` / `.superpowers/` directories, i.e. nothing added by the run.
5. Restored `topics.json` to all `used:false` from the backup (git checkout wasn't usable since the file was untracked at that point; restored from a scratchpad copy instead, then verified all 20 entries are `used:false`).

## Additional notes
- Added `.claude/blog-engine/logs/*.log` to `.gitignore` so future scheduled runs don't pollute the repo with log files (only `.gitkeep` is tracked).
- `write-next-post.md` explicitly encodes: exact topic-picking logic, template token list matching `blog/_template.html` (`__TITLE__`, `__DESCRIPTION__`, `__SLUG__`, `__DATE_ISO__`, `__FAQ_JSONLD__`, `__BODY_HTML__`), a mandatory "no leftover `__..__` tokens" scan before writing the file, brand-voice rules (confident/concise/technical-but-human, no hype/emoji, `flow+` casing, no invented stats/clients), and a "no paid APIs — local files + subscription CLI only" statement.

## Commit
`ac36634` — "feat(engine): add topic backlog, write-next-post workflow, sitemap regen, run.sh" on branch `feat/seo-aeo-blog-engine`, with Co-Authored-By trailer. 7 files changed (5 new under `.claude/blog-engine/`, plus `sitemap.xml` and `.gitignore` updates).
