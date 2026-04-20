#!/usr/bin/env node
/**
 * Process-gate — enforces tgsc-style doc hygiene on staged changes.
 *
 * Policy (see docs/adr/0002-process-gate-policy.md):
 *   1. Code changes under app/**, components/**, lib/**, scripts/**, or
 *      content/** must stage a CHANGELOG.md edit.
 *   2. Structural changes to next.config.*, middleware.ts/proxy.ts,
 *      package.json, tsconfig.json, or eslint.config.* must stage either
 *      a new/modified docs/adr/*.md OR a CHANGELOG.md entry that
 *      references an existing ADR number.
 *   3. Changes under docs/epm/** must stage a ROADMAP.md edit (EPMs drive
 *      the roadmap).
 *
 * Exit codes: 0 ok, 1 violation, 2 invocation error.
 * Bypass: `SKIP_PROCESS_GATE=1` (logged; use only for emergency hotfix).
 */

import { execFileSync } from 'node:child_process';

if (process.env.SKIP_PROCESS_GATE === '1') {
  console.warn('process-gate: BYPASSED via SKIP_PROCESS_GATE=1');
  process.exit(0);
}

let staged;
try {
  staged = execFileSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMRD'],
    { encoding: 'utf8' },
  )
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
} catch (err) {
  console.error('process-gate: failed to read staged diff:', err.message);
  process.exit(2);
}

if (staged.length === 0) {
  console.log('process-gate: no staged changes.');
  process.exit(0);
}

const has = (re) => staged.some((f) => re.test(f));

const CODE_PATHS = /^(app|components|lib|scripts|content)\//;
const STRUCTURAL =
  /^(next\.config\.|middleware\.|proxy\.|package\.json$|tsconfig\.json$|eslint\.config\.)/;
const EPM_PATHS = /^docs\/epm\//;
const CHANGELOG = /^docs\/CHANGELOG\.md$/;
const ROADMAP = /^docs\/ROADMAP\.md$/;
const ADR_NEW = /^docs\/adr\/\d{4}-[a-z0-9-]+\.md$/;

const violations = [];

if (has(CODE_PATHS) && !has(CHANGELOG)) {
  violations.push(
    'R1: code changes under app/components/lib/scripts/content require a CHANGELOG.md entry.',
  );
}

if (has(STRUCTURAL) && !(has(ADR_NEW) || has(CHANGELOG))) {
  violations.push(
    'R2: structural changes (next.config / middleware / package.json / tsconfig / eslint) require an ADR or a CHANGELOG entry referencing one.',
  );
}

if (has(EPM_PATHS) && !has(ROADMAP)) {
  violations.push('R3: changes under docs/epm/ require a ROADMAP.md update.');
}

if (violations.length) {
  console.error('\nprocess-gate: ' + violations.length + ' violation(s):\n');
  for (const v of violations) console.error('  ✗ ' + v);
  console.error(
    '\nFix: stage the missing doc, or set SKIP_PROCESS_GATE=1 (emergency only).\n',
  );
  process.exit(1);
}

console.log(`process-gate: ${staged.length} staged file(s) — OK.`);
process.exit(0);
