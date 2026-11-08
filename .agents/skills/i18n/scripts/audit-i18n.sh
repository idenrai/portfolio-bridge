#!/usr/bin/env bash
# audit-i18n.sh - Verifies translation key consistency across ko, en, ja, de
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

I18N_DIR="src/i18n"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "=================================================="
echo "🌐 [i18n Audit] Verifying locale key parity..."
echo "=================================================="

# 키 추출 함수 (BSD/GNU sed 호환 POSIX 문자 클래스 사용)
extract_keys() {
  local file="$1"
  local outfile="$2"
  # 행 시작 부분의 키 추출 (예: '  guru_title:' 또는 '  guru_count_badge: (count) =>')
  grep -E "^[[:space:]]+[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*[:(]" "$file" \
    | sed -E "s/^[[:space:]]+([a-zA-Z0-9_]+).*/\1/" \
    | sort -u > "$outfile"
}

extract_keys "$I18N_DIR/ko.ts" "$TMP_DIR/ko.txt"
extract_keys "$I18N_DIR/en.ts" "$TMP_DIR/en.txt"
extract_keys "$I18N_DIR/ja.ts" "$TMP_DIR/ja.txt"
extract_keys "$I18N_DIR/de.ts" "$TMP_DIR/de.txt"

HAS_ERROR=0

check_diff() {
  local target_lang="$1"
  local target_file="$TMP_DIR/${target_lang}.txt"
  local missing
  missing=$(comm -23 "$TMP_DIR/ko.txt" "$target_file")
  if [[ -n "$missing" ]]; then
    echo "❌ Missing in ${target_lang}.ts (present in ko.ts):"
    echo "$missing" | sed 's/^/   - /'
    HAS_ERROR=1
  else
    echo "✅ ${target_lang}.ts is in sync with ko.ts"
  fi
}

check_diff "en"
check_diff "ja"
check_diff "de"

echo "=================================================="
if [[ $HAS_ERROR -eq 0 ]]; then
  echo "🎉 [i18n Audit] All 4 locale files are perfectly in sync!"
  exit 0
else
  echo "⚠️ [i18n Audit] Translation discrepancies detected. Please resolve above."
  exit 1
fi
