# Claude Code Handoff — akaushik.org (v2)

> **Paste everything below this line as the first message in a fresh Claude Code session.** Run from the repository root: `~/projects/personal/developerabhishek.live/` on disk today (the directory rename to `akaushik.org` happens after this handoff completes — see §15). Either path works while you're inside it.
>
> Authoring assumption: you (Claude Code) have full filesystem access, network access, and the ability to run `pnpm`, `git`, and `node`. The Next.js scaffold is already in place. Your job is the **pixel-parity recreation**, the content fill, and the engineering rigor that gets it from "scaffold renders" to "ready to ship."

---

## 0 · Role + mission

You are the build engineer for Abhishek Kaushik's personal portfolio. The canonical host is `akaushik.org` (with `akaushik.dev` redirecting to it; see `docs/adr/0003-domain-and-canonical-url.md` for the decision rationale). The site is a sales artifact — the goal is that visitors see it and ask if they can get something like it built for their company. The bar is craftsmanship-grade.

You are stepping in **after** a strategy + scaffolding pass. The synthesis docs are authoritative; do not relitigate decisions documented in PRD.md, DESIGN_DIRECTION.md, AGENT_READINESS.md, CASE_STUDIES_OUTLINE.md, or BIO_DRAFT.md. Your job is to make the design land — faithfully and with depth.

The reference design (HTML/CSS/JS prototype produced via Claude Design) is the single source of visual truth. Where the reference and a doc conflict, **the reference wins for visuals; the doc wins for content + behavior contracts**.

---

## 1 · Inputs (read before writing any code)

Mandatory reads, in this order:

| # | Path | What it gives you |
| - | --- | --- |
| 1 | `HANDOFF.md` (this file) | Your contract |
| 2 | `docs/PRD.md` | What "done" means; non-goals |
| 3 | `docs/DESIGN_DIRECTION.md` | North-star aesthetic; restraint principles |
| 4 | `docs/AGENT_READINESS.md` | Cloudflare isitagentready.com compliance contract |
| 5 | `docs/CASE_STUDIES_OUTLINE.md` | Five-beat structure for each of the 4 case studies |
| 6 | `docs/BIO_DRAFT.md` | Tagline + About copy; pick one variant after reading |
| 7 | `docs/ROADMAP.md` | Phased plan |
| 8 | `docs/adr/0001-nextjs-over-sveltekit.md` | Why this stack |

The synthesis docs are already in `docs/` — `PRD.md`, `DESIGN_DIRECTION.md`, `AGENT_READINESS.md`, `CASE_STUDIES_OUTLINE.md`, `BIO_DRAFT.md`. Treat them as the single source of intent. If a doc is missing or feels stale, ask Abhishek before filling in from guesswork.

The reference design lives **inside the repo** at `_reference/portfolio/`:

```
_reference/portfolio/
  ├─ index.html       # 8 sections, all markup + inline copy
  ├─ styles.css       # design tokens + every component rule
  ├─ companion.js     # Three.js paper crane "The Wanderer"
  ├─ tweaks.js        # Claude Design iframe edit-mode protocol
  └─ data/stats.json  # GitHub stats placeholder

_reference/scripts/fetch-github-stats.mjs
_reference/.github/workflows/stats.yml
```

Do not modify files under `_reference/` — it is a frozen snapshot of the Claude Design output and serves as your visual diff base. When something in the live build drifts from the reference, the reference wins.

Read all four files cover-to-cover before touching code. Treat the reference as a senior designer's spec — every choice is intentional.

---

## 2 · Step 0 — finish the cleanup (must run locally)

The Cowork mount blocks file deletion, so the SvelteKit source is still on disk. Clean it up:

```bash
# from the repo root
git status                 # confirm there are uncommitted scaffold writes
git tag                    # confirm legacy-v1-final exists

# remove SvelteKit source (files remaining from the v1 build)
git rm -rf src static .svelte-kit .vercel \
          svelte.config.js vite.config.ts pnpm-lock.yaml node_modules

# the legacy docs/prd.md was already overwritten with the synthesis PRD during
# the consolidation pass. Rename it to the canonical PascalCase used by everything else:
git mv docs/prd.md docs/PRD.md

# remove the lock manually if rm refused under the mount
rm -f .git/index.lock      # only if a stale lock exists

git add -A                 # picks up the scaffold writes
git commit -m "chore: archive SvelteKit, scaffold Next.js 16.2

Legacy SvelteKit build pinned at tag legacy-v1-final.
Next.js 16.2 + Tailwind 4.2 + shadcn/ui v4 scaffold replaces it."

pnpm install
pnpm dev                   # http://localhost:3000 — verify parchment renders
```

Do **not** force-push or delete the `legacy-v1-final` tag. It is your safety net.

