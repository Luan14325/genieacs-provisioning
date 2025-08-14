import fs from 'node:fs';
import path from 'node:path';
const required = [
  'provisions',
  'presets',
  'virtual-parameters',
  '.github/workflows/ci.yml',
  'docker-compose.yml'
];
const missing = required.filter(p => !fs.existsSync(path.join(process.cwd(), p)));
if (missing.length) { console.error('Missing:', missing); process.exit(1); }
console.log('Structure looks good ✔');

