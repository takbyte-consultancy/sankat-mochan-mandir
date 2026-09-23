/* =====================================================================
   Sankat Mochan Mandir, Mirzapur — site script (v2)
   ===================================================================== */

// ▼▼▼ The temple's WhatsApp number: country code + number, digits only ▼▼▼
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // [REPLACE] e.g. "919876543210"
// ▲▲▲ -------------------------------------------------------------- ▲▲▲

(function () {
  "use strict";

  const DATA = window.SITE_DATA || {};
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- helpers ---------- */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v === true ? "" : v);
    }
    [].concat(children).forEach((c) => c != null && c !== false && node.append(c));
    return node;
  }
  function icon(id) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }
  const parseDate = (iso) => { const [y, m, d] = String(iso).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  const formatDate = (date) => date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const toMin = (hhmm) => { const [h, m] = String(hhmm).split(":").map(Number); return h * 60 + (m || 0); };
  function fmtTime(hhmm) {
    if (!/^\d{1,2}:\d{2}$/.test(String(hhmm))) return String(hhmm || "");
    let [h, m] = hhmm.split(":").map(Number);
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + " " + ap;
  }
  // Current time in India, whatever the visitor's own timezone
  function nowIST() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return get("hour") * 60 + get("minute");
  }

  function waUrl(message) {
    const number = String(WHATSAPP_NUMBER).replace(/\D/g, "");
    if ((!number || /X/i.test(WHATSAPP_NUMBER)) && !waUrl.warned) {
      waUrl.warned = true;
      console.warn("[Sankat Mochan] Set WHATSAPP_NUMBER at the top of assets/js/main.js");
    }
    return "https://wa.me/" + number + (message ? "?text=" + encodeURIComponent(message) : "");
  }
  function openWhatsApp(message) {
    const win = window.open(waUrl(message), "_blank", "noopener");
    if (!win) window.location.href = waUrl(message);
  }
  const WA_HEAD = "॥ जय श्री राम ॥";

  /* ---------- live darshan status + schedule ---------- */
  function currentSlot(now) {
    return (DATA.schedule || []).find((s) => now >= toMin(s.start) && now < toMin(s.end));
  }
  function renderStatus() {
    const box = $("[data-status]");
    const schedule = DATA.schedule || [];
    if (!box || !schedule.length) return;
    const now = nowIST();
    const slot = currentSlot(now);
    const text = $(".status__text", box);
    box.classList.remove("is-open", "is-closed");
    if (slot && !slot.closed) {
      box.classList.add("is-open");
      text.textContent = "मंदिर खुला है · Darshan open till " + fmtTime(nextCloseTime(now));
    } else {
      box.classList.add("is-closed");
      const next = schedule.find((s) => !s.closed && toMin(s.start) > now) || schedule.find((s) => !s.closed);
      text.textContent = "कपाट बंद · Opens " + (next ? fmtTime(next.start) : "");
    }
    // mark the current row in the schedule table
    $$(".schedule tbody tr").forEach((tr) => {
      const on = slot && tr.dataset.start === slot.start;
      tr.classList.toggle("is-now", !!on);
      const badge = $(".now-badge", tr);
      if (on && !badge) $("th", tr).append(el("span", { class: "now-badge", text: "अभी · Now" }));
      if (!on && badge) badge.remove();
    });
    // highlight the next aarti tile
    const aartis = $$(".aarti");
    aartis.forEach((a) => { a.classList.remove("is-next"); $(".aarti__next", a)?.remove(); });
    const nextIdx = (DATA.aartis || []).findIndex((a) => toMin(a.time) >= now);
    const target = aartis[nextIdx === -1 ? 0 : nextIdx];
    if (target) { target.classList.add("is-next"); target.append(el("span", { class: "aarti__next", text: "अगली आरती" })); }
  }
  // last minute of the continuous open stretch that includes "now"
  function nextCloseTime(now) {
    const s = (DATA.schedule || []).slice().sort((a, b) => toMin(a.start) - toMin(b.start));
    let i = s.findIndex((x) => now >= toMin(x.start) && now < toMin(x.end));
    let end = s[i].end;
    while (s[i + 1] && !s[i + 1].closed && s[i + 1].start === end) { i++; end = s[i].end; }
    return end;
  }

  function renderSchedule() {
    const body = $('[data-render="schedule"]');
    if (body) (DATA.schedule || []).forEach((s) => body.append(
      el("tr", { class: [s.highlight && "is-highlight", s.closed && "is-closed"].filter(Boolean).join(" "), "data-start": s.start }, [
        el("th", { scope: "row" }, [el("span", { lang: "hi", text: s.ritual }), s.ritualEn ? el("small", { text: s.ritualEn }) : null]),
        el("td", { text: fmtTime(s.start) + " – " + fmtTime(s.end) }),
        el("td", {}, s.note ? el("span", { text: s.note }) : "")
      ])
    ));
    const note = $("[data-schedule-note]");
    if (note) { if (DATA.scheduleNote) note.textContent = "* " + DATA.scheduleNote; else note.remove(); }

    const aartis = DATA.aartis || [];
    const strip = $('[data-render="aartis"]');
    if (strip) aartis.forEach((a) => strip.append(el("li", { class: "aarti" }, [
      el("span", { class: "aarti__name", lang: "hi", text: a.label }),
      el("span", { class: "aarti__time", text: fmtTime(a.time) })
    ])));
    const foot = $('[data-render="aartis-footer"]');
    if (foot) aartis.forEach((a) => foot.append(el("li", {}, [el("span", { lang: "hi", text: a.label }), el("strong", { text: fmtTime(a.time) })])));
  }

  /* ---------- hero announcement ---------- */
  function renderAnnouncement() {
    const a = DATA.announcement;
    const box = $("[data-announcement]");
    if (!box) return;
    if (!a || !a.text) { $("[data-a-text]", box).remove(); $("[data-a-title]", box).parentElement.remove(); return; }
    $("[data-a-title]", box).textContent = a.title || "";
    $("[data-a-title-en]", box).textContent = a.titleEn ? "(" + a.titleEn + ")" : "";
    $("[data-a-text]", box).textContent = a.text;
  }

  /* ---------- temple family ---------- */
  const arch = (src, alt) => el("div", { class: "arch" }, el("img", { src, alt, width: "600", height: "800", loading: "lazy", decoding: "async" }));
  function renderFamily() {
    const m = DATA.mahant;
    const card = $('[data-render="mahant"]');
    if (card && m) card.append(
      arch(m.photo, (m.titleHi || "") + " " + (m.nameHi || m.name)),
      el("div", {}, [
        el("p", { class: "tag tag--gold mahant__badge", lang: "hi", text: (m.titleHi || "") + " · " + (m.title || "") }),
        el("h3", { class: "mahant__name", lang: "hi", text: (m.titleHi ? m.titleHi + " " : "") + (m.nameHi || m.name) }),
        el("p", { class: "mahant__en", text: (m.title ? m.title + " " : "") + m.name }),
        m.note ? el("p", { class: "mahant__note", lang: "hi", text: m.note }) : null
      ])
    );
    const list = $('[data-render="sevaks"]');
    if (list) (DATA.sevaks || []).forEach((s) => list.append(el("li", { class: "sevak reveal" }, [
      arch(s.photo, "सेवक " + (s.nameHi || s.name)),
      el("p", { class: "sevak__hi", lang: "hi", text: s.nameHi || s.name }),
      el("p", { class: "sevak__en", text: s.name }),
      s.role ? el("span", { class: "tag tag--saffron", lang: "hi", text: s.role }) : null
    ])));
  }

  /* ---------- events ---------- */
  function renderEvents() {
    const grid = $('[data-render="events"]');
    if (!grid) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const events = (DATA.events || [])
      .map((e) => ({ ...e, _date: e.date ? parseDate(e.date) : null }))
      .filter((e) => !e._date || DATA.showPastEvents || e._date >= today)
      .sort((a, b) => (a._date ? a._date : Infinity) - (b._date ? b._date : Infinity));

    if (!events.length) { grid.append(el("p", { class: "events__empty", lang: "hi", text: "आगामी उत्सवों की सूचना शीघ्र दी जाएगी। जय श्री राम 🙏" })); return; }

    events.forEach((e) => {
      const when = e._date ? formatDate(e._date) : (e.recurring || "");
      const msg = [WA_HEAD, "", "🙏 उत्सव पूछताछ · Event Enquiry – Sankat Mochan Mandir", "", "उत्सव: " + (e.titleHi || e.title) + (e.title ? " (" + e.title + ")" : ""), "तिथि: " + when, "", "कृपया इस उत्सव की जानकारी दें।"].join("\n");
      const seal = e._date
        ? el("div", { class: "seal", "aria-hidden": "true" }, [
            el("span", { class: "seal__day", text: String(e._date.getDate()).padStart(2, "0") }),
            el("span", { class: "seal__month", text: e._date.toLocaleDateString("en-IN", { month: "short" }) })
          ])
        : el("div", { class: "seal seal--recurring", "aria-hidden": "true" }, icon("diya"));
      grid.append(el("article", { class: "event reveal" }, [
        el("div", { class: "event__top" }, [
          e.image ? el("div", { class: "event__media" }, el("img", { src: e.image, alt: e.titleHi || e.title, width: "800", height: "500", loading: "lazy", decoding: "async" })) : el("div", { class: "event__media" }),
          e.badge ? el("span", { class: "tag " + (e.recurring ? "tag--green" : "tag--gold") + " event__badge", lang: "hi", text: e.badge }) : null,
          seal
        ]),
        el("div", { class: "event__body" }, [
          e.tithi ? el("span", { class: "tag tag--saffron event__tithi", lang: "hi", text: e.tithi }) : null,
          el("h3", { class: "event__hi", lang: "hi", text: e.titleHi || e.title }),
          e.titleHi && e.title ? el("p", { class: "event__en", text: e.title }) : null,
          el("p", { class: "event__when" }, e._date ? el("time", { datetime: e.date, text: when }) : el("span", { lang: "hi", text: when })),
          e.description ? el("p", { class: "event__desc", lang: "hi", text: e.description }) : null,
          el("div", { class: "event__foot" }, [
            el("span", { class: "event__place", lang: "hi", text: e.location ? "स्थान: " + e.location : "" }),
            el("a", { class: "event__link", href: waUrl(msg), target: "_blank", rel: "noopener" }, [icon("icon-wa"), el("span", { lang: "hi", text: "जानकारी लें" }), " →"])
          ])
        ])
      ]));
    });
  }

  /* ---------- gallery + lightbox ---------- */
  function setupGallery() {
    const grid = $('[data-render="gallery"]');
    if (!grid) return;
    const items = DATA.gallery || [];
    items.forEach((g, i) => grid.append(el("li", { class: "gallery__item", "data-category": g.category },
      el("button", { type: "button", class: "g-card", "data-index": String(i), "aria-label": "बड़ा देखें: " + (g.caption || "चित्र " + (i + 1)) }, [
        el("img", { src: g.src, alt: g.caption || "Sankat Mochan Mandir", loading: "lazy", decoding: "async", width: "800", height: "600" }),
        el("span", { class: "g-card__cap" }, [el("span", { class: "g-card__tag", text: g.tag || "" }), el("span", { class: "g-card__text", text: g.caption || "" })])
      ])
    )));

    $$(".filters .chip").forEach((chip) => chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      $$(".filters .chip").forEach((c) => { const on = c === chip; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      $$(".gallery__item", grid).forEach((li) => { li.hidden = !(f === "all" || li.dataset.category === f); });
    }));

    const dlg = $(".lightbox");
    if (!dlg || typeof dlg.showModal !== "function") {
      // very old browsers: open the image itself
      grid.addEventListener("click", (e) => { const b = e.target.closest(".g-card"); if (b) window.open(items[b.dataset.index].src, "_blank", "noopener"); });
      return;
    }
    const img = $(".lightbox__img", dlg), cap = $(".lightbox__caption", dlg);
    let order = [], pos = 0, opener = null;
    const show = () => { const g = items[order[pos]]; img.src = g.src; img.alt = g.caption || ""; cap.textContent = [g.tag, g.caption].filter(Boolean).join(" · "); };
    const step = (d) => { pos = (pos + d + order.length) % order.length; show(); };
    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".g-card"); if (!b) return;
      opener = b;
      order = $$(".gallery__item:not([hidden]) .g-card", grid).map((x) => Number(x.dataset.index));
      pos = order.indexOf(Number(b.dataset.index));
      show(); dlg.showModal();
    });
    dlg.addEventListener("click", (e) => {
      const act = e.target.closest("[data-lb]")?.dataset.lb;
      if (act === "close" || e.target === dlg) dlg.close();
      else if (act === "prev") step(-1);
      else if (act === "next") step(1);
    });
    dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
    dlg.addEventListener("close", () => { if (opener) opener.focus(); });
    let sx = null;
    dlg.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); sx = null; });
  }

  /* ---------- donation ---------- */
  function setupDonation() {
    const d = DATA.donation || {};
    const chips = $('[data-render="amounts"]');
    const input = $("#d-amount");
    if (chips && input) {
      const sync = () => $$(".amount-chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(Number(c.dataset.amount) === Number(input.value))));
      (d.amounts || []).forEach((a) => {
        const b = el("button", { type: "button", class: "amount-chip", "data-amount": String(a), "aria-pressed": "false", text: "₹" + a.toLocaleString("en-IN") });
        b.addEventListener("click", () => { input.value = a; sync(); input.dispatchEvent(new Event("input", { bubbles: true })); });
        chips.append(b);
      });
      input.value = d.defaultAmount || (d.amounts || [])[0] || "";
      input.addEventListener("input", sync);
      sync();
    }
    const purposes = $('[data-render="purposes"]');
    if (purposes) (d.purposes || []).forEach((p) => purposes.append(el("option", { value: p, text: p })));

    const qr = $("[data-qr]"); if (qr && d.qrImage) qr.src = d.qrImage;
    const idEl = $("[data-upi-id]"); if (idEl) idEl.textContent = d.upiId || "";
    const copyBtn = $("[data-copy-upi]"), status = $(".upi__status");
    if (copyBtn) copyBtn.addEventListener("click", async () => {
      const text = d.upiId || "";
      try { await navigator.clipboard.writeText(text); }
      catch (_) { const ta = el("textarea", { style: "position:fixed;opacity:0" }); ta.value = text; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
      status.textContent = "✓ UPI ID कॉपी हो गई · Copied";
      setTimeout(() => { status.textContent = ""; }, 3000);
    });
  }

  /* ---------- trust + contact + misc ---------- */
  function renderTrustContact() {
    const t = DATA.trust || {};
    const set = (sel, v) => { const n = $(sel); if (n) n.textContent = v || ""; };
    set("[data-trust-name]", t.name); set("[data-trust-name-en]", t.nameEn); set("[data-trust-desc]", t.description);
    const chips = $('[data-render="trust-activities"]');
    if (chips) (t.activities || []).forEach((a) => chips.append(el("li", {}, [icon("i-check"), a])));
    const link = $("[data-trust-link]"); if (link && t.url) link.href = t.url;
    const reg = $("[data-trust-reg]"); if (reg && t.registrationNo) { reg.textContent = t.registrationNo; reg.hidden = false; }

    const c = DATA.contact || {};
    const addr = $('[data-contact="address"]');
    if (addr) (c.addressLines || []).forEach((l, i) => { if (i) addr.append(el("br")); addr.append(l); });
    const phones = $('[data-contact="phones"]');
    if (phones) (c.phones || []).forEach((p) => phones.append(el("span", { class: "info-card__line" }, [
      p.label ? el("span", { lang: "hi", text: p.label + ": " }) : null,
      el("a", { href: "tel:" + String(p.number).replace(/[^\d+]/g, ""), text: p.number })
    ])));
    set('[data-contact="hours"]', c.officeHours);
    const emails = $('[data-contact="emails"]');
    if (emails) (c.emails || []).forEach((m) => emails.append(el("a", { class: "info-card__line", href: "mailto:" + m, text: m })));
    $$("[data-map]").forEach((f) => { if (c.mapEmbed) f.src = c.mapEmbed; });
    const ml = $("[data-map-link]"); if (ml && c.mapLink) ml.href = c.mapLink;

    const float = $("[data-wa-float]");
    if (float) float.href = waUrl(WA_HEAD + "\nश्री संकट मोचन मंदिर, मिर्ज़ापुर — दर्शन व सेवा हेतु जानकारी चाहिए।");
    const year = $("[data-year]"); if (year) year.textContent = new Date().getFullYear();
    const dateInput = $("#v-date");
    if (dateInput) { const t2 = new Date(); t2.setMinutes(t2.getMinutes() - t2.getTimezoneOffset()); dateInput.min = t2.toISOString().slice(0, 10); }
  }

  /* ---------- forms → WhatsApp ---------- */
  const rupee = (v) => "₹" + Number(v).toLocaleString("en-IN");
  const FORMS = {
    visitor: {
      heading: "🙏 दर्शन पूछताछ · Visitor Enquiry – Sankat Mochan Mandir",
      build: (f) => [
        "नाम / Name: " + f.name, "मोबाइल / Phone: " + f.phone, f.city && ("शहर / City: " + f.city),
        "आगमन तिथि / Date: " + (f.date ? formatDate(parseDate(f.date)) : ""),
        "व्यक्ति / People: " + f.people, "विषय / Purpose: " + f.purpose,
        f.message && ("संदेश / Message: " + f.message)
      ]
    },
    donation: {
      heading: "🙏 सेवा संकल्प · Donation – Sankat Mochan Mandir",
      build: (f) => [
        "स्थिति / Status: " + f.status,
        "राशि / Amount: " + rupee(f.amount),
        "उद्देश्य / Purpose: " + f.purpose,
        "", "दानदाता / Name: " + f.name, "मोबाइल / Phone: " + f.phone,
        f.gotra && ("गोत्र / Gotra: " + f.gotra), f.city && ("शहर / City: " + f.city),
        f.message && ("संदेश / Message: " + f.message),
        /donated/.test(f.status) ? "\n(भुगतान का स्क्रीनशॉट संलग्न · Payment screenshot attached)" : "\nकृपया रसीद व संकल्प की पुष्टि करें।"
      ]
    },
    contact: {
      heading: "🙏 संदेश · Message – Sankat Mochan Mandir",
      build: (f) => ["नाम / Name: " + f.name, "मोबाइल / Phone: " + f.phone, "संदेश / Message: " + f.message]
    }
  };

  function validPhone(value) {
    const d = String(value).replace(/\D/g, "").replace(/^0+/, "");
    return /^(91)?[6-9]\d{9}$/.test(d);
  }
  function fieldError(input, message) {
    const field = input.closest(".field");
    if (!field) return;
    let err = $(".field__error", field);
    if (message) {
      field.classList.add("has-error");
      if (!err) { err = el("p", { class: "field__error", id: input.id + "-error" }); field.append(err); }
      err.textContent = message;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", err.id);
    } else {
      field.classList.remove("has-error");
      if (err) err.remove();
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }
  function validate(input) {
    const v = input.validity;
    let msg = "";
    if (v.valueMissing) msg = "यह आवश्यक है · This field is required.";
    else if (input.type === "tel" && !validPhone(input.value)) msg = "कृपया सही 10 अंकों का मोबाइल नंबर लिखें · Enter a valid 10-digit mobile number.";
    else if (v.rangeUnderflow) msg = input.type === "date" ? "आज या आगे की तिथि चुनें · Choose today or a later date." : "कृपया बड़ी संख्या लिखें · Please enter a larger number.";
    else if (v.rangeOverflow) msg = "कृपया छोटी संख्या लिखें · Please enter a smaller number.";
    else if (!v.valid) msg = "कृपया जाँचें · Please check this value.";
    fieldError(input, msg);
    return !msg;
  }
  function setupForms() {
    $$("[data-wa-form]").forEach((form) => {
      const cfg = FORMS[form.dataset.waForm];
      form.addEventListener("input", (e) => { if (e.target.closest(".has-error")) validate(e.target); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const bad = $$("input:not([type=radio]), select, textarea", form).filter((i) => !validate(i));
        if (bad.length) { bad[0].focus(); return; }
        const data = Object.fromEntries(new FormData(form).entries());
        Object.keys(data).forEach((k) => (data[k] = String(data[k]).trim()));
        const lines = [WA_HEAD, "", cfg.heading, "──────────────"].concat(cfg.build(data).filter((l) => l !== undefined && l !== null && l !== false && l !== ""));
        openWhatsApp(lines.join("\n").replace(/\n{3,}/g, "\n\n").trim());
      });
    });
  }

  /* ---------- navigation ---------- */
  function setupNav() {
    const toggle = $(".nav__toggle"), menu = $("#nav-menu");
    const close = () => { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) $("a", menu).focus();
    });
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); toggle.focus(); } });
    document.addEventListener("click", (e) => { if (!e.target.closest(".nav")) close(); });

    const links = $$('.nav__menu a[href^="#"]');
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
      const a = map.get(en.target.id);
      if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- hero text reveal ---------- */
  function setupLetterReveal() {
    const target = $("[data-reveal-letters]");
    if (!target) return;
    const text = target.textContent;
    const parts = window.Intl && Intl.Segmenter
      ? Array.from(new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(text), (s) => s.segment)
      : text.split(/(\s+)/);
    target.textContent = "";
    target.setAttribute("aria-hidden", "true");
    target.parentElement.append(el("span", { class: "sr-only", text }));
    const spans = parts.map((p) => el("span", { class: "ch", text: p }));
    target.append(...spans);
    if (REDUCED) return;
    spans.forEach((s, i) => s.animate(
      [{ opacity: 0, transform: "translateY(14px)", filter: "blur(4px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }],
      { duration: 600, delay: 150 + i * 70, fill: "backwards", easing: "cubic-bezier(.2,.7,.2,1)" }
    ));
  }

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (REDUCED) { items.forEach((i) => i.classList.add("is-visible")); return; }
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.set(items, { opacity: 0, y: 26 });
      window.ScrollTrigger.batch(items, { start: "top 90%", once: true,
        onEnter: (batch) => window.gsap.to(batch, { opacity: 1, y: 0, duration: .8, ease: "power2.out", stagger: .08, overwrite: true }) });
      window.gsap.from(".hero__hi, .hero__en, .hero__lead", { opacity: 0, y: 18, duration: .8, stagger: .12, delay: .5, ease: "power2.out" });
      window.gsap.from(".shrine", { opacity: 0, scale: .95, duration: 1.1, delay: .3, ease: "power2.out" });
      window.gsap.from(".hero__panel > *, .aarti-strip", { opacity: 0, y: 24, duration: .8, stagger: .12, delay: .8, ease: "power2.out" });
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    items.forEach((i) => io.observe(i));
  }

  /* ---------- hero petals ---------- */
  function setupPetals() {
    const canvas = $(".hero__petals");
    if (!canvas || REDUCED || !canvas.getContext) return;
    const ctx = canvas.getContext("2d"), hero = canvas.parentElement;
    const COLORS = ["#E8751A", "#FFB800", "#FFA000", "#F2D492", "#D84315"];
    const COUNT = window.innerWidth < 640 ? 12 : 22;
    let w = 0, h = 0, running = false, raf = 0, last = 0;
    const petals = [];
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(p, initial) {
      Object.assign(p, { x: Math.random() * w, y: initial ? Math.random() * h : -20, r: 5 + Math.random() * 6, vy: 20 + Math.random() * 30,
        sway: 12 + Math.random() * 24, phase: Math.random() * 6.28, rot: Math.random() * 3.14, vr: (Math.random() - .5) * 1.6,
        c: COLORS[(Math.random() * COLORS.length) | 0], a: .45 + Math.random() * .4 });
      return p;
    }
    function frame(t) {
      const dt = Math.min((t - last) / 1000 || 0, .05); last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.phase += dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.y > h + 20) spawn(p, false);
        ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x + Math.sin(p.phase) * p.sway, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    resize();
    for (let i = 0; i < COUNT; i++) petals.push(spawn({}, true));
    new IntersectionObserver(([en]) => (en.isIntersecting && !document.hidden ? start() : stop())).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  }

  /* ---------- boot ---------- */
  function boot() {
    renderAnnouncement();
    renderSchedule();
    renderFamily();
    renderEvents();
    setupGallery();
    setupDonation();
    renderTrustContact();
    renderStatus();
    setInterval(renderStatus, 60 * 1000);
    setupForms();
    setupNav();
    setupLetterReveal();
    setupReveal();
    setupPetals();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
