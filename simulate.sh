#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo ""
echo " MIRAI ATELIER — simulazione offline"
echo " ==================================="
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "[ERRORE] Node.js non trovato"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "→ npm install"
  npm install
fi

if [ "${1:-}" = "dev" ]; then
  npm run simulate:dev
else
  npm run simulate
fi
