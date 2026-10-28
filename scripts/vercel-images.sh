#!/usr/bin/env bash
# Construction Vercel : télécharge les photos des démos (listées dans sites/*/images.txt)
# en WebP, à la bonne taille, depuis Unsplash. Rien à mettre dans le dépôt, rien à payer.
set -u
list=$(mktemp)
for f in sites/*/images.txt; do
  [ -f "$f" ] || continue
  d=$(dirname "$f")
  while read -r p id w h q; do
    [ -z "${p:-}" ] && continue
    [ -s "$d/$p" ] && continue
    # h = 0 : on garde le cadrage d'origine (photos à plat, paysage)
    if [ "$h" = "0" ]; then echo "$d/$p https://images.unsplash.com/photo-$id?w=$w&fm=webp&q=${q:-68}"
    else echo "$d/$p https://images.unsplash.com/photo-$id?w=$w&h=$h&fit=crop&crop=entropy&fm=webp&q=${q:-68}"; fi
  done < "$f"
done > "$list"
n=$(grep -c . "$list" || true)
echo "photos à télécharger : $n"
xargs -P 8 -n 2 sh -c 'mkdir -p "$(dirname "$0")"; curl -sfL --retry 3 -o "$0" "$1" || echo "MANQUE $0"' < "$list"
ok=0; while read -r p u; do [ -s "$p" ] && ok=$((ok+1)); done < "$list"
echo "photos prêtes : $ok / $n"

# Aperçus du portfolio : capture des démos avec leurs vraies photos (ordinateur + téléphone).
# En cas d'échec, le portfolio retombe sur les photos des sites : la construction continue.
mkdir -p assets/covers
{
  echo "VERCEL=${VERCEL:-} node=$(node -v) $(head -1 /etc/os-release 2>/dev/null)"
  if { [ "${VERCEL:-}" = "1" ] || [ "${COVERS:-}" = "1" ]; } && grep -q slug scripts/covers.json; then
    mods=/tmp/covers-mods
    mkdir -p "$mods" && ( cd "$mods" && { [ -f package.json ] || npm init -y >/dev/null; } && npm i --no-audit --no-fund playwright-core@1.56.0 @sparticuz/chromium@141.0.0 2>&1 | tail -3 ) && \
    MODS="$mods" AWS_LAMBDA_JS_RUNTIME=nodejs22.x timeout 900 node scripts/covers.mjs 2>&1 || echo "aperçus : ignorés"
  fi
} 2>&1 | tee assets/covers/log.txt
