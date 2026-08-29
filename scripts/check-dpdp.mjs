#!/usr/bin/env node
/**
 * Fails when a dependency that phones home is installed without being declared
 * as a data recipient in `src/lib/dpdp.ts`.
 *
 * The rule this enforces used to be a sentence in a markdown file — "add a
 * service to DATA_RECIPIENTS in the same commit" — enforced by nothing. Add
 * Sentry in six months and the privacy notice silently becomes a false
 * disclosure, because the notice renders that array. A promise that decays into
 * a lie is worse than no promise, so it gets a check instead.
 *
 * Deliberately a denylist of known offenders rather than an attempt to detect
 * network access generally: static analysis of "does this package make
 * requests" is a research project, and the realistic failure is somebody adding
 * a well-known analytics or error-tracking SDK without thinking about the
 * notice. Catching those is most of the value for none of the complexity.
 *
 * ponytail: denylist, not real network analysis — widen SERVICES when something
 * slips past, or reach for a bundle-level network audit if that ever stops
 * being enough.
 *
 *   node scripts/check-dpdp.mjs         # check
 *   node scripts/check-dpdp.mjs --test  # self-check
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** package-name substring → the recipient name that must appear in src/lib/dpdp.ts */
const SERVICES = [
  ['@vercel/analytics', 'Vercel'],
  ['@vercel/speed-insights', 'Vercel'],
  ['@vercel/blob', 'Vercel'],
  ['@sentry/', 'Sentry'],
  ['firebase', 'Firebase'],
  ['@segment/', 'Segment'],
  ['mixpanel', 'Mixpanel'],
  ['amplitude', 'Amplitude'],
  ['posthog', 'PostHog'],
  ['@hotjar/', 'Hotjar'],
  ['logrocket', 'LogRocket'],
  ['@fullstory/', 'FullStory'],
  ['react-ga', 'Google'],
  ['@next/third-parties', 'Google'],
  ['@datadog/', 'Datadog'],
  ['newrelic', 'New Relic'],
  ['@bugsnag/', 'Bugsnag'],
  ['resend', 'Resend'],
  // Mapped to the actual SMTP provider for this site, not a generic label:
  // the check compares against names in DATA_RECIPIENTS, so a placeholder
  // would fail forever and get muted, which is how checks die.
  ['nodemailer', 'Hostinger'],
  ['razorpay', 'Razorpay'],
  ['stripe', 'Stripe'],
  ['@supabase/', 'Supabase'],
  ['@neondatabase/', 'Neon'],
];

/** Undeclared services, given a dependency list and the recipients source. */
export function findUndeclared(deps, recipientsSource) {
  return SERVICES.flatMap(([pkg, recipient]) =>
    deps.some((d) => d.includes(pkg)) && !recipientsSource.includes(recipient)
      ? [{ pkg, recipient }]
      : [],
  );
}

function main() {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  // Read as text rather than importing: src/lib/dpdp.ts is ESM inside a CommonJS
  // package, so an import here would need the whole project converted. The
  // question is only "does this name appear", and text answers it.
  const source = readFileSync(join(root, 'src', 'lib', 'dpdp.ts'), 'utf8');

  const missing = findUndeclared(deps, source);
  if (missing.length === 0) {
    console.log(`✓ DPDP: every known data-collecting dependency is declared in src/lib/dpdp.ts`);
    return;
  }

  console.error('✗ DPDP: dependencies that receive personal data are not declared as recipients.\n');
  for (const { pkg: p, recipient } of missing) {
    console.error(`  ${p} is installed, but "${recipient}" is not in DATA_RECIPIENTS`);
  }
  console.error(
    '\nThe privacy notice renders DATA_RECIPIENTS, so shipping this makes the' +
      '\nnotice a false disclosure. Add the recipient — name, purpose, what it' +
      '\nactually receives, and its country — or remove the dependency.' +
      '\n\nBefore adding: check a DPA is available for it. Disclosure is not a remedy.',
  );
  process.exit(1);
}

function test() {
  // Catches an undeclared service.
  assert.deepEqual(
    findUndeclared(['@sentry/nextjs'], 'export const DATA_RECIPIENTS = [{ name: "Vercel" }]'),
    [{ pkg: '@sentry/', recipient: 'Sentry' }],
  );
  // Passes once declared.
  assert.deepEqual(findUndeclared(['@sentry/nextjs'], 'name: "Sentry"'), []);
  // Ignores packages that do not phone home.
  assert.deepEqual(findUndeclared(['gsap', 'lenis', 'next'], ''), []);
  // The real repo state must pass, or the check ships broken.
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.deepEqual(
    findUndeclared(
      Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }),
      readFileSync(join(root, 'src', 'lib', 'dpdp.ts'), 'utf8'),
    ),
    [],
  );
  console.log('✓ check-dpdp self-check passed');
}

// Only act when run directly — importing this module (the self-check does)
// must not execute the check as a side effect.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.argv.includes('--test') ? test() : main();
}
