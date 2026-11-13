/* ============ F4 · DIAGRAMAS: accesibilidad, legibilidad y tooltips ============
   Se aplica a todos los SVG de la página después de dibujarla (no cambia el texto que generan las calculadoras):
   - <title> y <desc> en cada diagrama, enlazados con aria-labelledby;
   - escala mínima para que ningún texto se vea bajo 12 px (si no cabe, el diagrama se desplaza en horizontal);
   - tooltip propio para puntos y barras con data-tip (mouse, teclado y toque). */
let SVGN = 0;
function svgA11y(root){
  root.querySelectorAll("svg").forEach(s => { if (s.classList.contains("icon") || s.id === "icoSprite" || s.closest(".mblk,.mx")) return;
    const vb = s.viewBox && s.viewBox.baseVal, vw = vb && vb.width;
    if (!s.getAttribute("role")) s.setAttribute("role", "img");
    if (!s.querySelector(":scope > title")) { const fig = s.closest("figure"), cap = fig && fig.querySelector("figcaption"), lab = s.getAttribute("aria-label") || (cap && cap.textContent.trim().split(/[.:]/)[0]) || "Diagrama";
      const n = ++SVGN, t = document.createElementNS("http://www.w3.org/2000/svg", "title"), d = document.createElementNS("http://www.w3.org/2000/svg", "desc");
      t.id = "svt" + n; t.textContent = lab; d.id = "svd" + n; d.textContent = svgDesc(s, cap, lab); s.insertBefore(d, s.firstChild); s.insertBefore(t, s.firstChild);
      s.setAttribute("aria-labelledby", t.id + " " + d.id); s.removeAttribute("aria-label"); }
    /* legibilidad: el texto base mide 13 unidades; con escala ≥ 0,93 se ve a 12 px o más */
    if (!s.dataset.w) s.querySelectorAll("text,tspan").forEach(t => { const fs = parseFloat(t.style.fontSize || t.getAttribute("font-size") || 0); if (fs && fs < 13) { t.style.fontSize = "13px"; t.removeAttribute("font-size"); } });
    if (vw && s.dataset.w && s.getBoundingClientRect().width && s.getBoundingClientRect().width < vw - 1) s.style.minWidth = vw + "px";  /* gráfico en un contenedor más angosto: se desplaza en vez de achicarse */
    if (vw && !s.dataset.w && !s.closest(".tile,.mod,.area-art")) { const min = Math.round(vw * 0.93); if (!s.style.minWidth || parseFloat(s.style.minWidth) < min) s.style.minWidth = min + "px"; } });
}
function svgDesc(s, cap, lab){
  const pts = s.querySelectorAll(".pt").length, bad = s.querySelectorAll(".pt.db").length, bars = s.querySelectorAll("rect.bar1,rect.bar2,rect.bar3").length, refs = [...s.querySelectorAll("text.lg")].map(t => t.textContent.trim()).filter(Boolean);
  const parts = [];
  if (pts) parts.push(pts + " puntos" + (bad ? ", " + bad + " fuera de control" : ""));
  if (bars) parts.push(bars + " barras");
  if (refs.length) parts.push("líneas de referencia: " + refs.slice(0, 6).join(", "));
  const c = cap ? cap.textContent.trim() : ""; return (c && c !== lab ? c + " " : "") + (parts.length ? parts.join("; ") + "." : "");
}
/* tooltip */
let TIP = null;
function tipShow(el, x, y){ if (!TIP) { TIP = document.createElement("div"); TIP.className = "ctip"; TIP.setAttribute("role", "tooltip"); document.body.appendChild(TIP); }
  TIP.textContent = el.dataset.tip; TIP.hidden = false; const r = TIP.getBoundingClientRect(), vw = document.documentElement.clientWidth;
  TIP.style.left = Math.max(8, Math.min(vw - r.width - 8, x - r.width / 2)) + "px"; TIP.style.top = Math.max(8, y - r.height - 12) + "px"; el.classList.add("hot"); }
