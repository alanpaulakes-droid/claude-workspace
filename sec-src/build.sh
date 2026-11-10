#!/usr/bin/env bash
# Ensambla el archivo único ../CUESTIONARIO_SEC_RIC.html
set -euo pipefail
cd "$(dirname "$0")"
OUT=../CUESTIONARIO_SEC_RIC.html
{
  cat head.html
  echo '<script>'
  echo '"use strict";'
  cat data-ric.js data-preg.js data-svg.js data-cont.js app.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > "$OUT"
echo "OK $(wc -c < "$OUT") bytes -> $OUT"
