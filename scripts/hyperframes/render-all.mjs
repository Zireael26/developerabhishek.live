#!/usr/bin/env node
/* =====================================================================
   scripts/hyperframes/render-all.mjs
   --------------------------------------------------------------------
   Orchestrator for all HyperFrames compositions. Walks `SLUGS`, renders
   each composition via `npx hyperframes render`, then post-processes the
   MP4 with ffmpeg to add +faststart (move the moov atom to the head of
   the file, required so <video autoplay> can start before download ends).

   Usage:
     node scripts/hyperframes/render-all.mjs              # render all
     node scripts/hyperframes/render-all.mjs --only neev  # one composition
     node scripts/hyperframes/render-all.mjs --skip-ffmpeg

   Notes
   -----
   - CI does NOT run this script. The MP4s are committed artifacts; this
     is an author-time script.
   - Requires Node ≥22, a working ffmpeg on PATH, and the HyperFrames CLI
     reachable via `npx hyperframes`. First render will auto-bootstrap
     headless Chrome via `npx hyperframes browser ensure`.
   --------------------------------------------------------------------- */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

// Order keeps light card reels first, heavier hero/editorial loops later.
const TARGETS = [
  // work cards (600×400, 5s, 150 frames)
  { slug: 'neev', outDir: 'work', asset: 'neev' },
  { slug: 'vericite', outDir: 'work', asset: 'vericite' },
  { slug: 'bluehost-agents', outDir: 'work', asset: 'bluehost-agents' },
  { slug: 'curat-money', outDir: 'work', asset: 'curat-money' },
  // work hero bands (1600×900, 10s, 300 frames)
  { slug: 'neev-hero', outDir: 'work', asset: 'neev-hero' },
  { slug: 'vericite-hero', outDir: 'work', asset: 'vericite-hero' },
  { slug: 'bluehost-agents-hero', outDir: 'work', asset: 'bluehost-agents-hero' },
  { slug: 'curat-money-hero', outDir: 'work', asset: 'curat-money-hero' },
  // writing article loops (1200×676, 8s, 240 frames)
  { slug: 'writing-micrograd-makemore', outDir: 'writing', asset: 'micrograd-makemore' },
  { slug: 'writing-fastembed-tei', outDir: 'writing', asset: 'fastembed-to-tei' },
  { slug: 'writing-building-this-portfolio', outDir: 'writing', asset: 'building-this-portfolio' },
  { slug: 'writing-ai-for-msme', outDir: 'writing', asset: 'ai-for-msme' },
  // inline work explainer (1200×676, 8s, 240 frames)
  { slug: 'work-neev-inline', outDir: 'work/inline', asset: 'neev' },
];

const args = process.argv.slice(2);
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const skipFfmpeg = args.includes('--skip-ffmpeg');

const targets = only ? TARGETS.filter((target) => target.slug === only) : TARGETS;

if (!targets.length) {
  const known = TARGETS.map(
    (target) => `${target.slug} -> public/video/${target.outDir}/${target.asset}.mp4`,
  );
  console.error(`No matching slug — got --only ${only}. Known:\n  ${known.join('\n  ')}`);
  process.exit(1);
}

// Silence telemetry + update checks so CI-ish runs don't hit the network
process.env.HYPERFRAMES_NO_UPDATE_CHECK = '1';
process.env.HYPERFRAMES_NO_TELEMETRY = '1';

let ok = 0;
let failed = [];

for (const target of targets) {
  const { slug } = target;
  const projectDir = resolve(__dirname, slug);
  const outDir = resolve(REPO_ROOT, 'public', 'video', target.outDir);
  const rawOut = resolve(outDir, `${target.asset}.raw.mp4`);
  const finalOut = resolve(outDir, `${target.asset}.mp4`);

  console.log(`\n▶ ${slug}`);
  console.log(`  project: ${projectDir}`);
  console.log(`  output:  ${finalOut}`);

  if (!existsSync(projectDir)) {
    console.error(`  ✗ missing composition dir`);
    failed.push(slug);
    continue;
  }
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // 1) Render via HyperFrames CLI. Composition id defaults to "root".
  const render = spawnSync(
    'npx',
    ['--yes', 'hyperframes', 'render', '--output', rawOut, '--fps', '30', '--quality', 'standard'],
    { cwd: projectDir, stdio: 'inherit' },
  );

  if (render.status !== 0) {
    console.error(`  ✗ render failed for ${slug}`);
    failed.push(slug);
    continue;
  }

  // 2) Post-process for streaming. -movflags +faststart lets <video>
  //    start painting before the whole file arrives. Re-encode to H.264
  //    baseline + yuv420p for the widest client compat.
  if (skipFfmpeg) {
    renameSync(rawOut, finalOut);
  } else {
    const ff = spawnSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        rawOut,
        '-c:v',
        'libx264',
        '-profile:v',
        'high',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        '-an', // silent — no audio track
        '-crf',
        '23',
        '-preset',
        'slow',
        finalOut,
      ],
      { stdio: 'inherit' },
    );

    if (ff.status !== 0) {
      console.error(`  ✗ ffmpeg post-process failed for ${slug}`);
      failed.push(slug);
      continue;
    }
    try {
      unlinkSync(rawOut);
    } catch {}
  }

  console.log(`  ✓ ${finalOut}`);
  ok += 1;
}

console.log(`\n${ok}/${targets.length} rendered`);
if (failed.length) {
  console.error(`failed: ${failed.join(', ')}`);
  process.exit(1);
}
