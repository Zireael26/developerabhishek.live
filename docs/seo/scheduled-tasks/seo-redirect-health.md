# Scheduled task: `seo-redirect-health`

**Cadence:** Daily 07:00 local time
**Purpose:** Verify the canonical-host hygiene defined in Phase 0 of the SEO strategy stays green. Any drift (legacy host serving 200 instead of 301-to-canonical) is the highest-priority alert in the program.

> This file is the source-of-truth prompt. To change task behavior: edit this file, then call `mcp__scheduled-tasks__update_scheduled_task` with `taskId: "seo-redirect-health"` and the new `prompt` content.

---

## Prompt content (paste into `prompt` field)

You are the `seo-redirect-health` scheduled task for the akaushik.org SEO program. Run every day at 07:00 local time. You have no memory of prior runs — read the spec and status doc fresh.

**Repo location:** `/Users/abhishek/projects/personal/akaushik.org/` (canonical root). Use this directly; do not create a worktree for a read-only check.

**Authoritative docs (read first):**
- `docs/seo/2026-05-18-seo-strategy-design.md` — the static plan; section 2 (Phase 0) defines the redirect requirement.
- `docs/seo/STATUS.md` — the live status doc you will update.

**Checks to perform** (use `curl -sIL ... | head -8`):

1. `https://developerabhishek.live/` — expect HTTP/2 301 → `Location: https://akaushik.org/`
2. `https://developerabhishek.live/writing/fastembed-to-tei` — expect HTTP/2 301 → `Location: https://akaushik.org/writing/fastembed-to-tei` (path-preserving)
3. `https://akaushik.dev/` — expect HTTP/2 301 → `Location: https://akaushik.org/`
4. `https://akaushik.dev/work/neev` — expect HTTP/2 301 → `Location: https://akaushik.org/work/neev`
5. `https://akaushik.org/` — expect HTTP/2 200 (no chain)
6. `https://akaushik.org/writing/fastembed-to-tei` — expect HTTP/2 200

**Pass criteria:** All six checks pass exactly. Anything else is a failure.

**On all green:**
1. In `docs/seo/STATUS.md` §7 Automation health row for `seo-redirect-health`: update `Last run` to current ISO timestamp and `Status` to `green`. Do not add to Alerts section.
2. Commit on branch `seo-bot/redirect-health/<YYYY-MM-DD>` with message `chore(seo-bot): redirect-health green <YYYY-MM-DD>`.
3. Open PR via `gh pr create --title "seo-bot: redirect-health green <YYYY-MM-DD>" --body "All 6 redirect checks pass." --label seo:automation`.

**On any failure:**
1. Append to `docs/seo/STATUS.md` §4 Alerts a new entry:
   ```
   ### <YYYY-MM-DD HH:MM> redirect-health FAILED
   - Check N (<URL>): expected <expected>, got <actual>
   - Full curl transcript:
     ```
     <paste curl -sIL output>
     ```
   - Action: <one-line suggested fix; e.g., "Verify Vercel domain config for developerabhishek.live → redirect to primary">
   ```
2. Update §7 Automation health: `Status: red`, `Notes: see Alerts §4 <date>`.
3. Commit on branch `seo-bot/redirect-health/<YYYY-MM-DD>-FAIL` with message `chore(seo-bot): redirect-health FAILED <YYYY-MM-DD>`.
4. Open PR via `gh pr create --title "seo-bot ALERT: redirect-health FAILED <YYYY-MM-DD>" --body "<short summary + link to STATUS.md alert>" --label "seo:automation,seo:alert"`.

**Constraints:**
- Never push to `main`. The Trellis pre-push hook blocks it; do not try to bypass.
- Never commit changes to anything outside `docs/seo/STATUS.md`.
- If `gh` is not available or auth fails, write a log file at `docs/seo/scheduled-tasks/_last-failure.log` with the failure transcript and abort.
- Keep the run under 60 seconds — six `curl -sIL` calls is fast; do not add additional checks here.
