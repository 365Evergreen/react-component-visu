#!/usr/bin/env bash
# Simple bootstrap script to create a new project from this template.
# Usage: ./scripts/create-from-template.sh <new-project-dir> [--replace-name "My Project"]

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <new-project-dir> [--replace-name \"My Project\"]"
  exit 1
fi

TARGET_DIR=$1
shift || true
REPLACE_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --replace-name)
      REPLACE_NAME="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Clone without history
git clone --depth 1 https://github.com/<owner>/spark-template.git "$TARGET_DIR"
rm -rf "$TARGET_DIR/.git"

echo "Cloned template to $TARGET_DIR"

if [ -n "$REPLACE_NAME" ]; then
  echo "Replacing project name with: $REPLACE_NAME"
  if command -v jq >/dev/null 2>&1; then
    tmpfile=$(mktemp)
    jq ".name = \"$REPLACE_NAME\"" "$TARGET_DIR/package.json" > "$tmpfile" && mv "$tmpfile" "$TARGET_DIR/package.json"
  else
    sed -i "s/\"name\": \"spark-template\"/\"name\": \"${REPLACE_NAME}\"/" "$TARGET_DIR/package.json" || true
  fi
fi

echo "Bootstrap complete. Next steps:"
echo "  cd $TARGET_DIR"
echo "  npm install"
echo "  npm run dev"

echo "If you want this script to push an initial repo, review and customize the generated project before adding your remote and pushing."