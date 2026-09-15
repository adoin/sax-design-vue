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

built_version="$(node -p "require('./dist/sax-design-vue/package.json').version")"
if [[ "$release_version" != "$built_version" ]]; then
  echo "Built package version $built_version does not match tag version $release_version" >&2
  exit 1
fi

npm publish ./dist/sax-design-vue --access public --provenance

echo "✅ Published sax-design-vue@$release_version"
