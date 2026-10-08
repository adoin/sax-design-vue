# Documentation development startup

Status: implemented
Verified: 2026-10-08

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

## Measurements

Windows workstation; local observations, not a cross-machine benchmark:

| Run | Pages | Data preparation | Server ready |
| --- | ---: | ---: | ---: |
| Baseline, independent port/cache | 201 | 5.81s | Not separately measured |
| Full development after caches | 201 | 2.86s | 5.74s |
| Textarea both locales, initial focused run | 31 | 0.438s | 3.54s |
| Textarea both locales, warm restart | 31 | 0.284s | 2.29s |

The baseline Textarea navigation reached DOMContentLoaded in 10.615s. A cold focused navigation still took 9.823s; a warm focused navigation took 1.998s. These cold/warm figures must not be presented as an equivalent-condition improvement. The full source component installer still contributes to first-page compilation; it has not been replaced with a different runtime registration architecture.

## Verification

- Five development scope/cache regression tests passed, including dependency closure, invalid scope rejection, disk reuse, corrupt/version/source invalidation, icon parity and recursive API type parity.
- Full component documentation example/source/API audit: four files, 21 tests passed.
- Node typecheck and targeted ESLint passed.
- Production `docs:build` generated all 201 pages; final build completed in 140.37s.
- Browser checks covered Chinese-only navigation, both Textarea locales, Code and compiling Playground preview.
- Temporary Sass probe was observed through browser computed styles after HMR and restored byte-for-byte.
- Temporary new `<input-default />` reference updated the focused registration and rendered without an unresolved custom element; the Markdown source was restored byte-for-byte.
