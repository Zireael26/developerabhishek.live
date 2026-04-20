#!/usr/bin/env node
// Recomputes the sha256 digest of every SKILL.md referenced in
// `public/.well-known/agent-skills/index.json` and writes the updated index
// back to disk. Runs as a `prebuild` hook so CI and production always serve
// a digest that matches the shipped SKILL.md byte-for-byte.
//
// Kept intentionally small — node:crypto + node:fs only, no third-party deps.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PUBLIC_ROOT = join(REPO_ROOT, 'public');
const INDEX_PATH = join(PUBLIC_ROOT, '.well-known/agent-skills/index.json');

type Skill = {
  $schema?: string;
  name?: string;
  description?: string;
  type?: string;
  url: string;
  digest: string;
};

type Index = {
  $schema: string;
  type: string;
  skills: Skill[];
};

function urlToLocalPath(url: string): string {
  // Expect `https://<host>/<...>`. We only resolve paths on this origin,
  // so the host is irrelevant — use the pathname alone.
  const u = new URL(url);
  return join(PUBLIC_ROOT, u.pathname);
}

function sha256(bytes: Buffer): string {
  return 'sha256:' + createHash('sha256').update(bytes).digest('hex');
}

function main(): void {
  const raw = readFileSync(INDEX_PATH, 'utf8');
  const index = JSON.parse(raw) as Index;

  let changes = 0;
  for (const skill of index.skills) {
    const local = urlToLocalPath(skill.url);
    const body = readFileSync(local);
    const digest = sha256(body);
    if (skill.digest !== digest) {
      skill.digest = digest;
      changes += 1;
    }
  }

  if (changes === 0) {
    console.log('agent-skills: digests up-to-date.');
    return;
  }

  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
  console.log(`agent-skills: updated ${changes} digest(s).`);
}

main();