function tipHide(){ if (TIP) TIP.hidden = true; document.querySelectorAll("#app .hot").forEach(e => e.classList.remove("hot")); }
document.addEventListener("pointerover", e => { const el = e.target.closest && e.target.closest("#app svg [data-tip]"); if (!el) return; tipHide(); tipShow(el, e.clientX, e.clientY); });
document.addEventListener("pointerout", e => { if (e.target.closest && e.target.closest("#app svg [data-tip]")) tipHide(); });
document.addEventListener("scroll", tipHide, { passive:true });
/* al girar el celular o cambiar mucho el ancho, los gráficos se vuelven a dibujar a la nueva medida */
let RSZ = null, RSW = 0;
window.addEventListener("resize", () => { clearTimeout(RSZ); RSZ = setTimeout(() => { const a = document.getElementById("app"); if (!a || !a.querySelector("svg[data-w]")) return; const w = a.clientWidth;
  if (RSW && Math.abs(w - RSW) / RSW > 0.15 && typeof render === "function") render(true); RSW = w; }, 350); });

/* ---------- Rótulos diferidos (data-t) y diagramas dibujados al mostrar la página ---------- */
const SVGNS = "http://www.w3.org/2000/svg";
function fillDataText(root){ root.querySelectorAll("svg text[data-t]").forEach(t => { if (t.firstChild) return; const n = +t.dataset.w || 0, L = n ? dgWrap(t.dataset.t, n).slice(0, 2) : [t.dataset.t];
  if (L.length === 1) { t.textContent = L[0]; return; } const y = +t.getAttribute("y"), x = t.getAttribute("x");
  L.forEach((l, i) => { const s = document.createElementNS(SVGNS, "tspan"); s.setAttribute("x", x); s.setAttribute("y", y + (i - (L.length - 1) / 2) * 15); s.textContent = l; t.appendChild(s); }); }); }