---

## 3 · Stack pin (do not drift)

| Layer | Version | Notes |
| --- | --- | --- |
| Node | 22 LTS | `.nvmrc` |
| pnpm | 10.x | `packageManager` field in `package.json` |
| Next.js | 16.2.0 | App Router, `--turbo` for dev |
| React | 19.2.0 | Server Components, Actions |
| TypeScript | 6.0.0 | `strict`, `noUncheckedIndexedAccess` |
| Tailwind CSS | 4.2.0 | CSS-first; tokens in `@theme` block in `app/globals.css`; **no `tailwind.config.ts`** |
| shadcn/ui | v4 | Re-skin every component to the forest-on-parchment tokens before use |
| 3D | three @ ^0.169 + `@react-three/fiber` + drei | The Wanderer companion |
| Motion | framer-motion + gsap | Use framer-motion for component motion; gsap for scroll timelines |
| Content | MDX via `mdx-rs` (next.config.ts) | Case studies + writing |
| Host | Vercel | Edge middleware for Link headers |

If a dependency you need isn't pinned, write an ADR explaining why and add it. No silent additions.

---

## 4 · Visual recreation — the eight sections

Work through these in order. Ship each as a vertical slice (component + content + smoke test) before starting the next. No section is "done" until it matches the reference at three viewports: 1440px, 768px, 375px.

### 01 · Hero (`#hero`)
- Three tagline candidates wired to `data-tagline-a/b/c` (tweaks.js can swap them live)
- `hero-facts` definition list — `data-stat="total"` is injected from `public/data/stats.json` total contributions
- `hero-scene`: HTML canvas (agent graph — animated nodes + packets) with inline SVG fallback for `prefers-reduced-motion` and `[data-motion="off"]`
- Sticky marquee at the bottom — names of stack/tools, slow scroll
- Newsreader 88px headline, clamp down to 44px; line-height 1.02; letter-spacing -0.02em

### 02 · About (`#about`)
- Long-form variant from `docs/BIO_DRAFT.md` (~140 words) on desktop; short variant on mobile
- One pull-quote in Newsreader italic, accent color
- Tiny meta line in JetBrains Mono (location · timezone · accepting-work status)

### 03 · Work (`#work`)
- Four case study cards with placeholder reels (port the SVG `<rect>`-based animations from the reference verbatim, then upgrade to MP4/WebM if Abhishek provides clips)
- Each card: number, title (Newsreader), one-line stack, two-line outcome, "read case study →" link
- Order: Neev → Bluehost Agents → VeriCite → curat.money

### 04 · Writing (`#writing`)
- Empty-state-first design: if zero MDX posts in `content/writing/`, show "Drafting in the open." with three category headers and a date for the next post
- Once posts exist, list them with date + reading time + one-line summary

### 05 · Services (`#services`)
- Three service cards (the three variants in the reference)
- Each ends with a one-line "what you get" deliverable
- No prices on the public site; "request a conversation" CTA

### 06 · Process (`#process`)
- Numbered five-step process matching the reference
- Each step: short title (Newsreader), 2-sentence description (sans), tiny mono caption with the artifact produced (e.g. "→ ADR + ROADMAP entry")

### 07 · In the open (`#open`)
- Stats tile fed from `public/data/stats.json` — total, weeks heatmap (52-cell SVG), three repos with last-commit timestamps
- "Last refreshed" caption from `generatedAt`

### 08 · Contact (`#contact`)
- Big Newsreader headline ("Let's build the right thing.")
- Email button (`btn-primary`), LinkedIn / GitHub / X ghost buttons
- Footer line: built notes (Next.js 16, Tailwind 4, react-three-fiber), commit hash from `process.env.VERCEL_GIT_COMMIT_SHA`, license line

Each section in the reference has `data-companion-pose` and `data-screen-label` attributes — preserve these. The Wanderer's pose tracking depends on them.

---

## 5 · The Wanderer (Three.js companion)

Port `companion.js` to a React-three-fiber component (`components/scene/Wanderer.tsx`):

- Eight named POSES keyed off the section ids: `hero`, `about`, `work`, `writing`, `services`, `process`, `open`, `contact`
- IntersectionObserver (or react-intersection-observer) tracks the active section and lerps the crane to its pose
- Pointer parallax on the body when motion is on
- Accent color synced via a MutationObserver on `<html data-accent>` (or via React context wired to a tweaks.js dispatch)
- Reduced-motion fallback: drop the WebGL canvas, render the inline SVG paper-crane silhouette in static `hero` pose
- WebGL availability fallback: same SVG fallback path

Render it inside a `<Suspense>` boundary so it never blocks first paint. The hero canvas in section 01 is **separate** from The Wanderer — don't conflate them.

