# Documentation development startup

Status: implemented
Verified: 2026-10-21

## Contract

- `pnpm dev` and `pnpm docs:dev` run the full VuePress documentation by default.
- `--component <name>` restricts component pages, including nested Table pages, and registers the recursive closure of referenced example components. Guide, theme, icon and home pages remain available for the selected locales.
- `--locale en|zh|both` selects development locales; `both` is the default. Navigation and search use the same scope. Unavailable locale switches are hidden.
- Each focused scope has its own VuePress temp and Vite cache directory. Focused production builds are rejected. Normal production builds retain all pages and Git updated timestamps.
- Development skips Git history processes and hides the update timestamp instead of displaying the current date for missing Git metadata.
- Icon scans and API declaration parsing cache entries are namespaced and keyed by file path, size and modification/creation timestamps. Source highlighting is keyed by language and source content. Cache versions include implementation source and the dependency lockfile. Missing/corrupt data caches fall back to recomputation.
- Development aggregate Sass output is compiled once, stored under the ignored cache directory, and reused on warm restarts. A signature covers all theme Sass source files, the lockfile and cache implementation. Source edits regenerate CSS atomically and notify Vite's CSS HMR pipeline. Source changes during compilation schedule another pass.
- Adding/removing an example reference in a scoped Markdown page regenerates the registration closure and reloads the page so the Vue application installs the new registry. Existing example SFC edits retain regular HMR.
- Generated caches must remain untracked; none replace component library source or production styles.
- `--cache-root <directory>` isolates VuePress temp/cache, Vite cache, metadata and aggregate Sass output together. Memory-cache keys include that root. `--profile` reports Sass compilation on cache misses. Fresh roots reproduce application cold starts without deleting a user's running server caches.
- Docs development rewrites named component imports in executable SFC script blocks and TypeScript modules to component entry points. Raw sources, template/style blocks, type imports, unknown exports and production imports remain unchanged. The global component registry is asynchronous and preserves component static-child names; service/directive plugins retain their original installer.
- The docs-only icon wrapper uses the existing Iconify loader to inline known safelist data into one development registry module. Files using known names skip duplicate extraction; newly introduced literal names retain the original plugin transform during HMR. Production uses the original loader and transform. No candidate SVG data is added to the published component library.
- Sass uses one lazily initialized embedded async compiler per server, shared by the two aggregate sheets, and disposes it on close. Valid warm disk caches avoid compiler initialization entirely.
- The shared example dialog/workspace loads after an example action rather than with every initial page. Public Code/Playground source remains the original SFC; focus restoration, Escape closing and minimize/restore behavior remain supported.

## Measurements

Windows workstation; local observations, not a cross-machine benchmark:

| Run | Pages | Data preparation | Server ready |
| --- | ---: | ---: | ---: |
| Baseline, independent port/cache | 201 | 5.81s | Not separately measured |
| Full development after caches | 201 | 2.86s | 5.74s |
| Textarea both locales, initial focused run | 31 | 0.438s | 3.54s |
| Textarea both locales, warm restart | 31 | 0.284s | 2.29s |

The historical baseline Textarea navigation reached DOMContentLoaded in 10.615s. A cold focused navigation still took 9.823s; a warm focused navigation took 1.998s. These cold/warm figures must not be presented as an equivalent-condition improvement.

2026-10-21: full documentation, 239 pages, both locales, first Chinese File Manager navigation on separate fresh ports/cache roots:

| Run | Preparation | Server ready | Sass compilation | DOMContentLoaded | First contentful paint |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline | 3.10s | 6.18s | 2.639s | 10.977s | 11.844s |
| Final development changes | 2.76s | 5.68s | 1.184s | 6.843s | 7.276s |
| Final, second fresh cache root | 2.70s | 8.16s | 1.373s | 8.413s | 8.848s |

First contentful paint improved by about 39% in this observation. Intermediate experiments were variable: native Sass plus deferred Playground alone produced a 10.888s first paint; removing eager component imports alone still produced a 12.724s first paint with many individual icon requests around 5.1s. Batching the icon registry removed these independent icon requests. The first embedded-compiler trial took 4.313s, so native compilation is not guaranteed faster on every individual run. Server ready excludes the browser's module compilation phase.

A same-process refresh in the native-Sass/deferred-workspace intermediate version painted in 2.608s. A server restart reusing those disk caches but visiting a fresh origin painted in 9.716s. These describe different cache states and are not final-version comparisons. Package-store, OS file and browser caches were not globally cleared; measurements do not simulate a new machine or first dependency install. Benchmark roots/logs belong under the task directory in `D:/tmp`, never the repository collection root.

The final version's warm-cache restart prepared data in 1.82s, became ready in 6.76s, skipped aggregate Sass compilation, but its first new-origin page still painted in 12.064s. Same-process refresh then painted in 2.188s (DOMContentLoaded 1.876s). Warm disk caches therefore do not guarantee a fast first browser visit: the per-process Vite transform graph and theme style compilation remain, with appreciable run-to-run variation. Do not present the single cold improvement as a stable percentage guarantee.

## Verification

- Five development scope/cache regression tests passed, including dependency closure, invalid scope rejection, disk reuse, corrupt/version/source invalidation, icon parity and recursive API type parity.
- Full component documentation example/source/API audit: four files, 21 tests passed.
- Node typecheck and targeted ESLint passed.
- Production `docs:build` generated all 201 pages; final build completed in 140.37s.
- Browser checks covered Chinese-only navigation, both Textarea locales, Code and compiling Playground preview.
- Temporary Sass probe was observed through browser computed styles after HMR and restored byte-for-byte.
- Temporary new `<input-default />` reference updated the focused registration and rendered without an unresolved custom element; the Markdown source was restored byte-for-byte.

2026-10-21 verification:

- Eleven development regression checks passed, including native Sass reuse/invalidation, cache-root isolation, all documentation SFC import rewrites, lazy/static-child installer coverage, exact icon-loader data parity and new icon extraction during HMR.
- Full documentation example/source/API audit: four files, 22 tests passed. Node and Vitest typechecks and scoped ESLint passed.
- Both aggregate stylesheet SHA-256 hashes match the baseline JavaScript Sass output byte-for-byte.
- Both File Manager locales rendered; Code retained localized original source, Playground compiled previews, Escape restored the triggering Code button, and minimize/restore preserved the workspace.
- A temporary Sass property was observed through browser computed styles after HMR and disappeared after byte-for-byte source restoration.
- Full production build passed: all 239 pages rendered in 125.57s total; production uses the original installer and icon extraction. Existing aggregate application chunk-size warnings remain.
