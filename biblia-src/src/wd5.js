/* ============ MALLA: RAMOS QUE SE DICTAN EN VARIOS TRIMESTRES ============
   Verificado con la malla oficial UNAB Advance de Ingeniería Industrial (PDF publicado en 2026, «malla sujeta a modificaciones»):
   Inglés I, II, III y IV se dictan en los trimestres 3, 4, 5 y 6. En la app es un solo ramo que aparece en esos cuatro trimestres. */
function inTri(c, t){ return c.tri === t || (!!c.tris && c.tris.indexOf(t) >= 0); }
function triName(c, t){ return c.lv && c.lv[t] ? c.lv[t] : c.t; }
(() => { const ci = COURSES.find(c => c.id === "ramo-ingles"); if (ci) { ci.tris = [3, 4, 5, 6]; ci.lv = { 3:"Inglés I (inglés técnico)", 4:"Inglés II (inglés técnico)", 5:"Inglés III (inglés técnico)", 6:"Inglés IV (inglés técnico)" }; } })();
