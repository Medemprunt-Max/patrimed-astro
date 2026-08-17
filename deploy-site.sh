#!/usr/bin/env bash
# deploy-site.sh — Upload du build Astro vers O2Switch via FTPS (lftp).
#
# Usage:
#   ./deploy-site.sh             # Build + deploy
#   DRY_RUN=1 ./deploy-site.sh   # Dry-run (n'écrit rien sur le serveur)
#   SKIP_BUILD=1 ./deploy-site.sh # Réutilise le dist/ existant
#
# Prérequis: lftp (brew install lftp), .env.deploy à la racine.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env.deploy ]; then
  echo "[deploy] ERROR: .env.deploy introuvable à la racine du repo." >&2
  echo "[deploy] Créer le fichier avec: FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env.deploy
set +a

: "${FTP_HOST:?FTP_HOST not set in .env.deploy}"
: "${FTP_USER:?FTP_USER not set in .env.deploy}"
: "${FTP_PASS:?FTP_PASS not set in .env.deploy}"
: "${FTP_REMOTE_DIR:=/}"

DIST_DIR="${DIST_DIR:-./dist}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_BUILD="${SKIP_BUILD:-0}"

if [ "$SKIP_BUILD" != "1" ]; then
  echo "[deploy] Build Astro..."
  npm run build
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "[deploy] ERROR: $DIST_DIR introuvable." >&2
  exit 1
fi

DRY_RUN_FLAG=""
if [ "$DRY_RUN" = "1" ]; then
  DRY_RUN_FLAG="--dry-run"
  echo "[deploy] === DRY RUN — aucun fichier ne sera écrit ==="
fi

echo "[deploy] Source: $DIST_DIR ($(du -sh "$DIST_DIR" | cut -f1))"
echo "[deploy] Cible: ftps://$FTP_USER@$FTP_HOST:21$FTP_REMOTE_DIR"

# Exclusions:
#   .DS_Store       — artefact macOS
#   .well-known     — challenges Let's Encrypt (NE JAMAIS écraser)
#   (images/blog est désormais versionné dans le repo — exclusion retirée)
#
# Note: pas de --delete. On ne supprime rien sur le serveur (conservateur).
#       Les vieux assets (anciens hash CSS/JS) restent mais ne sont plus référencés.
lftp -u "$FTP_USER,$FTP_PASS" -p 21 "ftp://$FTP_HOST" <<EOF
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30
set mirror:parallel-transfer-count 4
mirror --reverse --verbose=1 --parallel=4 $DRY_RUN_FLAG \
  --exclude-glob '.DS_Store' \
  --exclude '^\\.well-known/' \
  "$DIST_DIR" "$FTP_REMOTE_DIR"
quit
EOF

echo "[deploy] Done."
