#!/usr/bin/env bash
# Generates Android API docs with Dokka and copies them into the website.
#
# Usage (from anywhere):
#   cd c:\watt\eidkit\website
#   bash scripts/sync-android-docs.sh
#
# Or with a custom SDK path:
#   ANDROID_SDK_DIR=../../my-android bash scripts/sync-android-docs.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_SDK_DIR="${ANDROID_SDK_DIR:-$(cd "$WEBSITE_DIR/../eidkit-android" && pwd)}"
OUTPUT_DIR="$WEBSITE_DIR/static/android-api/latest"

echo "==> Android SDK: $ANDROID_SDK_DIR"
echo "==> Output:      $OUTPUT_DIR"

# --- 1. Run Dokka ---
echo ""
echo "==> Running Dokka..."
cd "$ANDROID_SDK_DIR"
./gradlew :sdk:dokkaHtml

DOKKA_OUT="$ANDROID_SDK_DIR/sdk/build/dokka/html"

if [ ! -d "$DOKKA_OUT" ]; then
  echo "ERROR: Dokka output not found at $DOKKA_OUT"
  exit 1
fi

# --- 2. Copy to static/ ---
echo ""
echo "==> Copying to $OUTPUT_DIR..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cp -r "$DOKKA_OUT/." "$OUTPUT_DIR/"

echo ""
echo "Done! Docs available at:"
echo "  http://localhost:3000/android-api/latest/index.html"
