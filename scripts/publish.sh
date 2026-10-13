#!/usr/bin/env bash

set -euo pipefail

: "${TAG_VERSION:?TAG_VERSION is required}"
: "${GIT_HEAD:?GIT_HEAD is required}"

release_version="${TAG_VERSION#v}"
manifest_version="$(node -p "require('./packages/sax-design-vue/package.json').version")"

if [[ "$release_version" != "$manifest_version" ]]; then
  echo "Tag version $release_version does not match package version $manifest_version" >&2
  exit 1
fi

live_version="$(npm view "sax-design-vue@$release_version" version --prefer-online 2>/dev/null || true)"
if [[ "$live_version" == "$release_version" ]]; then
  echo "Verified public sax-design-vue@$release_version"
  exit 0
fi

pnpm install --frozen-lockfile
pnpm run gen:version
pnpm run build
node scripts/verify-theme-css.mjs

built_version="$(node -p "require('./dist/sax-design-vue/package.json').version")"
if [[ "$release_version" != "$built_version" ]]; then
  echo "Built package version $built_version does not match tag version $release_version" >&2
  exit 1
fi

icon_version="$(node -p "require('./packages/iconify/package.json').version")"
published_icon_version="$(npm view sax-design-vue-iconify version)"
if [[ "$icon_version" != "$published_icon_version" ]]; then
  npm publish ./packages/iconify --access public --provenance
fi

npm stage publish ./dist/sax-design-vue --access public --provenance --json
npm stage list sax-design-vue --json

live_version=""
for attempt in 1 2 3 4; do
  live_version="$(npm view "sax-design-vue@$release_version" version --prefer-online 2>/dev/null || true)"
  if [[ "$live_version" == "$release_version" ]]; then
    break
  fi
  if [[ "$attempt" != 4 ]]; then
    sleep 10
  fi
done
if [[ "$live_version" != "$release_version" ]]; then
  echo "::error::sax-design-vue@$release_version was submitted for staged approval. Approve its actual stage record with npm 2FA, then rerun this job to verify public availability and create the GitHub release." >&2
  exit 1
fi

echo "✅ Published sax-design-vue@$release_version"
