#!/bin/bash
# Compila la Biblia: une los módulos de src/ en un solo HTML autocontenido.
# Uso: bash biblia-src/build.sh [--test]
set -e
D="$(cd "$(dirname "$0")" && pwd)"; cd "$D/src"
FILES="p1.html p2.js x1.js x2.js x4.js p3.js p4.js p5.js p6.js p6b.js px.js g1.js g2.js g3.js g4.js g5.js $(ls e[0-9].js) p7.js x3.js m1.js m2.js m3.js m4.js $(ls i[0-9].js) $(ls c[0-9].js) z0.js $(ls z[1-9].js 2>/dev/null) $(ls u[0-9].js) $(ls s[0-9].js) $(ls d[0-9].js) $(ls f[0-9].js) $(ls o[0-9].js) $(ls q[0-9].js) $(ls v[0-9].js) $(ls y[0-9].js) $(ls w[0-9].js) $(ls wa[0-9].js 2>/dev/null) $(ls wb[0-9].js 2>/dev/null) $(ls wc[0-9].js 2>/dev/null) $(ls wd[0-9].js 2>/dev/null) $(ls we[0-9].js 2>/dev/null) p8.js"
mkdir -p "$D/build"
cat $FILES > "$D/build/biblia.html"
sed -n '/<script>/,/<\/script>/p' "$D/build/biblia.html" | sed '1d;$d' > "$D/build/check.js"
node --check "$D/build/check.js"
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
