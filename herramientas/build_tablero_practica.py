"""Genera TABLERO_PRACTICA_RIC.html (versión liviana para teléfono) a partir de CALCULADORA_RIC.html.
Incluye: armar tablero, pared de práctica 3D, planos/diagramas/materiales y calculadoras básicas.
Uso: python3 herramientas/build_tablero_practica.py
"""
import os
R = os.path.join(os.path.dirname(__file__), "..")
src = open(os.path.join(R, "CALCULADORA_RIC.html"), encoding="utf-8").read()

def rep(a, b):
    global src
    assert src.count(a) == 1, (a[:80], src.count(a))
    src = src.replace(a, b)

rep("<title>Calculadora RIC Domiciliaria</title>", "<title>Tablero de práctica RIC</title><meta name=\"apple-mobile-web-app-capable\" content=\"yes\"><meta name=\"mobile-web-app-capable\" content=\"yes\"><meta name=\"theme-color\" content=\"#b8621b\">")
rep('<button class="brand" type="button" data-go="home">Calculadora <b>RIC</b> Domiciliaria</button>', '<button class="brand" type="button" data-go="home">Tablero de práctica <b>RIC</b></button>')
rep('const KEY = "ric-calc-v3";', 'const KEY = "ric-tablero-practica-v1";')
rep("</style>\n", "body.lite .gsw,body.lite [data-pn=\"close\"]{display:none!important}\n</style>\n")
LITE = r'''
  {
    document.body.classList.add("lite");
    const keep = new Set(["home", "tg", "sim", "pan", "hub_calc", "t_corriente", "t_ohm", "t_potencias", "t_caida", "t_mom", "t_conductor", "t_proteccion", "t_curvas", "demo"]);
    for (let i = PAGES.length - 1; i >= 0; i--) if (!keep.has(PAGES[i].id)) PAGES.splice(i, 1);
    Object.keys(GROUPS).forEach((k) => {
      if (!PAGES.some((p) => p.g === k)) delete GROUPS[k];
    });
    GROUPS.plan = "Tablero";
    GROUPS.taller = "Pared de pr\xE1ctica";
    TABS.splice(0, TABS.length, ["home", "⌂", "Inicio"], ["tg", "▦", "Tablero"], ["sim", "◈", "3D"], ["pan", "\u{1F4D0}", "Planos"], ["hub_calc", "ƒ", "C\xE1lculos"]);
    tabOf = (id) => id === "home" ? "home" : ["tg", "sim", "pan"].includes(id) ? id : "hub_calc";
    PAGES.find((p) => p.id === "sim").t = "Pared de pr\xE1ctica 3D";
    {
      const ps = PAGES.find((p) => p.id === "sim"), r0 = ps.r;
      ps.r = () => r0().replace("Taller 3D de instalaci\xF3n domiciliaria", "Pared de pr\xE1ctica 3D").replace("\u26A1 Juego: armar tablero", "\u25A6 Armar tablero").replace(/<p class="lead">[^<]*/, '<p class="lead">Toca <b>Colocar</b> y luego la madera para instalar cada componente; con\xE9ctalos con <b>Conectar</b> y ajusta los tubos con <b>Ducto</b>. Tu tablero dise\xF1ado aparece a la izquierda.');
    }
    PAGES.find((p) => p.id === "pan").t = "Planos, diagramas y materiales";
    PAGES.find((p) => p.id === "home").r = () => '<p class="eyebrow">Pliegos RIC \xB7 SEC Chile</p><h1>Tablero de pr\xE1ctica</h1><p class="lead">Arma el tablero, p\xE1salo a la pared de pr\xE1ctica en 3D, instala y comprueba los circuitos, y obt\xE9n el plano, los diagramas y el listado de materiales.</p><div class="mods">' + [["tg", "▦", "1 \xB7 Armar tablero", "General, diferenciales, autom\xE1ticos, barras, peine y cables, con revisi\xF3n RIC N\xB002"], ["sim", "◈", "2 \xB7 Pared de pr\xE1ctica 3D", "Cajas, tubos y codos, interruptores 9/12 a 9/32, portal\xE1mparas y enchufes; comprobar"], ["pan", "\u{1F4D0}", "3 \xB7 Planos y materiales", "Plano de la pared, unilineal, multilineal y listado de materiales con precios"], ["hub_calc", "ƒ", "Calculadoras", "Corriente, Ohm, potencias, ca\xEDda de tensi\xF3n, conductor y protecciones"]].map(([id, ic, t, d]) => '<button class="mod" type="button" data-go="' + id + '"><span class="mi">' + ic + '</span><span class="mt">' + t + '</span><span class="md">' + d + "</span></button>").join("") + "</div>" + learn("C\xF3mo se usa", '<ol class="hand"><li>En <b>Armar tablero</b> elige \xABDise\xF1o libre\xBB, agrega tus circuitos, coloca las piezas y cabl\xE9alas. Toca <b>Comprobar</b>.</li><li>Toca <b>◈ Pasar este tablero al Simulador 3D</b>: aparece en la pared de pr\xE1ctica.</li><li>En el 3D usa <b>Colocar</b> (toca la madera), <b>Conectar</b> y <b>Ducto</b>. O toca <b>＋ Agregar lo pedido</b>.</li><li>Toca <b>✔ Comprobar</b> y revisa el resultado.</li><li>En <b>Planos</b> ver\xE1s el plano de la pared, el unilineal, el multilineal y los materiales; puedes imprimirlos o guardarlos como PDF.</li></ol><p class="hint">Todo se guarda en este navegador. Funciona sin internet.</p>');
    simPV.lamp = "pm";
    if (!isPan(S.sim2)) {
      S.sim2 = S.panSim || panBlank();
      delete S.panSim;
      save();
    }
    const _sp = simPanel;
    simPanel = function() {
      return _sp.apply(this, arguments).replace(/<section class="card"><h2>(Plantillas|Misiones|Examen pr\xE1ctico|Desaf\xEDo: encuentra la falla)[\s\S]*?<\/section>/g, "");
    };
    if (!PAGES.some((p) => p.id === cur)) cur = "home";
  }
  render();
})();
'''
rep("\n  render();\n})();\n", LITE)
out = os.path.join(R, "TABLERO_PRACTICA_RIC.html")
open(out, "w", encoding="utf-8").write(src)
print(out, len(src))
