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

The Vite plugin indexes matching paths without parsing unreferenced SVGs. Literal
application names and explicit safelists select per-name registration modules.
Selected SVG XML is parsed in Node; content-addressed data modules share identical
payloads across files and presets. SVG body, viewBox and authored
paint attributes are retained; a missing viewBox requires positive numeric width
and height. Browser bundles contain data, not the XML parser or filesystem scanner.
Dynamic names require `signSvgs(presets, { safelist })`, or the shared saxIcons
safelist when both plugins are configured. Names used by any component icon prop
are supported. Iconify strict transforms recognize local presets from resolved Vite plugins,
independent of plugin order.

Literal names register through imports in their own source modules, including SSR.
HTML entries register safelists automatically. SSR/non-HTML entries explicitly
import `virtual:sax-svgs/register` to apply local safelists before rendering.
Development watchers handle additions, changes and deletions with module
invalidation and a full page reload, including when the glob initially matches
no files. Client page reloads clear deleted registrations. Normal SIcon SVG ID
isolation applies to local gradients and definitions. The SVG payload belongs to
the consuming application's bundle, not the component library.

Verification: 99 icon/plugin tests pass, including Vite 4/5/8 production builds,
SSR registry use, file rescanning, watcher invalidation, duplicate and XML errors,
strict Iconify coexistence, unused-file exclusion, content deduplication and gradient
ID isolation. ESM/CJS/declaration builds, Vitest type checking and 22 documentation
checks pass. The complete library and 237-page documentation builds also pass.

Released in sax-design-vue 2.7.0 with sax-design-vue-iconify 1.1.0 on 2026-10-21.
Both npm publish commands exited successfully. The release archives preserve only
66 internal control names; all 122 other picker payloads are absent. Root and
localized public changelogs record the release and intranet/offline usage.
