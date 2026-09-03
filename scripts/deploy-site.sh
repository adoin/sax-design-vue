#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_SSH_KEY:?Missing deployment private key}"
: "${DEPLOY_KNOWN_HOSTS:?Missing trusted server host key}"
: "${DEPLOY_HOST:?Missing server address}"
: "${DEPLOY_USER:?Missing SSH user}"
: "${DEPLOY_PATH:?Missing deployment directory}"
: "${GITHUB_SHA:?Missing commit SHA}"
: "${GITHUB_RUN_ID:?Missing workflow run ID}"
: "${GITHUB_RUN_ATTEMPT:?Missing workflow run attempt}"

# These values are interpolated into remote shell commands. Limit deployment to
# this site's directory and reject shell syntax in configurable connection data.
[[ "$DEPLOY_PATH" == /srv/www/sax-design.emssion.com ]]
[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]]
[[ "$GITHUB_RUN_ID" =~ ^[0-9]+$ ]]
[[ "$GITHUB_RUN_ATTEMPT" =~ ^[0-9]+$ ]]

site_dir="${1:?Pass the built site directory}"
for page in index.html zh/index.html play/index.html; do
  test -s "$site_dir/$page"
done
printf '%s\n' "$GITHUB_SHA" > "$site_dir/deployment-sha.txt"

ssh_dir=$(mktemp -d "${RUNNER_TEMP:-/tmp}/sax-deploy.XXXXXX")
trap 'rm -rf -- "$ssh_dir"' EXIT
chmod 700 "$ssh_dir"
printf '%s\n' "$DEPLOY_SSH_KEY" | tr -d '\r' > "$ssh_dir/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/key" "$ssh_dir/known_hosts"
unset DEPLOY_SSH_KEY
ssh-keygen -y -P '' -f "$ssh_dir/key" > /dev/null

ssh_options=(
  -i "$ssh_dir/key"
  -o BatchMode=yes
  -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$ssh_dir/known_hosts"
  -o ConnectTimeout=20
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=3
)
destination="$DEPLOY_USER@$DEPLOY_HOST"
release_id="$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT-$GITHUB_SHA"
release_dir="$DEPLOY_PATH/releases/$release_id"

# Upload into a fresh directory. Interrupted uploads never become the live site.
ssh "${ssh_options[@]}" "$destination" \
  "set -eu; test ! -L '$DEPLOY_PATH'; test ! -L '$DEPLOY_PATH/releases'; mkdir -p '$DEPLOY_PATH/releases'; mkdir '$release_dir'"
tar -C "$site_dir" -czf - . | ssh "${ssh_options[@]}" "$destination" \
  "tar --extract --gzip --no-same-owner --no-same-permissions --directory '$release_dir'"

ssh "${ssh_options[@]}" "$destination" \
  "bash -s -- '$DEPLOY_PATH' '$release_id' '$GITHUB_SHA'" <<'REMOTE'
set -euo pipefail
deploy_path="$1"
release_id="$2"
commit_sha="$3"
[[ "$deploy_path" == /srv/www/sax-design.emssion.com ]]
[[ "$release_id" =~ ^[0-9]+-[0-9]+-[a-f0-9]{40}$ ]]
release_dir="$deploy_path/releases/$release_id"

# Serialize activation and cleanup, including manual invocations.
exec 9>"$deploy_path/.deploy.lock"
flock -w 60 9
test ! -L "$release_dir"
for page in index.html zh/index.html play/index.html; do
  test -s "$release_dir/$page"
done
[[ "$(cat "$release_dir/deployment-sha.txt")" == "$commit_sha" ]]
chmod -R u=rwX,go=rX "$release_dir"

previous=$(readlink "$deploy_path/current" || true)
next_link="$deploy_path/.current-$release_id"
ln -s "releases/$release_id" "$next_link"
mv -Tf "$next_link" "$deploy_path/current"

verify_release() {
  # The same Caddy handlers run on loopback, so deployment does not depend on DNS
  # propagation or the first public TLS certificate being available yet.
  local origin=http://127.0.0.1:8091
  local served_sha
  served_sha=$(curl --fail --silent --show-error --max-time 15 "$origin/deployment-sha.txt") || return 1
  [[ "$served_sha" == "$commit_sha" ]] || return 1
  for page in / /zh/ /guide/getting-started.html /zh/guide/getting-started.html /play/; do
    curl --fail --silent --show-error --max-time 15 "$origin$page" > /dev/null || return 1
  done
}

if ! verify_release; then
  if [[ -n "$previous" ]]; then
    ln -s "$previous" "$next_link"
    mv -Tf "$next_link" "$deploy_path/current"
  else
    rm -- "$deploy_path/current"
  fi
  echo 'Site health check failed; restored the previous release.' >&2
  exit 1
fi
printf 'Deployed commit %s\n' "$commit_sha"

# Keep three releases. Only remove directories created by this deployment
# script, beneath the exact site root, after the new release passes its checks.
while IFS= read -r old_release; do
  [[ "$old_release" =~ ^[0-9]+-[0-9]+-[a-f0-9]{40}$ ]] || continue
  [[ "$old_release" != "$release_id" ]] || continue
  old_path="$deploy_path/releases/$old_release"
  [[ "$(realpath "$old_path")" == "$old_path" ]] || continue
  rm -rf -- "$old_path"
done < <(find "$deploy_path/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %f\n' | sort -nr | tail -n +4 | cut -d ' ' -f2-)
REMOTE
