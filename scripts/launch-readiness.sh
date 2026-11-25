#!/usr/bin/env bash
# Launch-readiness smoke check for the production build on http://localhost:3000.
# Usage: bash scripts/launch-readiness.sh
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
EXIT_CODE=0

check() {
  local url="$1"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
  printf "%s -> %s\n" "$url" "$status"
  [ "$status" = "$2" ] || EXIT_CODE=1
}

echo "== Building production bundle =="
npm run build

echo "== Smoke checks against $BASE_URL =="
check "$BASE_URL/" 200
check "$BASE_URL/articles" 200
check "$BASE_URL/articles/designing-a-rate-limiter" 200
check "$BASE_URL/categories" 200
check "$BASE_URL/categories/backend-engineering" 200
check "$BASE_URL/categories/system-design-and-architecture" 200
check "$BASE_URL/categories/distributed-systems" 200
check "$BASE_URL/categories/operating-systems-and-linux" 200
check "$BASE_URL/categories/database-engineering" 200
check "$BASE_URL/categories/software-engineering-principles" 200
check "$BASE_URL/categories/cybersecurity-and-information-security" 200
check "$BASE_URL/categories/engineering-experiments-and-personal-technical-notes" 200
check "$BASE_URL/tags" 200
check "$BASE_URL/tags/rate-limiting" 200
check "$BASE_URL/archive" 200
check "$BASE_URL/search" 200
check "$BASE_URL/about" 200
check "$BASE_URL/rss.xml" 200
check "$BASE_URL/sitemap.xml" 200
check "$BASE_URL/robots.txt" 200
check "$BASE_URL/icon.svg" 200
check "$BASE_URL/opengraph-image" 200
check "$BASE_URL/articles/draft-notes-on-raft" 404

echo "== RSS sanity =="
rss_count=$(curl -s "$BASE_URL/rss.xml" | grep -c "<item>" || true)
rss_drafts=$(curl -s "$BASE_URL/rss.xml" | grep -c "draft-notes-on-raft" || true)
echo "RSS items: $rss_count, draft entries: $rss_drafts"
[ "$rss_count" -gt 0 ] || EXIT_CODE=1
[ "$rss_drafts" -eq 0 ] || EXIT_CODE=1

echo "== E2E (Chromium + Pixel 5) =="
npm run test:e2e

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "LAUNCH READINESS: PASS"
else
  echo "LAUNCH READINESS: FAIL"
  exit 1
fi
