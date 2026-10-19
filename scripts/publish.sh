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
node scripts/verify-package-consumer.mjs

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

repo_root="$(pwd)"
archive_dir="$(mktemp -d)"
archive_name="$(cd ./dist/sax-design-vue && npm pack --pack-destination "$archive_dir" --silent)"
archive_path="$archive_dir/$archive_name"
(cd ./dist/sax-design-vue && node "$repo_root/scripts/verify-release-archive.mjs" "$archive_path")
npm publish "$archive_path" --access public --provenance --tag latest

live_version=""
# npm accepts publication before its asynchronous processing exposes the version.
# Allow that processing to finish instead of treating a short delay as failure.
for attempt in $(seq 1 60); do
  live_version="$(npm view "sax-design-vue@$release_version" version --prefer-online 2>/dev/null || true)"
  if [[ "$live_version" == "$release_version" ]]; then
    break
  fi
  if [[ "$attempt" != 60 ]]; then
    sleep 10
  fi
done
if [[ "$live_version" != "$release_version" ]]; then
  echo "::error::sax-design-vue@$release_version is not publicly visible yet. Inspect the npm publish output and rerun this job after the registry exposes the version." >&2
  exit 1
fi

echo "✅ Published sax-design-vue@$release_version"
