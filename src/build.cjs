/*
 * Inline builder: combines src/index.html + src/styles.css + src/vendor/*.js + src/app.js
 * into a single self-contained ../index.html (deliverable).
 *
 * Regenerate styles.css first when you change classes/tokens:
 *   npx @tailwindcss/cli -i src/input.css -o src/styles.css --minify
 * Then inline:
 *   node src/build.cjs
 *
 * NOTE: replacements use a function form on purpose — the minified GSAP
 * contains "$" sequences that String.replace would otherwise treat as
 * special replacement patterns ($&, $', etc.).
 */
const fs = require("fs");
const path = require("path");
const dir = __dirname;
let html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const css = fs.readFileSync(path.join(dir, "styles.css"), "utf8");
const gsap = fs.readFileSync(path.join(dir, "vendor/gsap.min.js"), "utf8");
const st = fs.readFileSync(path.join(dir, "vendor/ScrollTrigger.min.js"), "utf8");
const app = fs.readFileSync(path.join(dir, "app.js"), "utf8");

const R = (h, find, rep) => {
  if (!h.includes(find)) { console.error("MISS:", find); process.exit(1); }
  return h.replace(find, () => rep);
};
html = R(html, '<link rel="stylesheet" href="./styles.css">', "<style>\n" + css + "\n</style>");
html = R(html, '<script src="./vendor/gsap.min.js"></script>', "<script>" + gsap + "\n</script>");
html = R(html, '<script src="./vendor/ScrollTrigger.min.js"></script>', "<script>" + st + "\n</script>");
html = R(html, '<script src="./app.js"></script>', "<script>\n" + app + "\n</script>");
if (/(href|src)="\.\//.test(html)) { console.error("ERROR: unreplaced refs remain"); process.exit(1); }

const out = path.join(dir, "..", "index.html");
fs.writeFileSync(out, html);
console.log("WROTE", out, (html.length / 1024).toFixed(0) + "KB");
