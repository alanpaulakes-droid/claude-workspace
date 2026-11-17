/* ============ RAMOS: EXPLICACIÓN DESDE CERO DE CADA UNIDAD ============ */
const UZ = {}, CG = {};
const goBtn = id => (typeof C !== "undefined" && C[id]) ? '<button class="chip" type="button" data-go="' + id + '">' + C[id].t + "</button>" : "";
function deepHTML(z){
  let h = '<div class="deep">';
  if (z.p) h += '<div class="deep-b why"><h4>¿Por qué necesitas esto?</h4>' + z.p + "</div>";
  if (z.an) h += '<div class="deep-b"><h4>Una comparación para entenderlo</h4><p>' + z.an + "</p></div>";
  if (z.s) h += '<div class="deep-b"><h4>Explicado desde cero</h4>' + z.s + "</div>";
  if (z.s2) h += '<div class="deep-b"><h4>Más a fondo, paso a paso</h4>' + z.s2 + "</div>";
  if (z.t) h += '<div class="deep-b"><h4>Términos y símbolos que debes conocer</h4><dl class="deep-dl">' + z.t.map(t => "<dt>" + t[0] + "</dt><dd>" + t[1] + "</dd>").join("") + "</dl></div>";
  if (z.k) h += '<div class="deep-b"><h4>Paso a paso</h4><ol class="deep-steps">' + z.k.map(k => "<li>" + k + "</li>").join("") + "</ol></div>";
  if (z.e) h += '<div class="deep-b ejr"><h4>Ejemplo resuelto, explicando cada paso</h4>' + z.e + "</div>";
  if (z.e2) h += '<div class="deep-b ejr"><h4>' + (z.e ? "Otro ejemplo resuelto" : "Ejemplo resuelto, explicando cada paso") + "</h4>" + z.e2 + "</div>";
  if (z.x) h += '<div class="deep-b"><h4>Errores comunes (y cómo evitarlos)</h4><ul>' + z.x.map(x => "<li>" + x + "</li>").join("") + "</ul></div>";
  if (z.u) h += '<div class="deep-b use"><h4>Cómo practicarlo con este programa</h4>' + z.u + "</div>";
  if (z.q) h += '<div class="deep-b"><h4>Ponte a prueba</h4>' + z.q.map(q => '<details class="bg-q"><summary>' + q[0] + "</summary><p>" + q[1] + "</p></details>").join("") + "</div>";
  return h + "</div>";
}
/* Amplía las unidades de un ramo sin borrar lo existente: agrega campos nuevos y suma términos y errores */
function zMore(id, arr){ UZ[id] = UZ[id] || []; arr.forEach((n, i) => { if (!n) return; const o = UZ[id][i] = UZ[id][i] || {}; Object.keys(n).forEach(k => { if (k === "t" || k === "x" || k === "q") o[k] = (o[k] || []).concat(n[k]); else if (k === "k" && o.k) return; else o[k] = n[k]; }); }); }
