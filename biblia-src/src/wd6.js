/* ============ SISTEMA DE DISEÑO · página interna de muestra (#sistema-diseno) ============
   Muestra los tokens vivos (cambian con el tema), la escala tipográfica, el espaciado, los íconos
   y los componentes base. El contraste de cada color se calcula en el navegador con la fórmula WCAG. */
const DS_AREAS = [["mat", "Matemáticas"], ["est", "Estadística"], ["io", "Investigación de operaciones"], ["prod", "Producción"], ["cal", "Calidad"], ["log", "Logística"], ["eco", "Economía"], ["ges", "Gestión"], ["prog", "Programación"], ["seg", "Seguridad"], ["car", "Carrera"], ["ref", "Referencia"]];
function extraPages(P){ P.push({ id:"sistema-diseno", g:"learn", t:"Sistema de diseño", d:"Tokens, tipografía, íconos y componentes de la app", r:pgSistema }); }
function pgSistema(){
  const sw = (v, n, on) => '<div class="ds-sw"><span class="ds-chip" style="background:var(' + v + ')"></span><span><b>' + n + '</b><code>' + v + '</code><small class="ds-cr" data-cr="' + v + '" data-on="' + (on || "--surface") + '"></small></span></div>';
  const sec = (t, h) => '<section class="ds-sec"><h2>' + t + "</h2>" + h + "</section>";
  let h = pg("Referencia · Uso interno", "Sistema de diseño", "Los valores que usa toda la app. Cambia el tema arriba a la derecha: los colores se recalculan y el contraste se mide en vivo (mínimo AA: 4,5:1 para texto normal).", "");
  h += sec("Color", '<h3>Marca y neutros</h3><div class="ds-grid">' + [["--brand", "Marca"], ["--ink", "Texto"], ["--ink-2", "Texto secundario fuerte"], ["--muted", "Texto atenuado"], ["--line2", "Borde fuerte", "--surface"], ["--line", "Borde"], ["--surface2", "Superficie 2"], ["--surface", "Superficie"], ["--bg", "Fondo"]].map(x => sw(x[0], x[1], x[2])).join("") + "</div>" +
    '<h3>Semánticos</h3><div class="ds-grid">' + [["--ok", "Correcto"], ["--warn", "Advertencia"], ["--bad", "Error"], ["--info", "Información"], ["--star", "Favorito"]].map(x => sw(x[0], x[1])).join("") + "</div>" +
    '<h3>Uno por área</h3><div class="ds-grid">' + DS_AREAS.map(a => sw("--a-" + a[0], a[1])).join("") + "</div>" +
    '<h3>Series de gráficos</h3><div class="ds-grid">' + [1, 2, 3, 4, 5, 6].map(i => sw("--cat-" + i, "Serie " + i)).join("") + "</div>");
  h += sec("Tipografía", '<p class="hint">Fuentes del sistema (sin descargas). Escala modular de razón 1,125 sobre 16 px.</p><div class="ds-type">' + [["--fs-6", "Título de portada"], ["--fs-5", "Título de página (h1)"], ["--fs-4", "h1 en celular"], ["--fs-3", "Cifra destacada"], ["--fs-2", "Sección (h2)"], ["--fs-1", "Subsección (h3)"], ["--fs-0", "Texto de lectura"], ["--fs--1", "Texto secundario y tablas"], ["--fs--2", "Etiquetas y leyendas"]].map(x => '<div class="ds-trow"><code>' + x[0] + '</code><span style="font-size:var(' + x[0] + ')">' + x[1] + "</span></div>").join("") + '<div class="ds-trow"><code>--f-mono</code><span class="mono">Q* = 1.342 unidades</span></div><div class="ds-trow"><code>--f-math</code><span class="mx">x̄ ± t · s ÷ √n</span></div></div>');
  h += sec("Espaciado, radios, sombras y movimiento", '<div class="ds-sp">' + [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(n => '<div><code>--sp-' + n + '</code><i style="width:var(--sp-' + n + ')"></i></div>').join("") + "</div>" +
    '<div class="ds-grid">' + [["--r-1", "4"], ["--r-2", "6"], ["--r-3", "8"], ["--r-4", "12"], ["--r-5", "16"], ["--r-full", "píldora"]].map(x => '<div class="ds-rad" style="border-radius:var(' + x[0] + ')"><code>' + x[0] + "</code></div>").join("") + "</div>" +
    '<div class="ds-grid">' + ["--sh-1", "--sh-2", "--sh-3"].map(x => '<div class="ds-rad" style="box-shadow:var(' + x + ')"><code>' + x + "</code></div>").join("") + "</div>" +
    '<p class="hint">Duraciones: <code>--dur-1</code> 150 ms (estados), <code>--dur-2</code> 200 ms (paneles), <code>--dur-3</code> 250 ms (navegación). Con «reducir movimiento» activado en el sistema, se desactivan.</p>');
  h += sec("Íconos", '<p class="hint">Un solo set de línea: 24 × 24, trazo 1,7, extremos redondeados. Se definen una vez como &lt;symbol&gt; y se reutilizan con &lt;use&gt;.</p><div class="ds-icons">' + Object.keys(SVGP).sort().map(k => '<div>' + svgIco(k) + "<code>" + esc(k) + "</code></div>").join("") + "</div>");
  h += sec("Componentes", '<div class="quick"><button class="btn" type="button">Principal</button><button class="btn ghost" type="button">Secundario</button><button class="btn small" type="button">' + svgIco("descargar") + 'Pequeño</button><button class="chip" type="button">Filtro</button><button class="chip" type="button" aria-pressed="true">Filtro activo</button></div>' +
    '<p><span class="pill ok">Cumple</span> <span class="pill warn">Revisar</span> <span class="pill bad">Fuera de control</span> <span class="pill info">Dato</span></p>' +
    kpis([kpi("Lote económico", "1.342", "u", "hi"), kpi("Costo total", "$ 4.820.000"), kpi("Pedidos al año", "8,9")]) +
    note("Aviso de advertencia: úsalo solo para errores comunes o riesgos.") + note("Aviso informativo.", "info") +
    table(["Indicador", "Valor", "Meta"], [["OEE", "75 %", "85 %"], ["OTIF", "92 %", "95 %"]], { num:[1, 2] }) +
    '<div class="field" style="max-width:320px"><label for="ds-in">Demanda anual <span class="unit">(unidades)</span></label><input id="ds-in" type="text" inputmode="decimal" value="12.000"><small>Ayuda breve bajo el campo.</small></div>');
  return h;
}
function dsContrast(root){
  const rgb = s => { const m = String(s).match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; };
  const L = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const [r, g, b] = c.map(f); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const probe = document.createElement("span"); root.appendChild(probe);
  const col = v => { probe.style.color = "var(" + v + ")"; return rgb(getComputedStyle(probe).color); };
  root.querySelectorAll("[data-cr]").forEach(el => { const a = L(col(el.dataset.cr)), b = L(col(el.dataset.on)), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    el.textContent = "Contraste sobre superficie: " + r.toFixed(2).replace(".", ",") + ":1" + (r >= 4.5 ? " · AA" : r >= 3 ? " · solo AA grande" : " · decorativo"); });
  probe.remove(); }
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#themeBtn")) setTimeout(() => { const r = document.getElementById("app"); if (r && r.querySelector("[data-cr]")) dsContrast(r); }, 60); });
