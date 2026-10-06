const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const version = createHash('sha256')
  .update(fs.readFileSync(path.join(root, 'region-content.js'), 'utf8').replace(/\r\n/g, '\n'))
  .digest('hex').slice(0, 12);
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const script = /src="region-content\.js(?:\?v=[a-f0-9]+)?"/;
if (!script.test(html)) throw new Error('Research content script tag not found');
const updated = html.replace(script, `src="region-content.js?v=${version}"`);
if (updated !== html) fs.writeFileSync(file, updated);
console.log(`Research content version: ${version}`);
