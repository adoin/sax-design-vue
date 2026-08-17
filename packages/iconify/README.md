# sax-design-vue-iconify

Vite-only Iconify integration for Sax Design Vue.

- Static `<s-icon name="cb:add" />` values become direct per-icon SVG imports.
- Dynamic values use the explicit `safelist` in `sax-icons.config.ts`.
- `mode: 'api'` fetches only used icons at build time and caches them locally.
- `DEFAULT_API_ENDPOINTS` exposes Iconify, SimpleSVG, and UniSVG for explicit selection.
- `mode: 'local'` reads installed Iconify JSON packages for offline builds.
- Collection JSON stays in the build process and is not shipped to browsers.

See the [Sax Design Vue icon guide](https://adoin.github.io/sax-design-vue/icons/) for configuration and usage.
