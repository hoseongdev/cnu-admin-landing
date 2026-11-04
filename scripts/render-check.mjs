/* 실제 브라우저로 페이지를 열어 확인합니다. 외부 패키지를 쓰지 않습니다.
   로컬 실행:  node scripts/render-check.mjs            */

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const PORT = 9444;

/* 설치된 크롬 찾기 */
const candidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("✗ 크롬을 찾지 못했습니다. CHROME_BIN 환경변수로 경로를 지정하세요.");
  process.exit(1);
}

const proc = spawn(chrome, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), "render-check-"))}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 디버깅 포트가 열릴 때까지 대기 */
let tabs;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try { tabs = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch {}
}
if (!tabs) { proc.kill(); console.error("✗ 크롬이 뜨지 않았습니다."); process.exit(1); }

const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const errors = [];
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

await new Promise((r) => ws.addEventListener("open", r));
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text || "스크립트 예외");
  if (m.method === "Log.entryAdded") {
    const e = m.params.entry;
    // 사진 파일이 없어서 나는 404 는 정상 동작이므로 제외
    if (e.level === "error" && !/Failed to load resource/.test(e.text)) errors.push(e.text);
  }
});

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: pathToFileURL(path.join(root, "index.html")).href });
await sleep(2500);

const read = async (expr) =>
  JSON.parse((await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result.value);

const found = await read(`JSON.stringify({
  title: document.title,
  nav: document.querySelectorAll('.topbar__nav a').length,
  paragraphs: document.querySelectorAll('.prose p').length,
  lead: document.querySelectorAll('.org__lead > li').length,
  departments: document.querySelectorAll('.dept').length,
  members: document.querySelectorAll('.org__lead > li, .dept__people > li').length,
  events: document.querySelectorAll('.events > li').length,
  letters: document.querySelectorAll('.letters > li').length,
  activities: document.querySelectorAll('.activity-group').length,
  awards: document.querySelectorAll('.awards > li').length,
  steps: document.querySelectorAll('.steps > li').length,
  contacts: document.querySelectorAll('.contact-list > div').length,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
})`);

/* 모바일 폭에서도 확인 */
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await sleep(600);
const mobile = await read(
  `JSON.stringify({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })`
);

ws.close();
proc.kill();

console.log(`렌더링 결과: ${JSON.stringify(found)}`);

const problems = [];
if (errors.length) problems.push(`자바스크립트 오류 — ${errors.join(" / ")}`);
for (const [key, label] of [["nav", "네비게이션"], ["lead", "대표 운영진"], ["departments", "부서"], ["members", "임원진"], ["events", "행사"], ["letters", "ADMIN 다섯 글자"], ["activities", "활동"], ["awards", "성과"], ["steps", "가입 안내"], ["contacts", "연락처"], ["paragraphs", "소개 문단"]]) {
  if (found[key] === 0) problems.push(`${label} 가 하나도 그려지지 않았습니다.`);
}
if (!found.title) problems.push("문서 제목이 비어 있습니다.");
if (found.overflow) problems.push("데스크톱(1280px)에서 가로 스크롤이 생깁니다.");
if (mobile.overflow) problems.push("모바일(390px)에서 가로 스크롤이 생깁니다.");

if (problems.length) {
  console.error("\n✗ 문제 발견");
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log("\n✓ 렌더링 통과");
