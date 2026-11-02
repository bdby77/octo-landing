const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const publicDirectory = path.join(__dirname, 'public');
const required = ['index.html', 'catalog.html', 'terms.html', 'privacy.html',
  'catalog.json', 'icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'CNAME', '.nojekyll'];
for (const name of required) {
  const file = path.join(publicDirectory, name);
  assert(fs.statSync(file).isFile(), `${name} missing`);
  if (name !== '.nojekyll') assert(fs.statSync(file).size > 0, `${name} empty`);
}
assert.equal(fs.readFileSync(path.join(publicDirectory, 'CNAME'), 'utf8').trim(), 'octostore.space');
const catalog = JSON.parse(fs.readFileSync(path.join(publicDirectory, 'catalog.json'), 'utf8'));
assert(catalog.apps.length > 0 && new Set(catalog.apps.map(app => app.id)).size === catalog.apps.length);
for (const name of ['index.html', 'catalog.html']) {
  const html = fs.readFileSync(path.join(publicDirectory, name), 'utf8');
  assert(!/localStorage|code-input|CODE_RE|API_BASE/.test(html) || name === 'index.html');
  assert(!/iOS 15\+|Александр К\.|Марина С\.|Dmitry M\./.test(html));
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert(scripts.length > 0);
  for (const script of scripts) new vm.Script(script);
}
const catalogHtml = fs.readFileSync(path.join(publicDirectory, 'catalog.html'), 'utf8');
assert(catalogHtml.includes('const API_CATALOG = "/catalog.json"'));
assert(catalogHtml.includes('renderInstallBox();'));
assert(!catalogHtml.includes('API_BASE'));
console.log(`Static package OK: ${required.length} required files, ${catalog.apps.length} catalog entries`);
