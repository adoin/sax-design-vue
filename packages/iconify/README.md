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
Every matched SVG is registered, including dynamically selected names. Use `**/*.svg`
for subdirectories. Paths resolve relative to Vite root; names use the
basename, preserving filename case. Duplicate names within a preset fail with both file paths.
File changes, additions and deletions reload the development page.

SVG viewBox, colors and gradients are preserved. Without viewBox, positive numeric
width and height are required. Author `currentColor` to follow the component color.
Only register trusted project SVG assets intended for inline rendering.

HTML entries register automatically. For SSR or other entries, import
`virtual:sax-svgs/register` before rendering. Add
`/// <reference types="sax-design-vue-iconify/virtual" />` to your environment types.
The plugin can be used together with `saxIcons` below.

## Iconify

- Static `<s-icon name="cb:add" />` values become direct per-icon SVG imports.
- Dynamic values use the explicit `safelist` in `sax-icons.config.ts`.
- `mode: 'api'` fetches only used icons at build time and caches them locally.
- `DEFAULT_API_ENDPOINTS` exposes Iconify, SimpleSVG, and UniSVG for explicit selection.
- `mode: 'local'` reads installed Iconify JSON packages for offline builds.
- Collection JSON stays in the build process and is not shipped to browsers.

See the [Sax Design Vue icon guide](https://adoin.github.io/sax-design-vue/icons/) for configuration and usage.
