# sax-design-vue-iconify

Vite integration for Iconify and project SVG files in Sax Design Vue.

## Local SVG files

```ts
// vite.config.ts
import { signSvgs } from 'sax-design-vue-iconify/vite'

export default {
  plugins: [signSvgs([{ preset: 'lo', url: 'src/assets/svgs/*.svg' }])],
}
```

Use `home.svg` as `<s-icon name="lo-home" />` or `<s-button icon="lo-home" />`.
Only literal names used in application source are registered. Use `**/*.svg`
for subdirectories. Paths resolve relative to Vite root; names use the
basename, preserving filename case. Duplicate names within a preset fail with both file paths.
File changes, additions and deletions reload the development page.

Runtime-generated names need an explicit safelist:

```ts
signSvgs([{ preset: 'lo', url: 'src/assets/svgs/**/*.svg' }], {
  safelist: ['lo-home', 'lo-user'],
})
```

Local names can also use the shared `saxIcons` safelist. Identical SVG payloads
share one data module across names and presets. Unreferenced files are indexed
without parsing or embedding their SVG contents.

SVG viewBox, colors and gradients are preserved. Without viewBox, positive numeric
width and height are required. Author `currentColor` to follow the component color.
Only register trusted project SVG assets intended for inline rendering.

Static references register through their own source modules, including SSR.
HTML entries register safelists automatically. For SSR or other entries, import
`virtual:sax-svgs/register` before rendering to register the local safelist. Add
`/// <reference types="sax-design-vue-iconify/virtual" />` to your environment types.
The plugin can be used together with `saxIcons` below.

## Iconify

- Static `<s-icon name="cb:add" />` values become direct per-icon SVG imports.
- Dynamic values use the explicit `safelist` in `sax-icons.config.ts`.
- `mode: 'api'` fetches only used icons at build time and caches them locally.
- `DEFAULT_API_ENDPOINTS` exposes Iconify, SimpleSVG, and UniSVG for explicit selection.
- `mode: 'local'` reads installed Iconify JSON packages for offline builds.
- Collection JSON stays in the build process and is not shipped to browsers.
- Published component library modules are not transformed again.

## Explicit runtime API loading

`loadIconData(names, options)` from `sax-design-vue-iconify/api` fetches missing
icons in bounded collection batches and registers them in the shared store.
Options include `baseUrl`, `collections`, `timeout`, and `signal`. IconPicker uses
this entry lazily; importing the component library or rendering SIcon does not
start a request. Failed requests can be retried; successful registrations are reused.

See the [Sax Design Vue icon guide](https://adoin.github.io/sax-design-vue/icons/) for configuration and usage.
