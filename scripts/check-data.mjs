/* data.js 내용 검사기
   PR 올리기 전에 로컬에서도 돌려볼 수 있습니다:  node scripts/check-data.mjs  */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* 1. data.js 문법 */
let DATA;
try {
  DATA = eval(fs.readFileSync(path.join(root, "data.js"), "utf8") + ";DATA");
} catch (e) {
  console.error(`✗ data.js 문법 오류 — 이대로 머지하면 사이트가 백지가 됩니다.\n  ${e.message}`);
  process.exit(1);
}

/* 2. 필수 항목이 비어 있지 않은지 */
const need = {
  "site.name": DATA.site?.name,
  "site.tagline": DATA.site?.tagline,
  "about.heading": DATA.about?.heading,
  "about.letters": DATA.about?.letters,
  "activities.groups": DATA.activities?.groups,
  "awards.list": DATA.awards?.list,
  "join.steps": DATA.join?.steps,
  "join.cta": DATA.join?.cta?.href,
  "members.lead": DATA.members?.lead,
  "members.departments": DATA.members?.departments,
  "events.list": DATA.events?.list,
  "contact.details": DATA.contact?.details,
};
for (const [key, val] of Object.entries(need)) {
  if (val == null || (Array.isArray(val) && val.length === 0) || val === "") fail(`${key} 가 비어 있습니다.`);
}

/* 3. 네비게이션 링크가 실제 섹션을 가리키는지 */
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
for (const nav of DATA.site?.nav ?? []) {
  if (nav.href?.startsWith("#") && !ids.includes(nav.href.slice(1))) {
    fail(`nav "${nav.label}" 의 링크 ${nav.href} 에 해당하는 섹션이 없습니다.`);
  }
}

/* 4. 임원진·행사 필수 필드 */
(DATA.members?.lead ?? []).forEach((m, i) => {
  if (!m.name) fail(`members.lead[${i}] 에 name 이 없습니다.`);
  if (!m.role) fail(`members.lead[${i}] (${m.name ?? "?"}) 에 role 이 없습니다.`);
});
(DATA.members?.departments ?? []).forEach((d, i) => {
  if (!d.name) fail(`members.departments[${i}] 에 부서 이름(name)이 없습니다.`);
  if (!d.people?.length) fail(`${d.name ?? `부서 ${i}`} 에 people 이 비어 있습니다.`);
  (d.people ?? []).forEach((p, j) => {
    if (!p.name) fail(`${d.name} 의 people[${j}] 에 name 이 없습니다.`);
    if (!p.role) fail(`${d.name} 의 ${p.name ?? "?"} 에 role 이 없습니다.`);
  });
});
(DATA.events?.list ?? []).forEach((e, i) => {
  if (!e.title) fail(`events.list[${i}] 에 title 이 없습니다.`);
  if (!e.date) warn(`events.list[${i}] (${e.title ?? "?"}) 에 date 가 없습니다.`);
});

/* 5. 사진 경로가 실제 파일과 맞는지 (가장 흔한 실수) */
const images = [
  ...(DATA.activities?.groups ?? []).flatMap((g) => g.items ?? [])
    .flatMap((a) => (a.images ?? [a.image]).map((src) => [src, `활동 ${a.title}`])),
  ...(DATA.events?.list ?? []).map((e) => [e.image, `행사 ${e.title}`]),
].filter(([src]) => src);

for (const [src, who] of images) {
  if (!fs.existsSync(path.join(root, src))) {
    warn(`${who} 의 사진 ${src} 가 없습니다. 지금은 회색 박스로 보입니다.`);
  }
}

/* 결과 */
const counts = {
  대표운영진: DATA.members?.lead?.length ?? 0,
  부서: DATA.members?.departments?.length ?? 0,
  부서원: (DATA.members?.departments ?? []).reduce((n, d) => n + (d.people?.length ?? 0), 0),
  행사: DATA.events?.list?.length ?? 0,
  성과: DATA.awards?.list?.length ?? 0,
  소개문단: DATA.about?.paragraphs?.length ?? 0,
};
console.log(`읽은 내용: ${Object.entries(counts).map(([k, v]) => `${k} ${v}개`).join(", ")}`);

warnings.forEach((w) => console.log(`! ${w}`));
if (errors.length) {
  console.error(`\n✗ 오류 ${errors.length}개 — 고쳐야 머지할 수 있습니다.`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`\n✓ 통과${warnings.length ? ` (경고 ${warnings.length}개는 머지를 막지 않습니다)` : ""}`);