---

## 6 · Live edit mode (tweaks.js iframe protocol)

Port `tweaks.js` to a client component (`components/dev/TweakBridge.tsx`) loaded only in development and on Claude Design preview iframes (sniff `window.parent !== window` + a query string flag). Surface these tweak keys exactly:

- `tagline` (`a` | `b` | `c`)
- `accent` (`forest` | `terracotta` | `ochre` | `ink`)
- `mode` (`light` | `dark`)
- `density` (`airy` | `tight`)
- `motion` (`on` | `off`)

The contract:

1. On mount, post `{ type: '__edit_mode_available', keys: [...] }` to `window.parent`
2. Listen for `{ type: '__edit_mode_set_keys', keys: { ... } }` and update the corresponding `data-*` attributes on `<html>`
3. Persist to `localStorage` (key: `dl-tweaks-v1`) so a refresh inside the iframe survives
4. Backtick (`` ` ``) keystroke toggles the dev panel locally

This must round-trip with Claude Design without code changes.

---

## 7 · Stats tile + GitHub Action

The scripts and workflow are already in place:

- `scripts/fetch-github-stats.mjs` — writes to `public/data/stats.json`
- `.github/workflows/stats.yml` — Mondays 04:17 UTC + manual dispatch

Wire the tile to read `public/data/stats.json` at build time (top-level `import` in a server component). Surface:

- Total contributions (Newsreader, big number)
- 52-week heatmap (SVG, accent ramp, no library)
- Three repo cards (label + last commit relative time + link)
- "Refreshed `<time>` ago" caption from `generatedAt`

Tell Abhishek to set the `GH_STATS_TOKEN` repo secret (PAT with `read:user` + `repo`).

---

## 8 · Agent-readiness — release-blocking

`docs/AGENT_READINESS.md` is the contract. The scaffold provides:

- `middleware.ts` — RFC 8288 Link headers
- `public/robots.txt` — Content Signals (`search=yes, ai-input=yes, ai-train=no`)
- `public/llms.txt` — short index
- `public/.well-known/agent-skills/index.json` — schema v0.2.0
- `public/.well-known/mcp.json` — placeholder

You need to:

1. Add `public/llms-full.txt` (full content dump for retrieval)
2. Add `public/sitemap.xml` (Next.js can generate via `app/sitemap.ts`)
3. Implement at least one real Agent Skill at `public/.well-known/agent-skills/hire-me/SKILL.md` with a real `digest` (sha256 of the file)
4. Implement the MCP server at `app/api/mcp/route.ts` exposing minimum two tools: `lookup_case_study` and `get_availability`
5. Add `public/.well-known/api-catalog` per RFC 9727
6. Verify the deployed URL passes `https://isitagentready.com/?url=https://akaushik.org` — this is the ship gate

Run a verification pass after every PR that touches `app/`, `middleware.ts`, or `public/`.

---

## 9 · Engineering process — match `tgsc`

Every non-trivial change ships with:

1. **ADR** in `docs/adr/NNNN-short-name.md` if it's an architectural decision (new dep, structural change, performance trade-off)
2. **EPM** in `docs/epm/EPIC-NN-short-name.md` for anything spanning more than one sub-system
3. **ROADMAP.md** entry updated
4. **CHANGELOG.md** entry under `## [Unreleased]`
5. **Process-gate** passing: `pnpm process:check`
6. **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `test:`)

The scaffold ships with a stub at `scripts/process-gate.mjs`. Flesh it out during your first ADR pass — the policy should mirror `tgsc` exactly. Wire it into pre-commit (use `simple-git-hooks` or `husky`, write an ADR for whichever you pick).

PRs are squash-merged. Each PR's title is a Conventional Commit that ends up in the `git log`.

---

## 10 · Quality bar (must pass before each merge)

- `pnpm typecheck` — clean
- `pnpm lint` — clean
- `pnpm build` — clean, < 60s
- Lighthouse mobile + desktop — Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100
- Axe-core — zero violations
- Tabbing through the page reaches every interactive element with a visible focus ring
- `prefers-reduced-motion: reduce` actually disables motion (no exceptions)
- `[data-motion="off"]` does the same via the tweaks panel
- All four sections of `isitagentready.com` are green for the deployed URL

CI must enforce all of the above. Add a `.github/workflows/ci.yml` in your first phase.

---

## 11 · Voice + content notes (read `docs/BIO_DRAFT.md` for the full version)

- Default to plain language; technical depth lives inside case studies, not on the marquee
- Never use the words "thrilled," "excited," or "passionate"
- Avoid emoji on the public surface (the reference uses none — keep it that way)
- Never write "synergy," "leverage" (as a verb), "thought leader," "Web3," or "blockchain-powered"
- The dual-voice pattern: section headers and one-liners are warm + plain. Case study bodies allow technical depth and small bits of dry humor

