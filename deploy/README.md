# Documentation deployment

Every push to `main` runs `.github/workflows/pages.yml` and builds two outputs:

| Destination                      | Documentation base | Playground base         |
| -------------------------------- | ------------------ | ----------------------- |
| GitHub Pages                     | `/sax-design-vue/` | `/sax-design-vue/play/` |
| `https://sax-design.emssion.com` | `/`                | `/play/`                |

The workflow can also be run manually on `main`. Concurrent runs queue so an
active server deployment is not interrupted by a newer push.

## GitHub configuration

Under repository **Settings → Secrets and variables → Actions**, configure:

| Kind     | Name                 | Value                                      |
| -------- | -------------------- | ------------------------------------------ |
| Secret   | `DEPLOY_SSH_KEY`     | Deployment user's SSH private key          |
| Variable | `DEPLOY_HOST`        | `101.37.87.125`                            |
| Variable | `DEPLOY_USER`        | `root`                                     |
| Variable | `DEPLOY_PATH`        | `/srv/www/sax-design.emssion.com`          |
| Variable | `DEPLOY_KNOWN_HOSTS` | Verified OpenSSH host entry for the server |

Get the host public key through an already trusted SSH connection. Do not disable
host checking or trust an unverified key collected during the workflow.

## Server and DNS

The server uses Caddy. Install `sax-design.caddy` as
`/etc/caddy/sites/sax-design.caddy` and import that file from
`/etc/caddy/Caddyfile`. Validate the complete configuration with `caddy validate`
before reloading the `caddy` service. Preserve the existing site's configuration.

Add an **A** record named `sax-design` under `emssion.com` pointing to
`101.37.87.125`. Ports 80 and 443 must be reachable. Caddy automatically obtains
and renews the HTTPS certificate once DNS points to this server. Only add an AAAA
record if the server also has a working public IPv6 address.

Files live under `/srv/www/sax-design.emssion.com/releases/`. The `current`
symlink points to the published release. Each upload gets a fresh directory;
activation atomically switches the symlink and checks the commit marker,
English/Chinese pages, and Playground through Caddy at `127.0.0.1:8091`.
This health listener is bound to loopback only and works while DNS is pending.
A failed health check restores the previous symlink. Three releases are retained.

To roll back manually on the server, choose a retained directory from `releases`
and atomically replace `current`:

```bash
cd /srv/www/sax-design.emssion.com
ls -1 releases
ln -s releases/RELEASE_ID .rollback
mv -Tf .rollback current
curl --fail http://127.0.0.1:8091/deployment-sha.txt
```

The workflow only updates website files. Changes to Caddy configuration must be
validated and applied on the server separately.
