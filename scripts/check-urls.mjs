/**
 * URL整合性チェック（公開前の最終関門）
 *
 * 現行サイトのURL一覧（scripts/legacy-urls.txt）と、
 * ビルド結果（dist/）に実在するURLを突き合わせる。
 *
 * 1本でも欠けていたら異常終了する。
 * = 既存ページを取りこぼしたまま公開することができない。
 *
 * 使い方:
 *   npm run build && node scripts/check-urls.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = path.join(root, 'dist');
const legacyFile = path.join(root, 'scripts', 'legacy-urls.txt');

if (!existsSync(distDir)) {
  console.error('dist/ がありません。先に `npm run build` を実行してください。');
  process.exit(1);
}

/** dist/ 配下の .html から、配信されるパスを復元する。 */
async function collectBuiltPaths(dir, base = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await collectBuiltPaths(full, `${base}/${entry.name}`)));
    } else if (entry.name.endsWith('.html')) {
      const name = entry.name.replace(/\.html$/, '');
      paths.push(name === 'index' ? base || '/' : `${base}/${name}`);
    }
  }
  return paths;
}

/** リダイレクトで受けているパスも「存在する」とみなす。 */
function collectRedirectSources() {
  const redirectsFile = path.join(root, 'public', '_redirects');
  if (!existsSync(redirectsFile)) return [];
  return readFileSync(redirectsFile, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/)[0])
    .filter(Boolean);
}

const built = new Set(await collectBuiltPaths(distDir));
for (const source of collectRedirectSources()) built.add(source);

if (!existsSync(legacyFile)) {
  console.error(
    `scripts/legacy-urls.txt がありません。\n` +
      `現行サイトのURL一覧（1行1URL）を作成してから実行してください。`,
  );
  process.exit(1);
}

const legacy = readFileSync(legacyFile, 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const pathname = line.startsWith('http') ? new URL(line).pathname : line;
    // 末尾スラッシュを落として比較する（トップページを除く）
    return pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  });

const missing = legacy.filter((url) => !built.has(url));
const added = [...built].filter((url) => !legacy.includes(url));

console.log(`現行URL: ${legacy.length}件 / ビルド結果: ${built.size}件\n`);

if (added.length > 0) {
  console.log('新規追加されたURL（既存SEOへの影響なし）:');
  for (const url of added.sort()) console.log(`  + ${url}`);
  console.log('');
}

if (missing.length > 0) {
  console.error('❌ 現行サイトにあるが新サイトに存在しないURL:');
  for (const url of missing.sort()) console.error(`  - ${url}`);
  console.error(
    '\nこのまま公開すると、これらのページは404になり検索評価を失います。\n' +
      'ページを作成するか、public/_redirects に301リダイレクトを追加してください。',
  );
  process.exit(1);
}

console.log('✅ 現行サイトの全URLが新サイトでも配信されます。');
