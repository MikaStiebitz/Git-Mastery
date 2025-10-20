const fs = require("fs");
function extractMap(file) {
  const content = fs.readFileSync(file, "utf8");
  const matches = [...content.matchAll(/"([^"]+)":\s*"([\s\S]*?)"/g)];
  const map = new Map();
  for (const [, key, value] of matches) {
    map.set(key, value);
  }
  return map;
}
const enFile = "src/translations/en/levels.ts";
const faFile = "src/translations/fa/levels.ts";
const enMap = extractMap(enFile);
const faMap = extractMap(faFile);
const missing = [];
for (const key of enMap.keys()) {
  if (!faMap.has(key)) missing.push(key);
}
const extra = [];
for (const key of faMap.keys()) {
  if (!enMap.has(key)) extra.push(key);
}
console.log('Missing count:', missing.length);
console.log('Extra count:', extra.length);
if (missing.length) {
  console.log('\nMissing keys:');
  for (const key of missing) console.log(key);
}
if (extra.length) {
  console.log('\nExtra keys:');
  for (const key of extra) console.log(key);
}
