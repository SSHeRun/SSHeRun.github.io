#!/usr/bin/env bash
# Compose covers, fetch/generate inline images, verify assets.
# Usage: scripts/publish-blog.sh --slug my-post --bg tmp/bg-my-post.png
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SLUG=""
BG=""
INLINE="fetch"
VERIFY=true
BUILD=false

usage() {
	cat <<'EOF'
Usage: scripts/publish-blog.sh --slug SLUG --bg SCENE.png [options]

Compose zh/en covers, optional inline images, then verify before commit.

Required:
  --slug SLUG       Blog slug (src/content/blog/SLUG.md)
  --bg PATH         16:9 scene background (no text in image)

Options:
  --inline fetch    Fetch inline images from Pexels (default)
  --inline generate Generate procedural inline images
  --inline skip     Skip inline images
  --no-verify       Skip npm run verify:blog
  --build           Also run npm run build
  -h, --help        Show this help
EOF
}

while [[ $# -gt 0 ]]; do
	case "$1" in
	--slug)
		SLUG="$2"
		shift 2
		;;
	--bg)
		BG="$2"
		shift 2
		;;
	--inline)
		INLINE="$2"
		shift 2
		;;
	--no-verify)
		VERIFY=false
		shift
		;;
	--build)
		BUILD=true
		shift
		;;
	-h | --help)
		usage
		exit 0
		;;
	*)
		echo "Unknown option: $1" >&2
		usage >&2
		exit 1
		;;
	esac
done

if [[ -z "$SLUG" || -z "$BG" ]]; then
	echo "error: --slug and --bg are required" >&2
	usage >&2
	exit 1
fi

if [[ ! -f "$BG" ]]; then
	echo "error: background not found: $BG" >&2
	exit 1
fi

ZH="$ROOT/src/content/blog/${SLUG}.md"
EN="$ROOT/src/content/blog/${SLUG}.en.md"
if [[ ! -f "$ZH" ]]; then
	echo "error: missing $ZH" >&2
	exit 1
fi
if [[ ! -f "$EN" ]]; then
	echo "error: missing $EN — write both zh and en posts first" >&2
	exit 1
fi

echo "==> Composing zh cover for $SLUG"
python3 scripts/compose-cover.py --slug "$SLUG" --bg "$BG"

echo "==> Composing en cover for $SLUG"
python3 scripts/compose-cover.py --slug "$SLUG" --bg "$BG" --en

case "$INLINE" in
fetch)
	echo "==> Fetching inline images for $SLUG"
	python3 scripts/fetch-inline-images.py "$SLUG"
	;;
generate)
	echo "==> Generating inline images for $SLUG"
	python3 scripts/generate-inline-images.py "$SLUG"
	;;
skip)
	echo "==> Skipping inline images"
	;;
*)
	echo "error: --inline must be fetch, generate, or skip" >&2
	exit 1
	;;
esac

if [[ "$VERIFY" == true ]]; then
	echo "==> Verifying blog assets"
	npm run verify:blog
fi

if [[ "$BUILD" == true ]]; then
	echo "==> Building site"
	npm run build
fi

echo ""
echo "✓ Publish prep complete for $SLUG"
echo "Next:"
echo "  git add src/content/blog/${SLUG}.md src/content/blog/${SLUG}.en.md \\"
echo "          src/assets/cover-${SLUG}.jpg src/assets/cover-${SLUG}-en.jpg \\"
echo "          src/assets/inline-${SLUG}-*.jpg"
echo "  git commit -m \"feat: publish post - ${SLUG}\""
