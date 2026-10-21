---
status: implemented
kind: project-specification
completed_at: 2026-10-21
modules:
  - packages/iconify
  - packages/components/icon
  - docs/icons
  - docs/zh/icons
---

# Local SVG registration

`signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }])` is exported from
`sax-design-vue-iconify/vite`. Paths resolve relative to Vite root. A preset accepts
one file/glob or an array, including recursive patterns and exclusions. File
basenames preserve case and become `preset-basename`; subdirectories do not
participate in naming. Duplicate final names fail with both source paths.

The Vite plugin parses SVG XML in Node and generates a side-effectful registration
module using the existing shared icon registry. SVG body, viewBox and authored
paint attributes are retained; a missing viewBox requires positive numeric width
and height. Browser bundles contain data, not the XML parser or filesystem scanner.
All matched files register, including dynamic names used by any component icon
prop. Iconify strict transforms recognize local presets from resolved Vite plugins,
independent of plugin order.

HTML entries register automatically. SSR/non-HTML entries explicitly import
`virtual:sax-svgs/register` before rendering. Scoped replacement removes stale
registrations on module reevaluation without deleting later manual overrides.
Development watchers handle additions, changes and deletions with module
invalidation and a full page reload, including when the glob initially matches
no files. Normal SIcon SVG ID isolation applies to local gradients and definitions.

Verification: 41 icon/plugin tests pass, including Vite 4/5/8 production builds,
SSR registry use, file rescanning, watcher invalidation, duplicate and XML errors,
strict Iconify coexistence, and gradient ID isolation. ESM/CJS/declaration builds,
Vitest type checking, focused ESLint and 22 documentation checks pass. The first
documentation run hit the existing 5-second Table type-resolution timeout under
concurrent checks; rerunning with a 30-second test timeout passes all checks.

This change is unreleased; the root and both localized public changelogs record it
under Unreleased.