function drawVsm(fig){ let d; try { d = JSON.parse(fig.dataset.vsm); } catch (e) { return; } const P = d.P || []; if (!P.length || fig.querySelector("svg")) return;
  const bw = 138, iw = 64, step = bw + iw, W = 24 + P.length * step + 150, H = 300, yb = 92, bh = 96, f1 = v => nf(v, v < 10 ? 1 : 0);
  let g = '<defs><marker id="vsa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="dgah"/></marker></defs>';
  let tx = 24, ladder = [], LT = 0, VA = 0;
  P.forEach((p, i) => { const days = d.dd ? p[2] / d.dd : 0, x = tx + iw, cx = tx + iw / 2; LT += days; VA += p[1];
    g += '<path d="M' + (cx - 20) + "," + (yb + 74) + " L" + cx + "," + (yb + 38) + " L" + (cx + 20) + "," + (yb + 74) + ' Z" class="vsm-inv"/><text x="' + cx + '" y="' + (yb + 68) + '" text-anchor="middle" class="vsm-i">I</text><text x="' + cx + '" y="' + (yb + 92) + '" text-anchor="middle" class="mu">' + n0(p[2]) + "</text>";
    g += '<g data-tip="' + esc(p[0] + ": ciclo " + nf(p[1], 0) + " s" + (p[1] > d.takt ? " (sobre el takt)" : "") + " · " + p[3] + " operario(s)") + '"><rect x="' + x + '" y="' + yb + '" width="' + (bw - 20) + '" height="' + bh + '" rx="10" class="vsm-p' + (p[1] > d.takt ? " over" : "") + '"/><path d="M' + x + "," + (yb + 30) + "h" + (bw - 20) + '" class="cpm-l"/>' +
      '<text x="' + (x + (bw - 20) / 2) + '" y="' + (yb + 20) + '" text-anchor="middle" class="vsm-n">' + esc(String(p[0]).slice(0, 14)) + '</text><text x="' + (x + 10) + '" y="' + (yb + 52) + '" class="mu">C/T ' + nf(p[1], 0) + ' s</text><text x="' + (x + 10) + '" y="' + (yb + 72) + '" class="mu">Operarios ' + p[3] + "</text></g>";
    if (i < P.length - 1) g += '<line class="vsm-push" x1="' + (x + bw - 18) + '" y1="' + (yb + bh / 2) + '" x2="' + (x + bw + iw - 22) + '" y2="' + (yb + bh / 2) + '" marker-end="url(#vsa)"/>';
    ladder.push([tx, x, x + bw - 20, days, p[1]]); tx += step; });
  const yL = 236, yH = 268; let path = "M" + 24 + "," + yL;
  ladder.forEach(l => { path += " L" + l[1] + "," + yL + " L" + l[1] + "," + yH + " L" + l[2] + "," + yH + " L" + l[2] + "," + yL; g += '<text x="' + (l[0] + iw / 2) + '" y="' + (yL - 8) + '" text-anchor="middle" class="mu">' + f1(l[3]) + ' d</text><text x="' + ((l[1] + l[2]) / 2) + '" y="' + (yH + 18) + '" text-anchor="middle" class="mu">' + nf(l[4], 0) + " s</text>"; });
  g += '<path d="' + path + '" class="vsm-lad"/>';
  const sx = tx + 20; g += '<rect x="' + sx + '" y="' + (yL - 22) + '" width="128" height="84" rx="10" class="vsm-sum"/><text x="' + (sx + 12) + '" y="' + yL + '" class="mu">Lead time</text><text x="' + (sx + 12) + '" y="' + (yL + 20) + '" class="vsm-big">' + nf(LT, 1) + ' días</text><text x="' + (sx + 12) + '" y="' + (yL + 42) + '" class="mu">Valor agregado ' + nf(VA, 0) + " s</text>";
  g += '<text x="24" y="28" class="vsm-n">Flujo de valor: proveedor → cliente</text><text x="24" y="48" class="mu">Takt ' + nf(d.takt, 1) + " s · demanda " + n0(d.dd) + " unid/día · los procesos sobre el takt se marcan en cobre</text>";
  fig.querySelector(".sv").innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Mapa de flujo de valor (VSM)" style="min-width:' + Math.round(W * 0.93) + 'px">' + g + "</svg>";
  if (!fig.querySelector("figcaption")) fig.insertAdjacentHTML("beforeend", "<figcaption>Triángulos: inventario que espera antes de cada proceso (en unidades). Escalera: arriba, días de espera; abajo, segundos que agregan valor. La diferencia entre ambos es el desperdicio que ataca Lean.</figcaption>"); }
/* red CPM: resaltar ruta crítica y dependencias */
function cpmUI(fig){ if (fig.querySelector(".cpm-tb")) return; fig.insertAdjacentHTML("afterbegin", '<div class="cpm-tb no-print"><button class="chip" type="button" aria-pressed="false" data-cpmcrit="1">Resaltar ruta crítica</button><span class="hint">Pasa el puntero o toca una actividad para ver de qué depende.</span></div>'); }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-cpmcrit]"); if (!b) return; const f = b.closest("figure"), on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); f.classList.toggle("crit-only", on); });
function cpmHi(n, on){ const svg = n.closest("svg"), id = n.dataset.n; svg.classList.toggle("hov", on); svg.querySelectorAll(".cpm-e").forEach(e => { const r = on && (e.dataset.a === id || e.dataset.b === id); e.classList.toggle("nb", r); if (r) svg.querySelectorAll('.cpm-n[data-n="' + CSS.escape(e.dataset.a === id ? e.dataset.b : e.dataset.a) + '"]').forEach(x => x.classList.add("nb")); }); n.classList.toggle("nb", on); if (!on) svg.querySelectorAll(".nb").forEach(x => x.classList.remove("nb")); }
document.addEventListener("pointerover", e => { const n = e.target.closest && e.target.closest("#app .cpm-n"); if (n) cpmHi(n, true); });
document.addEventListener("pointerout", e => { const n = e.target.closest && e.target.closest("#app .cpm-n"); if (n) cpmHi(n, false); });
function diagramsAfter(root){ fillDataText(root); root.querySelectorAll("figure.vsm-map").forEach(drawVsm); root.querySelectorAll("figure.cpmnet").forEach(cpmUI); }
