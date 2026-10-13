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

npm publish ./dist/sax-design-vue --access public --provenance

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
  echo "::error::npm accepted the upload, but sax-design-vue@$release_version is not publicly available. Check staged packages and registry status before declaring this release published." >&2
  exit 1
fi

echo "✅ Published sax-design-vue@$release_version"
