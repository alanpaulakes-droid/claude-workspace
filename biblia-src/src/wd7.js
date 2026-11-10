/* ============ F2 · LAYOUT TIPO APP ============
   Búsqueda en hoja (botón del encabezado, Ctrl+K o «/»), menú lateral colapsable en escritorio,
   índice «En esta página» con scroll-spy y transición breve al cambiar de página. */

/* ---------- Menú lateral colapsable (escritorio) ---------- */
function sideCollapse(off){ document.body.classList.toggle("side-off", off); const b = document.getElementById("menuBtn");
  if (b && window.matchMedia("(min-width:901px)").matches) { b.setAttribute("aria-expanded", String(!off)); b.setAttribute("aria-label", off ? "Mostrar el menú lateral" : "Ocultar el menú lateral"); }
  try { localStorage.setItem(KEY + "-sideoff", off ? "1" : "0"); } catch (e) {} }
try { if (localStorage.getItem(KEY + "-sideoff") === "1") document.body.classList.add("side-off"); } catch (e) {}

/* ---------- Hoja de búsqueda ---------- */
let SRCH_RET = null;
function searchOpen(on){ const sh = document.getElementById("searchSheet"); if (!sh) return;
  if (on) { SRCH_RET = document.activeElement; sh.hidden = false; document.body.classList.add("sheet-open"); const i = document.getElementById("gsearch3"); if (i) { i.value = ""; document.getElementById("gsres3").innerHTML = ""; setTimeout(() => i.focus(), 30); } }
  else { sh.hidden = true; document.body.classList.remove("sheet-open"); if (SRCH_RET && SRCH_RET.focus) try { SRCH_RET.focus({ preventScroll:true }); } catch (e) {} } }
document.addEventListener("click", e => { if (!e.target.closest) return;
  if (e.target.closest("#searchBtn")) { searchOpen(true); return; }
  if (e.target.closest("#searchClose")) { searchOpen(false); return; }
  const sh = document.getElementById("searchSheet");
  if (sh && !sh.hidden) { if (e.target === sh) searchOpen(false); else if (e.target.closest("#gsres3 [data-go]")) { SRCH_RET = null; searchOpen(false); } } });
document.addEventListener("keydown", e => {
  const sh = document.getElementById("searchSheet"), typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
  if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); searchOpen(sh && sh.hidden); return; }
  if (e.key === "/" && !typing && sh && sh.hidden) { e.preventDefault(); searchOpen(true); return; }
  if (e.key === "Escape" && sh && !sh.hidden) { searchOpen(false); return; }
  if (e.key === "Enter" && e.target && e.target.id === "gsearch3") { const f = document.querySelector("#gsres3 [data-go]"); if (f) f.click(); } });

/* ---------- Índice «En esta página» con scroll-spy ---------- */
let TOC_IO = null;
const tocSlug = (t, i) => "s-" + String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) + "-" + i;
function tocBuild(root){ const box = document.getElementById("toc"); if (!box) return; if (TOC_IO) { TOC_IO.disconnect(); TOC_IO = null; }
  const hs = [...root.querySelectorAll("h2")].filter(h => !h.closest("details:not([open]),.sheet,.c-card,.doc,.sw,[hidden]") && h.textContent.trim());
  if (hs.length < 3) { box.innerHTML = ""; document.body.classList.remove("has-toc"); return; }
  hs.forEach((h, i) => { if (!h.id) h.id = tocSlug(h.textContent, i); });
  box.innerHTML = '<p class="toc-h">En esta página</p><ol>' + hs.map(h => { const c = h.cloneNode(true); c.querySelectorAll(".cnt,.t8-n,.favb,svg").forEach(x => x.remove());
    return '<li><button type="button" data-toc="' + h.id + '">' + esc(c.textContent.trim()) + "</button></li>"; }).join("") + "</ol>";
  document.body.classList.add("has-toc");
  if (!("IntersectionObserver" in window)) return;
  const btn = id => box.querySelector('[data-toc="' + id + '"]'), vis = new Set();
  TOC_IO = new IntersectionObserver(es => { es.forEach(en => en.isIntersecting ? vis.add(en.target.id) : vis.delete(en.target.id));
    const first = hs.find(h => vis.has(h.id)); if (!first) return; box.querySelectorAll("[aria-current]").forEach(b => b.removeAttribute("aria-current")); const b = btn(first.id); if (b) b.setAttribute("aria-current", "true"); }, { rootMargin:"-72px 0px -60% 0px" });
  hs.forEach(h => TOC_IO.observe(h)); }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-toc]"); if (!b) return; const h = document.getElementById(b.dataset.toc); if (!h) return;
  h.scrollIntoView({ behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" }); });

/* ---------- Transición de entrada de página ---------- */
function pageEnter(root){ root.classList.remove("enter"); void root.offsetWidth; root.classList.add("enter"); }