When the copy in the reference reads "TODO," "Lorem," or anything obviously placeholder, pull the real copy from `docs/BIO_DRAFT.md` (About) or `docs/CASE_STUDIES_OUTLINE.md` (cases). Do not invent biographical or factual detail — ask Abhishek if you can't find the answer in a doc.

---

## 12 · Out of scope (do not build)

- Blog comments
- Newsletter signup (Phase 5 at earliest)
- Dark-mode-only Easter eggs
- Service detail pages (services live on the homepage; deep links go to a `mailto:`)
- A CMS — content is MDX in the repo
- An admin panel
- i18n (English only at launch; Hindi is a Phase 6+ consideration tied to the MSME audience thesis)

---

## 13 · How to ask for help

When you hit something genuinely ambiguous (a content gap, a behavior the reference doesn't specify, a trade-off worth Abhishek's eye), pause and ask. Don't guess about:

- Which case study claims you're allowed to make about Bluehost (NDA-sensitive — see `docs/CASE_STUDIES_OUTLINE.md` §3)
- What the public-facing rate-card / availability statement should say
- Which writing topics belong in the launch set
- Whether a given visual liberty improves on or drifts from the reference

Cite the section of this handoff or the relevant doc when you ask, so Abhishek can decide quickly.

---

## 14 · First-day checklist

Before writing application code, do this:

- [ ] Read all five synthesis docs in `docs/` end-to-end (PRD, DESIGN_DIRECTION, AGENT_READINESS, CASE_STUDIES_OUTLINE, BIO_DRAFT)
- [ ] Read `_reference/portfolio/index.html`, `styles.css`, `companion.js`, `tweaks.js` end-to-end
- [ ] Run the cleanup commands in §2 and verify `pnpm dev` boots clean
- [ ] Open `docs/PRD.md` and `docs/DESIGN_DIRECTION.md`, write a one-page response in `docs/epm/EPIC-01-pixel-parity.md` describing how you'll execute Phase 1
- [ ] Open a PR called `chore: ground the build` containing the cleanup commit, the EPM, and any ADRs that fall out of reading the reference
- [ ] Land it. Then start Phase 1.

The first PR is the one that proves the process works. Get it right.

---

## 15 · Post-handoff cutover (Abhishek will run this himself)

The following steps are explicitly **not** yours to run — they live here so the full cutover is documented in one place and so none of your work assumes a rename that hasn't happened yet.

**A. Directory + repo rename**

```bash
# Local
cd ~/projects/personal/
git -C developerabhishek.live remote set-url origin git@github.com:Zireael26/akaushik.org.git
mv developerabhishek.live akaushik.org

# GitHub
gh repo rename akaushik.org --repo Zireael26/developerabhishek.live
```

The repo-relative import paths (`@/components/...`) are unaffected. No source changes required.

**B. Flip the repo to public**

Do this only after:

1. Every `developerabhishek.live` reference in the repo has been scrubbed (see the ADR-0003 CHANGELOG entry — this handoff's work confirms that)
2. No secrets are committed (`GH_STATS_TOKEN` is env-only; double-check `.env*` is gitignored)
3. `_reference/` licensing is intentional (contains the Claude Design prototype; fine to be public as visual reference)

```bash
gh repo edit Zireael26/akaushik.org --visibility public --accept-visibility-change-consequences
```

**C. Vercel + Cloudflare wiring**

1. Vercel → Project → Settings → Domains: add `akaushik.org` (mark as production primary), add `akaushik.dev` (mark as permanent 308 redirect to `akaushik.org`).
2. Cloudflare DNS for both zones: `CNAME @ cname.vercel-dns.com` with proxy ON (orange cloud). SSL mode: Full (strict).
3. Cloudflare Email Routing for `akaushik.org`: route `hello@akaushik.org` → `abhishek.nexus26@gmail.com`. The contact section's mailto: links to this address; the mailbox must exist before any public sharing.
4. Verify `https://isitagentready.com/?url=https://akaushik.org` passes all four dimensions.

**D. Legacy domain sunset**

On the existing `developerabhishek.live` Vercel project, deploy a minimal `vercel.json`:

```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://akaushik.org/$1", "permanent": true }
  ]
}
```

Leave the redirect live until the registration lapses naturally. Do not renew.

**E. Social bio sync** (single coordinated pass before public announcement)

- LinkedIn → About → Contact Info → Websites: `https://akaushik.org`
- GitHub → `Zireael26` profile → "Website": `https://akaushik.org`
- X → `@abhi2601k` → Bio link: `https://akaushik.org`

---

*End of handoff. Build something Abhishek's clients will ask him to build for them.*
