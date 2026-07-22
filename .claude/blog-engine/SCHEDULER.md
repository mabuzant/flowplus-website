# Blog Engine Scheduler

Installs a weekly local trigger (macOS `launchd`) that runs `.claude/blog-engine/run.sh` every
Monday at 09:00, which in turn drives the headless `write-next-post.md` workflow to write, commit,
and push the next blog post to `origin main`.

## Prerequisites (dependencies)

- **`claude` CLI must be on `PATH`.** `run.sh` invokes `claude -p ...` directly. Verify with:
  ```bash
  which claude
  ```
- **Working `git push` credentials for this repo.** The engine's last step is
  `git add -A && git commit ... && git push origin main`. This requires either:
  - SSH keys configured for the git remote, or
  - Cached HTTPS credentials (credential helper / keychain)

  Verify with a no-op push test, e.g. `git push origin main --dry-run`.
- **The SEO/blog branch must already be merged into `main`.** The engine pushes to
  `origin main`, not to `feat/seo-aeo-blog-engine`. Until this branch (and the blog engine files
  it contains) is merged to `main`, running the scheduler will not have the engine present on the
  branch it's pushing to.

## Install

1. Copy the plist into `~/Library/LaunchAgents/`:
   ```bash
   cp ".claude/blog-engine/com.flowplus.blog.plist" ~/Library/LaunchAgents/com.flowplus.blog.plist
   ```
2. Load it with `launchctl`:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.flowplus.blog.plist
   ```
3. Verify it's registered:
   ```bash
   launchctl list | grep flowplus
   ```
   You should see `com.flowplus.blog` in the output.
4. (Optional) Run it once immediately to confirm the whole pipeline works end-to-end, instead of
   waiting for the next Monday 09:00 trigger:
   ```bash
   launchctl start com.flowplus.blog
   ```
   Check logs at `.claude/blog-engine/logs/` and `/tmp/flowplus-blog.out` / `/tmp/flowplus-blog.err`.

## Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.flowplus.blog.plist
rm ~/Library/LaunchAgents/com.flowplus.blog.plist
```

## Alternative: `scheduled-tasks` MCP

If you prefer not to manage a local `launchd` agent (e.g. running from a machine that isn't always
on), the `scheduled-tasks` MCP's `create_scheduled_task` tool can be used instead to schedule the
same `run.sh` invocation (or an equivalent prompt) on a recurring basis. This is a cloud-side
alternative to the local launchd plist described above — pick one, not both, to avoid duplicate
posts.
