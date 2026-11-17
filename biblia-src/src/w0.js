/* ============ EXPLICACIONES COMPLETAS DENTRO DE LOS MENÚS (se agregan al final de cada sección) ============ */
const EXP = {};
const xpNorm = s => String(s).replace(/\s+/g, " ").trim().replace(/^\d+\.\s*/, "").toLowerCase();
const XP = (id, o) => { EXP[id] = EXP[id] || {}; Object.keys(o).forEach(k => { EXP[id][xpNorm(k)] = o[k]; }); };
const XB = o => { let h = '<div class="deep xp">';
  if (o.d) h += '<div class="deep-b"><h4>Explicado en detalle, desde cero</h4>' + o.d + "</div>";
  if (o.k) h += '<div class="deep-b"><h4>Cómo se hace, paso a paso</h4><ol class="deep-steps">' + o.k.map(x => "<li>" + x + "</li>").join("") + "</ol></div>";
  if (o.e) h += '<div class="deep-b ejr"><h4>Ejemplo concreto</h4>' + o.e + "</div>";
  if (o.x) h += '<div class="deep-b"><h4>Errores comunes</h4><ul>' + o.x.map(x => "<li>" + x + "</li>").join("") + "</ul></div>";
  if (o.t) h += '<div class="deep-b use"><h4>Consejo práctico</h4><p>' + o.t + "</p></div>";
  return h + "</div>"; };
function expandHTML(id, html){ const E = EXP[id]; if (!E || !html) return html; const t = document.createElement("template"); t.innerHTML = html;
  t.content.querySelectorAll("details").forEach(d => { const s = d.querySelector(":scope > summary"); if (!s) return; const x = E[xpNorm(s.textContent)]; if (!x) return; const body = d.querySelector(":scope > .body") || d; body.insertAdjacentHTML("beforeend", x); });
  return t.innerHTML; }
