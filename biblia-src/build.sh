#!/bin/bash
# Compila la Biblia: une los módulos de src/ en un solo HTML autocontenido.
# Uso: bash biblia-src/build.sh [--test]
set -e
D="$(cd "$(dirname "$0")" && pwd)"; cd "$D/src"
FILES="p1.html p2.js x1.js x2.js x4.js p3.js p4.js p5.js p6.js p6b.js px.js g1.js g2.js g3.js g4.js g5.js $(ls e[0-9].js) p7.js x3.js m1.js m2.js m3.js m4.js $(ls i[0-9].js) $(ls c[0-9].js) z0.js $(ls z[1-9].js 2>/dev/null) $(ls u[0-9].js) $(ls s[0-9].js) $(ls d[0-9].js) $(ls f[0-9].js) $(ls o[0-9].js) $(ls q[0-9].js) $(ls v[0-9].js) $(ls y[0-9].js) $(ls w[0-9].js) $(ls wa[0-9].js 2>/dev/null) $(ls wb[0-9].js 2>/dev/null) $(ls wc[0-9].js 2>/dev/null) $(ls wd[0-9].js 2>/dev/null) $(ls we[0-9].js 2>/dev/null) p8.js"
mkdir -p "$D/build"
# F6 · Contenido diferido: los módulos que solo cargan guías, ejemplos, apuntes de ramos, expansiones y bloques T2
# se envuelven en __lazyContent() (en su orden original) y se ejecutan después del primer render o antes de
# mostrar una página que los necesite (ensureContent en p8.js). Así no se analizan ni ejecutan al iniciar.
LAZY=" g2.js g3.js g4.js g5.js e2.js e3.js e4.js e5.js c2.js c3.js z1.js z2.js z3.js z4.js z5.js z6.js z7.js z8.js z9.js u2.js u3.js u4.js u5.js q3.js y1.js y2.js y3.js w1.js w2.js w3.js w4.js wa1.js wa2.js wa3.js wa4.js wa5.js wa6.js wa7.js wa8.js wd1.js wd2.js wd3.js wd4.js we1.js we2.js "
{ for f in $FILES; do [ "$f" = "p8.js" ] && continue; case "$LAZY" in *" $f "*) ;; *) cat "$f";; esac; done
  printf '\n/* ===== F6 · CONTENIDO DIFERIDO: un módulo por función, en su orden original (ensureContent / carga ociosa) ===== */\nconst __LAZY = [\n'
  for f in $FILES; do case "$LAZY" in *" $f "*) printf 'function(){ /* %s */\n' "$f"; cat "$f"; printf '\n},\n';; esac; done
  printf '];\n'
  cat p8.js; } > "$D/build/biblia.html"
sed -n '/<script>/,/<\/script>/p' "$D/build/biblia.html" | sed '1d;$d' > "$D/build/check.js"
node --check "$D/build/check.js"
# F6 · Minificación (opcional): quita espacios y comentarios y simplifica la sintaxis del script, sin renombrar
# identificadores ni tocar el texto. Requiere `npm install` en biblia-src/tools; si no está, se omite.
ESB="$D/tools/node_modules/.bin/esbuild"
if [ -x "$ESB" ]; then
  "$ESB" "$D/build/check.js" --minify-whitespace --minify-syntax --charset=utf8 --log-level=warning --outfile="$D/build/check.min.js"
  node --check "$D/build/check.min.js"
  python3 - "$D/build/biblia.html" "$D/build/check.min.js" <<'PY'
import sys
h = open(sys.argv[1], encoding='utf-8').read(); m = open(sys.argv[2], encoding='utf-8').read()
m = m.rstrip(); k = m.rfind('})();')
if k > 0 and m[k - 1] not in ';{': m = m[:k] + ';' + m[k:]   # cierre limpio antes del final del IIFE
a = h.index('<script>') + len('<script>'); b = h.index('</script>', a)
open(sys.argv[1], 'w', encoding='utf-8').write(h[:a] + '\n' + m + h[b:])
PY
  echo "Minificado: $(wc -c < "$D/build/check.js") → $(wc -c < "$D/build/check.min.js") bytes de script"
fi
{ cat "$D/head.html"; cat "$D/build/biblia.html"; printf '\n</body>\n</html>\n'; } > "$D/../BIBLIA_INGENIERO_INDUSTRIAL.html"
# Versión instalable (PWA) en /biblia/: cabecera con manifiesto e íconos, y registro del service worker
mkdir -p "$D/../biblia"
{ awk -v f="$D/pwa/head-pwa.html" '/<\/head>/{while((getline l < f)>0) print l} {print}' "$D/head.html"; cat "$D/build/biblia.html"; cat "$D/pwa/foot-pwa.html"; printf '\n</body>\n</html>\n'; } > "$D/../biblia/index.html"
cp "$D/pwa/manifest.webmanifest" "$D/../biblia/"; cp "$D/pwa/sw.js" "$D/../biblia/biblia-sw.js"
echo "OK: BIBLIA_INGENIERO_INDUSTRIAL.html ($(wc -c < "$D/../BIBLIA_INGENIERO_INDUSTRIAL.html") bytes)"
if [ "$1" = "--test" ]; then
  (echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat "$D/build/biblia.html"; echo '</body></html>') > "$D/tests/test.html"
  cd "$D/tests" && python3 mkx.py && echo "OK: tests/test.html y tests/testx.html"
fi
