  /* ===== Íconos SVG propios (trazo 1,8, color del tema). Reemplazan los símbolos de texto y emoji en toda la interfaz. ===== */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5V18M8.5 18h.01M12 18h.01"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    cube: '<path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7"/>',
    bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    ruler: '<path d="M3 17.5 17.5 3 21 6.5 6.5 21H3z"/><path d="M13.5 7l3.5 3.5M10.5 10l2 2M7.5 13l3.5 3.5"/>',
    panel: '<rect x="3" y="3.5" width="18" height="17" rx="2"/><path d="M7 8h4v4H7zM14.5 8.5h3M14.5 11.5h3M7 16h10"/>',
    grad: '<path d="M2 9.5 12 4.5l10 5-10 5z"/><path d="M6 11.5v5c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-5M22 9.5v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
    maximize: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    move: '<path d="M12 3v18M3 12h18M9.5 5.5 12 3l2.5 2.5M9.5 18.5 12 21l2.5-2.5M5.5 9.5 3 12l2.5 2.5M18.5 9.5 21 12l-2.5 2.5"/>',
    walk: '<circle cx="13" cy="4" r="2"/><path d="M10 22l2-7 3 3v4M8.5 12.5l2.5-4.5 4 1 2 3M11 8.5 9 13"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    layers: '<path d="M12 3 2 8l10 5 10-5z"/><path d="M2 13l10 5 10-5"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    ground: '<path d="M12 3v9M5 12h14M8 16h8M10.5 20h3"/>',
    chart: '<path d="M3 3v18h18"/><path d="M6.5 5c1.5 7 5 11 13.5 12"/>',
    hand: '<path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V10M11 10V4a1.5 1.5 0 0 1 3 0v6M14 10V5.5a1.5 1.5 0 0 1 3 0V11M17 11V8.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6.5 6.5 0 0 1-5.4-2.9L4 14.5a1.5 1.5 0 0 1 2.4-1.8L8 14.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    link: '<path d="M10 13.5a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10.5a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    pipe: '<path d="M4 3v9a7 7 0 0 0 7 7h10"/><path d="M8.5 3v9a2.5 2.5 0 0 0 2.5 2.5h10"/>',
    trash: '<path d="M4 7h16M9.5 7V4h5v3M6 7l1 13.5h10L18 7M10 11v6M14 11v6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>',
    gauge: '<path d="M3.5 18a9 9 0 1 1 17 0"/><path d="M12 15l4.5-5"/><circle cx="12" cy="15.5" r="1.4"/>',
    zoomin: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16M11 8v6M8 11h6"/>',
    zoomout: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16M8 11h6"/>',
    rotl: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6l-2.5 2.5"/><path d="M3.5 3.5v5h5"/>',
    rotr: '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6l2.5 2.5"/><path d="M20.5 3.5v5h-5"/>',
    up: '<path d="M5 4h14M12 20V8.5M7.5 13 12 8.5l4.5 4.5"/>',
    down: '<path d="M5 20h14M12 4v11.5M7.5 11l4.5 4.5 4.5-4.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    alert: '<path d="M12 3.5 2.5 20.5h19z"/><path d="M12 10v4.5M12 17.5h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.2L3 18l3 3 6.3-6.2a4 4 0 0 0 5.2-5.3l-2.6 2.6-2.3-.6-.6-2.3z"/>',
    save: '<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
    upload: '<path d="M12 20V9M7.5 13.5 12 9l4.5 4.5M5 4h14"/>',
    print: '<path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
    snow: '<path d="M12 2v20M4 7l16 10M4 17 20 7M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    square: '<rect x="4" y="4" width="16" height="16" rx="2.5" stroke-dasharray="3 3"/>',
    pot: '<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM2 10h2M20 10h2M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
  };
  const ico = (n, cls) => ICONS[n] ? '<svg class="ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[n] + "</svg>" : n;
  /* Símbolos antiguos → íconos, por contexto. */
  const GLY = { "⌂": "home", "①": "clipboard", "ƒ": "calc", "▦": "grid", "◈": "cube", "⎙": "file", "\xA7": "book", "⚡": "bolt", "\u{1F4D0}": "ruler", "\u{1FAB5}": "panel", "\u{1F393}": "grad", "\u{1F3AF}": "target", "▶": "play", "\u{1F50C}": "plug", "☀": "sun", "⏚": "ground", "⌇": "chart", "◧": "layers", "☰": "list" };
  const GLY_TPL = { "\u{1F4D0}": "ruler", "\u{1F3E0}": "home", "\u{1F373}": "pot", "\u2744": "snow", "\u25A2": "square", "\u270F": "pencil" };
  const LEAD = { "\u{1F4BE}": "save", "\u2B07": "download", "\u2B06": "upload", "\uFF0B": "plus", "\u2139\uFE0F": "info", "\u2139": "info", "\u26A1": "bolt", "\u{1F5A8}": "print", "\u29C9": "layers", "\u21BA": "undo", "\u25B6": "play", "\u{1F393}": "grad", "\u{1F3AF}": "target", "\u{1F3C5}": "check", "\u{1F9F0}": "wrench" };
  const GLY_SIM = { "↻": "hand", "+": "plus", "\u{1F517}": "link", "⌐": "pipe", "✕": "trash", i: "info", "⌁": "gauge", "◎": "target" };
  const GLY_NAV = { "✥": "move", "\u{1F6B6}": "walk", "⛶": "maximize", "✕": "x", "↶": "undo", "⚡": "bolt", "☰": "layers" };
  const NAV_SA = { zin: "zoomin", zout: "zoomout", rl: "rotl", rr: "rotr", up: "up", dn: "down" };
  function iconize(root) {
    const sw = (el, map) => {
      if (!el || el.firstElementChild) return;
      const t = el.textContent.trim(), n = map[t];
      if (n) el.innerHTML = ico(n);
    };
    root.querySelectorAll(".sim-tools .ic").forEach((el) => sw(el, GLY_SIM));
    root.querySelectorAll(".sim-nav .nbq .ic").forEach((el) => sw(el, GLY_NAV));
    root.querySelectorAll(".sim-nav .nb button[data-sa]").forEach((b) => {
      const n = NAV_SA[b.dataset.sa];
      if (n && !b.firstElementChild) b.innerHTML = ico(n);
    });
    root.querySelectorAll(".tabbar .ic, .mod .mi, .tile .ti, .side .k, .cuic, .demo-link span").forEach((el) => sw(el, GLY));
    root.querySelectorAll(".tpl .ti").forEach((el) => sw(el, GLY_TPL));
    root.querySelectorAll(".btn, .guia > summary, .card h2, .card h3").forEach((el) => {
      if (el.dataset.ico) return;
      el.dataset.ico = "1";
      const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!tn || tn !== el.firstChild && el.firstChild.nodeType !== 3) return;
      const t = tn.textContent.replace(/^\s+/, ""), k = Object.keys(LEAD).find((g) => t.startsWith(g));
      if (!k) return;
      tn.textContent = t.slice(k.length).replace(/^\s+/, "");
      const sp = document.createElement("span");
      sp.className = "lic";
      sp.innerHTML = ico(LEAD[k]);
      el.insertBefore(sp, tn);
    });
    const bb = document.getElementById("backBtn");
    if (bb && !bb.querySelector(".ico")) bb.innerHTML = ico("back") + '<span class="bt"> Volver</span>';
  }
  {
    let q = 0;
    new MutationObserver(() => {
      if (q) return;
      q = requestAnimationFrame(() => {
        q = 0;
        iconize(document.body);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
