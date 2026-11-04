/* ──────────────────────────────────────────────
   ADMIN — app.js
   data.js의 내용을 index.html의 자리에 채워 넣습니다.
   내용을 바꿀 때는 data.js만 고치면 됩니다.
   ────────────────────────────────────────────── */

(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  /* 간단한 텍스트 바인딩: <p data-site="tagline"> → DATA.site.tagline */
  function bindText(group, obj) {
    $$(`[data-${group}]`).forEach((node) => {
      const key = node.dataset[group];
      const value = obj[key];
      if (typeof value === "string") node.textContent = value;
    });
  }

  /* 회색 플레이스홀더 + 사진. 파일이 없으면 회색 박스와 파일명이 남습니다. */
  function figure(src, alt) {
    const file = (src || "").split("/").pop() || "";
    const box = el("div", "ph");
    box.dataset.file = file;
    if (!src) return box;

    const img = el("img");
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
      box.classList.add("is-filled");
    });
    img.addEventListener("error", () => img.remove());
    img.src = src;
    box.appendChild(img);
    return box;
  }

  /* dt + dd 한 줄 */
  function row(dt, dd, href) {
    const wrapper = el("div");
    wrapper.appendChild(el("dt", null, dt));
    const d = el("dd");
    if (href) {
      const a = el("a", null, dd);
      a.href = href;
      if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
      d.appendChild(a);
    } else {
      d.textContent = dd;
    }
    wrapper.appendChild(d);
    return wrapper;
  }

  /* 링크 하나 채우기. 바깥 주소는 새 탭으로 엽니다. */
  function fillLink(a, link) {
    a.textContent = link.label;
    a.href = link.href;
    if (/^https?:/.test(link.href)) { a.target = "_blank"; a.rel = "noopener"; }
  }

  /* "2026.11.21", "2026.05" 처럼 적힌 날짜가 끝나는 시각. 기간이면 시작일 기준입니다. */
  function lastDay(text) {
    const m = (text || "").match(/(\d{4})[.-](\d{1,2})(?:[.-](\d{1,2}))?/);
    if (!m) return null;
    const [, y, mo, d] = m.map(Number);
    return new Date(y, d ? mo - 1 : mo, d || 0, 23, 59, 59);
  }

  /* ── 1. 상단 ──────────────────────────────── */
  function renderSite(site) {
    bindText("site", site);
    document.title = `${site.name} — ${site.affiliation}`;

    const cta = $("[data-site-cta]");
    if (site.cta) fillLink(cta, site.cta);
    else cta.remove();

    const list = $('[data-site="nav"]');
    if (!list) return;
    site.nav.forEach((item) => {
      const li = el("li");
      const a = el("a", null, item.label);
      a.href = item.href;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* 다가오는 행사. until 날짜가 지나면 나오지 않습니다. */
  function renderNext(next) {
    if (!next) return;
    const end = lastDay(next.until);
    if (end && end < new Date()) return;

    $$("[data-next-text]").forEach((node) => {
      node.textContent = next[node.dataset.nextText] || "";
    });
    fillLink($("[data-next-link]"), next.link);
    $("[data-next]").hidden = false;
  }

  /* ── 2. 소개 ──────────────────────────────── */
  function renderAbout(about) {
    bindText("about", about);

    const prose = $('[data-about="paragraphs"]');
    about.paragraphs.forEach((text) => prose.appendChild(el("p", null, text)));

    const letters = $('[data-about="letters"]');
    about.letters.forEach((item) => {
      const li = el("li", "letter");
      li.appendChild(el("span", "letter__char", item.letter));
      li.appendChild(el("h3", "letter__word", item.word));
      li.appendChild(el("p", "letter__desc", item.desc));
      letters.appendChild(li);
    });
  }

  /* ── 3. 하는 일 ───────────────────────────── */
  function renderActivities(activities) {
    bindText("activities", activities);

    const box = $('[data-activities="groups"]');
    activities.groups.forEach((group) => {
      const wrap = el("div", "activity-group");
      wrap.appendChild(el("h3", "activity-group__name", group.name));
      const cards = el("ul", "activity-cards");
      group.items.forEach((item) => {
        const srcs = item.images ?? [item.image];
        const li = el("li", srcs.length > 1 ? "activity-card activity-card--wide" : "activity-card");
        const photos = el("div", "activity-card__photos");
        photos.style.setProperty("--photos", srcs.length);
        srcs.forEach((src) => photos.appendChild(figure(src, item.title)));
        li.appendChild(photos);
        li.appendChild(el("h4", "activity-card__title", item.title));
        if (item.desc) li.appendChild(el("p", "activity-card__desc", item.desc));
        cards.appendChild(li);
      });
      wrap.appendChild(cards);
      box.appendChild(wrap);
    });
  }

  /* ── 6. 운영진 (조직도) ──────────────────── */
  function person(p, cls) {
    const li = el("li", cls);
    const head = el("p", `${cls}__head`);
    head.appendChild(el("span", `${cls}__name`, p.name));
    head.appendChild(el("span", `${cls}__role`, p.role));
    li.appendChild(head);
    if (p.year) li.appendChild(el("p", `${cls}__year`, p.year));
    if (p.bio) li.appendChild(el("p", `${cls}__bio`, p.bio));
    return li;
  }

  function renderMembers(members) {
    bindText("members", members);

    /* 위쪽: 대표 운영진 */
    const lead = $('[data-members="lead"]');
    const leadList = members.lead ?? [];
    lead.style.setProperty("--cols", Math.min(leadList.length || 1, 4));
    leadList.forEach((m) => lead.appendChild(person(m, "lead")));

    /* 아래쪽: 부서별 */
    const depts = $('[data-members="departments"]');
    (members.departments ?? []).forEach((d) => {
      const row = el("div", "dept");
      const head = el("div", "dept__label");
      head.appendChild(el("h3", "dept__name", d.name));
      if (d.desc) head.appendChild(el("p", "dept__desc", d.desc));
      row.appendChild(head);

      const people = el("ul", "dept__people");
      (d.people ?? []).forEach((p) => people.appendChild(person(p, "mem")));
      row.appendChild(people);

      depts.appendChild(row);
    });
  }

  /* ── 4. 올해 기록 ─────────────────────────── */
  function renderEvents(events) {
    bindText("events", events);

    const now = new Date();
    const list = $('[data-events="list"]');
    events.list.forEach((ev) => {
      const li = el("li", "ev");
      const end = lastDay(ev.date);

      const when = el("div", "ev__when");
      when.appendChild(el("span", "ev__date", ev.date));
      if (end && end >= now) when.appendChild(el("span", "ev__soon", "예정"));
      li.appendChild(when);

      const body = el("div", "ev__body");
      body.appendChild(el("h3", "ev__title", ev.title));
      if (ev.place) body.appendChild(el("p", "ev__place", ev.place));
      if (ev.desc) body.appendChild(el("p", "ev__desc", ev.desc));
      if (ev.image) body.appendChild(figure(ev.image, ev.title));

      li.appendChild(body);
      list.appendChild(li);
    });
  }

  /* ── 5. 성과 ──────────────────────────────── */
  function renderAwards(awards) {
    bindText("awards", awards);

    const list = $('[data-awards="list"]');
    awards.list.forEach((item) => {
      const li = el("li", "award");
      li.appendChild(el("span", "award__year", item.year));
      li.appendChild(el("span", "award__title", item.title));
      li.appendChild(el("span", "award__result", item.result));
      list.appendChild(li);
    });
  }

  /* ── 7. 가입 안내 ─────────────────────────── */
  function renderJoin(join) {
    bindText("join", join);

    const steps = $('[data-join="steps"]');
    join.steps.forEach((step, i) => {
      const li = el("li", "step");
      li.appendChild(el("span", "step__num", String(i + 1)));
      li.appendChild(el("h3", "step__title", step.title));
      li.appendChild(el("p", "step__desc", step.desc));
      steps.appendChild(li);
    });

    const dl = $('[data-join="details"]');
    join.details.forEach((item) => dl.appendChild(row(item.label, item.value, item.href)));

    fillLink($("[data-join-cta]"), join.cta);
  }

  /* ── 8. 하단 ──────────────────────────────── */
  function renderContact(contact) {
    bindText("contact", contact);

    const fill = (sel, items) => {
      const dl = $(sel);
      items.forEach((item) => dl.appendChild(row(item.label, item.value, item.href)));
    };
    fill('[data-contact="details"]', contact.details);
    fill('[data-contact="links"]', contact.links);

    const copy = $('[data-contact="copyright"]');
    copy.textContent = `© ${new Date().getFullYear()} ${contact.copyright}`;
  }

  /* ── 실행 ─────────────────────────────────── */
  if (typeof DATA === "undefined") {
    console.error("data.js를 먼저 불러와야 합니다.");
    return;
  }

  renderSite(DATA.site);
  renderNext(DATA.next);
  renderAbout(DATA.about);
  renderActivities(DATA.activities);
  renderEvents(DATA.events);
  renderAwards(DATA.awards);
  renderMembers(DATA.members);
  renderJoin(DATA.join);
  renderContact(DATA.contact);
})();
