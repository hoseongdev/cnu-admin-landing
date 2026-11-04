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

  /* ── 1. 상단 ──────────────────────────────── */
  function renderSite(site) {
    bindText("site", site);
    document.title = `${site.name} — ${site.affiliation}`;

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

  /* ── 2. 소개 ──────────────────────────────── */
  function renderAbout(about) {
    bindText("about", about);

    const prose = $('[data-about="paragraphs"]');
    about.paragraphs.forEach((text) => prose.appendChild(el("p", null, text)));

    const dl = $('[data-about="activities"]');
    about.activities.forEach((item) => dl.appendChild(row(item.title, item.desc)));
  }

  /* ── 3. 임원진 (조직도) ──────────────────── */
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

  /* ── 4. 행사 ──────────────────────────────── */
  /* 순서대로 크기가 달라집니다. data.js에서 size: "lg" | "side" | "md" | "sm"
     을 직접 지정하면 그 값이 우선합니다. */
  const EVENT_PATTERN = ["lg", "md", "md", "side", "md", "md"];

  function renderEvents(events) {
    bindText("events", events);

    const list = $('[data-events="list"]');
    events.list.forEach((ev, i) => {
      const size = ev.size || EVENT_PATTERN[i % EVENT_PATTERN.length];
      const li = el("li", `ev ev--${size}`);

      li.appendChild(figure(ev.image, ev.title));

      const body = el("div", "ev__body");
      const meta = el("div", "ev__meta");
      meta.appendChild(el("span", "ev__date", ev.date));
      if (ev.place) meta.appendChild(el("span", "ev__place", ev.place));
      body.appendChild(meta);
      body.appendChild(el("h3", "ev__title", ev.title));
      if (ev.desc) body.appendChild(el("p", "ev__desc", ev.desc));

      li.appendChild(body);
      list.appendChild(li);
    });
  }

  /* ── 5. 하단 ──────────────────────────────── */
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
  renderAbout(DATA.about);
  renderMembers(DATA.members);
  renderEvents(DATA.events);
  renderContact(DATA.contact);
})();
