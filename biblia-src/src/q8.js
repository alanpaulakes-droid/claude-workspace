/* ============ ISHIKAWA: CATEGORÍAS EDITABLES AGRUPADAS CON SUS CAUSAS ============ */
function ishiUI(root){ const g = root.querySelector('[data-c="ishikawa"][data-k="n1"]'); if (!g) return; const grid = g.closest(".grid"); if (!grid || grid.dataset.ishi) return; grid.dataset.ishi = "1";
  for (let k = 1; k <= 8; k++) { const n = grid.querySelector('[data-c="ishikawa"][data-k="n' + k + '"]'), m = grid.querySelector('[data-c="ishikawa"][data-k="m' + k + '"]'); if (!n || !m) continue;
    const fn = n.closest(".field"), fm = m.closest(".field"), box = document.createElement("div"); box.className = "field ishi-cat";
    box.innerHTML = '<span class="flab">Espina ' + k + (k > 6 ? " (opcional)" : "") + '</span>'; n.placeholder = "Nombre de la categoría"; n.setAttribute("aria-label", "Nombre de la categoría " + k); m.placeholder = "Una causa por línea"; m.setAttribute("aria-label", "Causas de la categoría " + k);
    box.appendChild(n); box.appendChild(m); fn.replaceWith(box); fm.remove(); }
  const hint = document.createElement("div"); hint.className = "hint"; hint.style.cssText = "grid-column:1/-1;margin:0"; hint.innerHTML = "Cada recuadro es una espina del pescado: arriba su <b>nombre</b> (puedes cambiarlo) y abajo sus <b>causas</b>, una por línea. Deja vacía una espina si no la necesitas: no se dibuja.";
  const first = grid.querySelector(".ishi-cat"); if (first) grid.insertBefore(hint, first); }
document.addEventListener("change", e => { const t = e.target; if (!t.matches || !t.matches('[data-c="ishikawa"][data-k="pre"]')) return; const P = ISHI_PRE.find(x => x[0] === t.value); if (!P || !P[2]) return;
  for (let k = 1; k <= 8; k++) { const n = document.querySelector('[data-c="ishikawa"][data-k="n' + k + '"]'); if (!n) continue; n.value = P[2][k - 1] || ""; n.dispatchEvent(new Event("input", { bubbles:true })); n.dispatchEvent(new Event("change", { bubbles:true })); } });
