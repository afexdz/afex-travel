// Aperçus du portfolio : capture chaque démo (ordinateur + téléphone) et compose
// trois visuels par site dans assets/covers/<site>-<n>-{1280,640}.webp.
// Lancé pendant la construction Vercel, après le téléchargement des photos.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const OUT = path.join(ROOT, process.env.COVERS_OUT || "assets/covers");
const CH = +(process.env.COVER_H || 1000), DY = (CH - 1000) / 2;
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/covers.json"), "utf8"));
const only = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });

/* petit serveur statique */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".woff2": "font/woff2", ".png": "image/png", ".json": "application/json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(4599, r));
const BASE = "http://localhost:4599";

/* navigateur : Chromium de @sparticuz sur Vercel, Chromium local sinon */
/* modules installés à part pendant la construction (MODS), sinon chemins donnés à la main */
const req = createRequire(path.join(process.env.MODS || ROOT, "noop.js"));
const load = async (name, env) => import(env ? pathToFileURL(env).href : pathToFileURL(req.resolve(name)).href);
const pw = await load("playwright-core", process.env.PW_CORE);
const chromium = pw.chromium || (pw.default && pw.default.chromium);
let launch = { args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
else {
  const spm = await load("@sparticuz/chromium");
  const sp = (spm.default && spm.default.executablePath) ? spm.default : (spm.default && spm.default.default) || spm;
  launch = { args: [...sp.args.filter((a) => a !== "--single-process"), "--hide-scrollbars", "--force-color-profile=srgb", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"], executablePath: await sp.executablePath(), headless: true };
}
const browser = await chromium.launch(launch);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture(slug, sels, mobile) {
  const ctx = await browser.newContext(mobile
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sites/${slug}/`, { waitUntil: "load", timeout: 60000 });
  await page.addStyleTag({ content: ".wa-f{display:none!important}" });
  await wait(3200);
  const shots = [await page.screenshot({ type: "jpeg", quality: 88 })];
  for (const sel of sels) {
    await page.evaluate((spec) => { const [s, f] = spec.split("@"), el = document.querySelector(s); if (!el) return; const r = el.getBoundingClientRect(); window.scrollTo(0, r.top + window.scrollY + (f ? r.height * +f - innerHeight / 2 : (s === "#voitures" ? 40 : 0))); }, sel);
    await wait(3600);
    shots.push(await page.screenshot({ type: "jpeg", quality: 88 }));
  }
  await ctx.close();
  return shots.map((b) => "data:image/jpeg;base64," + b.toString("base64"));
}

const FRAME = `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1600px;height:${CH}px;overflow:hidden;position:relative;font-family:system-ui,sans-serif}
.bg{position:absolute;inset:0;background:radial-gradient(120% 100% at 15% 0%,var(--hi) 0%,var(--tint) 60%)}
.desk{position:absolute;left:70px;top:${84 + DY}px;width:1180px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 50px 90px -20px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.08)}
.bar{height:38px;background:#ECEDEF;display:flex;align-items:center;gap:8px;padding:0 16px}
.bar i{width:12px;height:12px;border-radius:50%;background:#D4D6DA}
.bar i:nth-child(1){background:#F26B5E}.bar i:nth-child(2){background:#F5BF4F}.bar i:nth-child(3){background:#5FC454}
.bar span{margin-left:18px;flex:0 0 420px;height:22px;border-radius:6px;background:#fff}
.desk img{display:block;width:1180px;height:737.5px}
.phone{position:absolute;width:330px;height:700px;border-radius:52px;background:#0E0F11;padding:13px;box-shadow:0 50px 90px -20px rgba(0,0,0,.5),0 0 0 2px rgba(255,255,255,.08) inset}
.phone .scr{width:100%;height:100%;border-radius:40px;overflow:hidden;position:relative;background:#fff}
.phone img{display:block;width:100%;height:auto}
.phone .scr::before{content:"";position:absolute;top:10px;left:50%;width:74px;height:20px;margin-left:-37px;border-radius:12px;background:#0E0F11;z-index:2}
`;
function compose(tint, hi, kind, d, m) {
  let body;
  if (kind === "trio") {
    body = [0, 1, 2].map((i) => `<div class="phone" style="left:${200 + i * 420}px;top:${(i === 1 ? 110 : 190) + DY}px;transform:rotate(${(i - 1) * 3}deg)"><div class="scr"><img src="${m[i]}"></div></div>`).join("");
  } else {
    body = `<div class="desk"><div class="bar"><i></i><i></i><i></i><span></span></div><img src="${d}"></div><div class="phone" style="right:96px;top:${236 + DY}px"><div class="scr"><img src="${m}"></div></div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FRAME}</style></head><body style="--tint:${tint};--hi:${hi}"><div class="bg"></div>${body}</body></html>`;
}

const page = await (await browser.newContext({ viewport: { width: 1600, height: CH }, deviceScaleFactor: 1 })).newPage();
const cdp = await page.context().newCDPSession(page);
async function save(html, name) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  for (const [w, s, q] of [[1280, 0.8, 80], [640, 0.4, 82]]) {
    const { data } = await cdp.send("Page.captureScreenshot", { format: "webp", quality: q, clip: { x: 0, y: 0, width: 1600, height: CH, scale: s } });
    fs.writeFileSync(path.join(OUT, `${name}-${w}.webp`), Buffer.from(data, "base64"));
  }
}

let done = 0;
for (const s of LIST) {
  if (only.length && !only.includes(s.slug)) continue;
  if (!fs.existsSync(path.join(ROOT, "sites", s.slug, "index.html"))) continue;
  try {
    const d = await capture(s.slug, s.sections, false);
    const m = await capture(s.slug, s.sections, true);
    await save(compose(s.tint, s.hi, "duo", d[0], m[0]), `${s.slug}-1`);
    await save(compose(s.tint, s.hi, "duo", d[1], m[1]), `${s.slug}-2`);
    await save(compose(s.tint, s.hi, "trio", null, [m[0], m[1], m[2] || m[1]]), `${s.slug}-3`);
    done++;
    console.log("aperçus prêts :", s.slug);
  } catch (e) { console.log("aperçus manqués :", s.slug, e.message); }
}
console.log(`aperçus : ${done} sites`);
await browser.close();
server.close();
