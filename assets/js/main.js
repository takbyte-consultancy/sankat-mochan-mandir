/* =====================================================================
   Sankat Mochan Mandir, Mirzapur — site script
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
    [].concat(children).forEach((c) => c != null && node.append(c));
    return node;
  }
  function parseDate(iso) {
    const [y, m, d] = String(iso).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  function formatDate(date) {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
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
    if (!win) window.location.href = waUrl(message); // popup blocked → same tab
  }

  /* ---------- render: timings ---------- */
  function renderTimings() {
    const timings = DATA.timings || [];
    const aartis = DATA.aartis || [];

    const strip = $('[data-render="timings-strip"]');
    if (strip) timings.forEach((t) => strip.append(el("li", {}, [el("span", { text: t.label }), el("strong", { text: t.time })])));

    const footer = $('[data-render="timings-footer"]');
    if (footer) timings.forEach((t) => footer.append(el("li", { text: t.label + ": " + t.time })));

    const table = $('[data-render="timings-table"]');
    if (table) {
      const group = (title, rows) => {
        table.append(el("tr", { class: "group-row" }, el("th", { colspan: "2", scope: "colgroup", text: title })));
        rows.forEach((r) => table.append(
          el("tr", {}, [
            el("th", { scope: "row" }, [r.label, el("span", { class: "hi", lang: "hi", text: r.labelHi || "" })]),
            el("td", { text: r.time })
          ])
        ));
      };
      group("Darshan", timings);
      group("Aarti", aartis);
    }
  }

  /* ---------- render: temple family ---------- */
  function archImg(src, alt, eager) {
    return el("div", { class: "arch" }, el("img", {
      class: "arch__img", src, alt, width: "600", height: "800", loading: eager ? null : "lazy", decoding: "async"
    }));
  }
  function renderFamily() {
    const m = DATA.mahant;
    const card = $('[data-render="mahant"]');
    if (card && m) {
      card.append(
        archImg(m.photo, m.title + " " + m.name),
        el("div", {}, [
          el("p", { class: "mahant-card__role" }, [m.title + " · ", el("span", { lang: "hi", text: m.titleHi || "" })]),
          el("h3", { text: m.name }),
          el("p", { text: m.note || "" })
        ])
      );
    }
    const list = $('[data-render="sevaks"]');
    if (list) (DATA.sevaks || []).forEach((s) => list.append(
      el("li", { class: "sevak reveal" }, [
        archImg(s.photo, "Sevak " + s.name),
        el("p", { class: "sevak__role", text: "Sevak" }),
        el("p", { class: "sevak__name", text: s.name })
      ])
    ));
  }

  /* ---------- render: events ---------- */
  function renderEvents() {
    const grid = $('[data-render="events"]');
    if (!grid) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const events = (DATA.events || [])
      .map((e) => ({ ...e, _date: parseDate(e.date) }))
      .filter((e) => DATA.showPastEvents || e._date >= today)
      .sort((a, b) => a._date - b._date);

    if (!events.length) {
      grid.append(el("p", { class: "events__empty", text: "New events will be announced soon. जय श्री राम 🙏" }));
      return;
    }
    events.forEach((e) => {
      const msg = [
        "🙏 Event Enquiry – Sankat Mochan Mandir",
        "",
        "Event: " + e.title + (e.titleHi ? " (" + e.titleHi + ")" : ""),
        "Date: " + formatDate(e._date),
        "",
        "Jai Shri Ram. I would like to know more about this event."
      ].join("\n");
      grid.append(el("article", { class: "event reveal" }, [
        el("div", { class: "event__top" }, [
          el("div", { class: "event__media" }, el("img", { src: e.image, alt: e.title, width: "800", height: "600", loading: "lazy", decoding: "async" })),
          el("div", { class: "seal", "aria-hidden": "true" }, [
            el("span", { class: "seal__day", text: String(e._date.getDate()).padStart(2, "0") }),
            el("span", { class: "seal__month", text: e._date.toLocaleDateString("en-IN", { month: "short" }) })
          ])
        ]),
        el("div", { class: "event__body" }, [
          e.titleHi ? el("p", { class: "event__hi", lang: "hi", text: e.titleHi }) : null,
          el("h3", { text: e.title }),
          el("p", { class: "small muted" }, el("time", { datetime: e.date, text: formatDate(e._date) })),
          el("p", { class: "event__desc", text: e.description || "" }),
          el("a", { class: "btn btn--primary btn--sm", href: waUrl(msg), target: "_blank", rel: "noopener" }, [
            svgUse("icon-wa"), "Enquire on WhatsApp"
          ])
        ])
      ]));
    });
  }
  function svgUse(id) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }

  /* ---------- render: gallery + filters + lightbox ---------- */
  let lightbox = null;
  function renderGallery() {
    const grid = $('[data-render="gallery"]');
    if (!grid) return;
    (DATA.gallery || []).forEach((g, i) => grid.append(
      el("a", {
        class: "gallery__item glightbox-on", href: g.src, "data-category": g.category,
        "data-gallery": "temple", "data-description": g.caption || "",
        "aria-label": "Open image: " + (g.caption || "Gallery image " + (i + 1))
      }, el("img", { src: g.src, alt: g.caption || "Sankat Mochan Mandir gallery image", loading: "lazy", decoding: "async", width: "800", height: i % 3 === 1 ? "600" : "1000" }))
    ));

    const initLightbox = () => {
      if (typeof window.GLightbox !== "function") return;
      if (lightbox) lightbox.destroy();
      lightbox = window.GLightbox({ selector: ".glightbox-on", touchNavigation: true, loop: true, openEffect: REDUCED ? "none" : "zoom", closeEffect: REDUCED ? "none" : "zoom" });
    };
    initLightbox();

    $$(".filters .chip").forEach((chip) => chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      $$(".filters .chip").forEach((c) => { const on = c === chip; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", on); });
      $$(".gallery__item", grid).forEach((item) => {
        const show = f === "all" || item.dataset.category === f;
        item.hidden = !show;
        item.classList.toggle("glightbox-on", show);
      });
      initLightbox();
    }));
  }

  /* ---------- render: donation + contact + misc ---------- */
  function renderDonation() {
    const d = DATA.donation || {};
    const chips = $('[data-render="amounts"]');
    if (chips) {
      (d.amounts || []).forEach((a, i) => chips.append(
        el("label", { class: "amount-chip" }, [el("input", { type: "radio", name: "amount", value: String(a), checked: i === 0 }), el("span", { text: "₹" + a.toLocaleString("en-IN") })])
      ));
      chips.append(el("label", { class: "amount-chip" }, [el("input", { type: "radio", name: "amount", value: "custom" }), el("span", { text: "Custom" })]));
      const custom = $(".field--custom");
      chips.addEventListener("change", () => {
        const isCustom = $('input[name="amount"]:checked', chips)?.value === "custom";
        custom.hidden = !isCustom;
        $("#d-custom").required = isCustom;
        if (isCustom) $("#d-custom").focus();
      });
    }
    const purposes = $('[data-render="purposes"]');
    if (purposes) (d.purposes || []).forEach((p) => purposes.append(el("option", { value: p, text: p })));

    const qr = $("[data-qr]");
    if (qr && d.qrImage) qr.src = d.qrImage;
    const idEl = $("[data-upi-id]");
    if (idEl) idEl.textContent = d.upiId || "";
    const copyBtn = $("[data-copy-upi]");
    const status = $(".upi__status");
    if (copyBtn) copyBtn.addEventListener("click", async () => {
      const text = d.upiId || "";
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = el("textarea", { style: "position:fixed;opacity:0" }); ta.value = text;
        document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      copyBtn.textContent = "Copied ✓";
      status.textContent = "UPI ID copied: " + text;
      setTimeout(() => { copyBtn.textContent = "Copy"; status.textContent = ""; }, 2500);
    });
  }

  function renderContact() {
    const c = DATA.contact || {};
    const addr = $('[data-contact="address"]'); if (addr) addr.textContent = c.address || "";
    const phone = $('[data-contact="phone"]');
    if (phone) { phone.textContent = c.phoneDisplay || ""; phone.href = "tel:" + String(c.phoneDisplay || "").replace(/[^\d+]/g, ""); }
    const email = $('[data-contact="email"]');
    if (email) { email.textContent = c.email || ""; email.href = "mailto:" + (c.email || ""); }
    $$("[data-map]").forEach((f) => { if (c.mapEmbed) f.src = c.mapEmbed; });

    const sansthan = $("[data-sansthan-link]");
    if (sansthan && DATA.sansthanUrl) sansthan.href = DATA.sansthanUrl;

    const float = $("[data-wa-float]");
    if (float) float.href = waUrl("🙏 Jai Shri Ram. I have a query about Sankat Mochan Mandir, Mirzapur.");

    const year = $("[data-year]"); if (year) year.textContent = new Date().getFullYear();

    const dateInput = $("#v-date");
    if (dateInput) {
      const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      dateInput.min = t.toISOString().slice(0, 10);
    }
  }

  /* ---------- forms → WhatsApp ---------- */
  const FORMS = {
    visitor: {
      heading: "🙏 Visitor Enquiry – Sankat Mochan Mandir",
      build: (f) => [
        "Name: " + f.name, "Phone: " + f.phone,
        "Date of visit: " + (f.date ? formatDate(parseDate(f.date)) : ""),
        "No. of people: " + f.people, "Purpose: " + f.purpose,
        f.message && ("Message: " + f.message)
      ]
    },
    donation: {
      heading: "🙏 Donation – Sankat Mochan Mandir",
      build: (f) => {
        const amount = f.amount === "custom" ? f.custom : f.amount;
        return [
          f.status + " ₹" + Number(amount).toLocaleString("en-IN") + " for " + f.purpose + ".",
          "",
          "Name: " + f.name, "Phone: " + f.phone,
          "Amount: ₹" + Number(amount).toLocaleString("en-IN"), "Purpose: " + f.purpose,
          f.message && ("Message: " + f.message),
          f.status === "I have donated" ? "\n(Screenshot of payment attached below)" : ""
        ];
      }
    },
    contact: {
      heading: "🙏 Message – Sankat Mochan Mandir",
      build: (f) => ["Name: " + f.name, "Phone: " + f.phone, "Message: " + f.message]
    }
  };

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
  // Accepts 98765 43210, 9876543210, +91 98765-43210, 0919876543210
  function validPhone(value) {
    const d = String(value).replace(/\D/g, "").replace(/^0+/, "");
    return /^(91)?[6-9]\d{9}$/.test(d);
  }
  function validate(input) {
    const v = input.validity;
    let msg = "";
    if (v.valueMissing) msg = "This field is required.";
    else if (input.type === "tel" && !validPhone(input.value)) msg = "Please enter a valid 10-digit mobile number.";
    else if (v.rangeUnderflow) msg = input.type === "date" ? "Please choose today or a later date." : "Please enter a larger number.";
    else if (v.rangeOverflow) msg = "Please enter a smaller number.";
    else if (!v.valid) msg = "Please check this value.";
    fieldError(input, msg);
    return !msg;
  }

  function setupForms() {
    $$("[data-wa-form]").forEach((form) => {
      const cfg = FORMS[form.dataset.waForm];
      const inputs = () => $$("input:not([type=radio]), select, textarea", form).filter((i) => !i.closest("[hidden]"));
      form.addEventListener("input", (e) => { if (e.target.closest(".has-error")) validate(e.target); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const bad = inputs().filter((i) => !validate(i));
        if (bad.length) { bad[0].focus(); return; }
        const data = Object.fromEntries(new FormData(form).entries());
        Object.keys(data).forEach((k) => (data[k] = String(data[k]).trim()));
        const lines = [cfg.heading, ""].concat(cfg.build(data).filter((l) => l !== undefined && l !== null && l !== false));
        openWhatsApp(lines.join("\n").replace(/\n{3,}/g, "\n\n").trim());
      });
    });
  }

  /* ---------- navigation ---------- */
  function setupNav() {
    const toggle = $(".nav__toggle");
    const menu = $("#nav-menu");
    const close = () => { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) $("a", menu).focus();
    });
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".nav")) close(); });

    // scroll-spy: highlight the current section in the menu
    const links = $$('.nav__menu a[href^="#"]:not(.btn)');
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
        const a = map.get(en.target.id);
        if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- hero: "जय श्री राम" letter reveal ---------- */
  function setupLetterReveal() {
    const target = $("[data-reveal-letters]");
    if (!target) return;
    const text = target.textContent;
    // Split into grapheme clusters so Devanagari conjuncts (श्री) stay whole
    const parts = window.Intl && Intl.Segmenter
      ? Array.from(new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(text), (s) => s.segment)
      : text.split(/(\s+)/);
    target.textContent = "";
    target.setAttribute("aria-hidden", "true");
    target.parentElement.append(el("span", { class: "sr-only", text }));
    const spans = parts.map((p) => el("span", { class: "ch", text: p }));
    target.append(...spans);
    if (REDUCED) return;
    if (window.gsap) {
      window.gsap.from(spans, { opacity: 0, y: 24, filter: "blur(6px)", duration: .7, ease: "power2.out", stagger: .12, delay: .2 });
    } else {
      spans.forEach((s, i) => s.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 200 + i * 120, fill: "backwards", easing: "ease-out" }));
    }
  }

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (REDUCED) { items.forEach((i) => i.classList.add("is-visible")); return; }
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.set(items, { opacity: 0, y: 28 });
      window.ScrollTrigger.batch(items, {
        start: "top 88%", once: true,
        onEnter: (batch) => window.gsap.to(batch, { opacity: 1, y: 0, duration: .8, ease: "power2.out", stagger: .1, overwrite: true })
      });
      // hero entrance
      window.gsap.from(".hero__en, .hero__hi, .hero__lead, .hero__ctas", { opacity: 0, y: 20, duration: .8, stagger: .12, delay: .9, ease: "power2.out" });
      window.gsap.from(".hero__deity .arch", { opacity: 0, scale: .94, duration: 1.1, ease: "power2.out", delay: .3 });
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -10% 0px" });
    items.forEach((i) => io.observe(i));
  }

  /* ---------- hero: falling marigold petals (canvas) ---------- */
  function setupPetals() {
    const canvas = $(".hero__petals");
    if (!canvas || REDUCED || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;
    const COLORS = ["#E8751A", "#F29A2E", "#F2B233", "#D4A437", "#C85A12"];
    const COUNT = window.innerWidth < 640 ? 14 : 25;
    let w = 0, h = 0, dpr = 1, running = false, raf = 0, last = 0;
    const petals = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(p, initial) {
      p.x = Math.random() * w;
      p.y = initial ? Math.random() * h : -20;
      p.r = 5 + Math.random() * 6;
      p.vy = 18 + Math.random() * 30;
      p.sway = 12 + Math.random() * 24;
      p.phase = Math.random() * Math.PI * 2;
      p.rot = Math.random() * Math.PI;
      p.vr = (Math.random() - .5) * 1.6;
      p.c = COLORS[(Math.random() * COLORS.length) | 0];
      p.a = .55 + Math.random() * .35;
      return p;
    }
    function frame(t) {
      const dt = Math.min((t - last) / 1000 || 0, .05); last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.phase += dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        const x = p.x + Math.sin(p.phase) * p.sway;
        if (p.y > h + 20) spawn(p, false);
        ctx.save(); ctx.globalAlpha = p.a; ctx.translate(x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
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
    renderTimings();
    renderFamily();
    renderEvents();
    renderGallery();
    renderDonation();
    renderContact();
    setupForms();
    setupNav();
    setupLetterReveal();
    setupReveal();
    setupPetals();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
