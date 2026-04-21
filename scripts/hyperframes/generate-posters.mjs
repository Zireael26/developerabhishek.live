#!/usr/bin/env node
/* =====================================================================
   scripts/hyperframes/generate-posters.mjs
   --------------------------------------------------------------------
   Pull a single representative frame from each rendered MP4 and write it
   as .webp next to the video. The poster is what <video poster="…"> shows
   before autoplay kicks in (and what reduced-motion users see when the
   JS layer decides not to mount the video).

   We grab frame at t=0.5s (past the build-in, before any reset/fade)
   so the poster reads as "motion in progress" rather than an empty grid.

   Usage:
     node scripts/hyperframes/generate-posters.mjs
     node scripts/hyperframes/generate-posters.mjs --only neev
   --------------------------------------------------------------------- */

import { spawnSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const VIDEO_DIR = resolve(REPO_ROOT, 'public', 'video', 'work');

const SLUGS = [
  'neev', 'vericite', 'bluehost-agents', 'curat-money',
  'neev-hero', 'vericite-hero', 'bluehost-agents-hero', 'curat-money-hero',
];

const args = process.argv.slice(2);
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const targets = only ? SLUGS.filter((s) => s === only) : SLUGS;

let ok = 0;
let failed = [];

// Homebrew's ffmpeg 8.x ships without libwebp, so we can't go mp4 → webp in
// one shot. Use ffmpeg to pull a PNG frame, then cwebp to transcode. Both
// already listed in scripts/hyperframes/README.md#Prerequisites.
for (const slug of targets) {
  const mp4 = resolve(VIDEO_DIR, `${slug}.mp4`);
  const png = resolve(VIDEO_DIR, `${slug}.__poster.png`);
  const webp = resolve(VIDEO_DIR, `${slug}.webp`);

  if (!existsSync(mp4)) {
    console.error(`  skip ${slug} — no mp4 at ${mp4}`);
    failed.push(slug);
    continue;
  }

  const extract = spawnSync(
    'ffmpeg',
    ['-y', '-ss', '0.5', '-i', mp4, '-frames:v', '1', '-update', '1', png],
    { stdio: 'inherit' },
  );

  if (extract.status !== 0) {
    console.error(`  ✗ ffmpeg frame extract failed for ${slug}`);
    failed.push(slug);
    continue;
  }

  const encode = spawnSync(
    'cwebp',
    ['-q', '75', '-quiet', png, '-o', webp],
    { stdio: 'inherit' },
  );

  try { unlinkSync(png); } catch {}

  if (encode.status !== 0) {
    console.error(`  ✗ cwebp encode failed for ${slug}`);
    failed.push(slug);
    continue;
  }

  console.log(`  ✓ ${webp}`);
  ok += 1;
}

console.log(`\n${ok}/${targets.length} posters written`);
if (failed.length) process.exit(1);
