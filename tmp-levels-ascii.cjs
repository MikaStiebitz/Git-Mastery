const fs = require("fs");
const fa = fs.readFileSync("src/translations/fa/levels.ts", "utf8");
const matches = [...fa.matchAll(/"([^"]+)":\s*"([\s\S]*?)"/g)];
for (const [, key, value] of matches) {
  if (/[A-Za-z]/.test(value)) {
    console.log(key + " -> " + value.replace(/\n/g, "\\n"));
  }
}
