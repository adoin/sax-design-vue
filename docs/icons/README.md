# Icons

`SIcon` renders Iconify SVG data. No icon font, global CSS, or runtime Iconify API request is required. The Vite plugin extracts only the icons used by the application.

This integration targets Vite 4, 5, and 8. A Webpack adapter is intentionally not shipped.

## Find an icon

Search the [Iconify icon sets](https://icon-sets.iconify.design/), then copy the displayed `prefix:name` value.

- [Carbon](https://icon-sets.iconify.design/carbon/) — the default visual language used by Sax components, shortened to `cb:` in these examples.
- [BoxIcons](https://icon-sets.iconify.design/bx/) — use the friendly `bx:` alias in Sax templates.
- [BoxIcons Solid](https://icon-sets.iconify.design/bxs/) — use `bxs:`.
- [BoxIcons Logos](https://icon-sets.iconify.design/bxl/) — use `bxl:`.

```vue
<s-icon name="cb:add" />
<s-icon name="bx:book" />
<s-icon name="bxs:heart" />
```

## Install

Install the build plugin:

```bash
pnpm add -D sax-design-vue-iconify
```

## Configure collections and dynamic safelist

Create `sax-icons.config.ts` at the project root. API mode does not require any `@iconify-json/*` package:

```ts
import { defineSaxIconConfig } from 'sax-design-vue-iconify'

export default defineSaxIconConfig({
  mode: 'api',
  collections: {
    cb: 'carbon',
    bx: 'bx',
  },
  // Required only for values that cannot be discovered statically,
  // such as icon names returned by an API.
  safelist: ['cb:add', 'bx:book'],
})
```

Each left-hand key is the short prefix used by the application. Each value is an Iconify collection name. API mode requests only icons found by static scanning or `safelist`, then caches responses in `node_modules/.cache/sax-design-vue-iconify`. The first build needs network access; later builds reuse the cache.

For offline, version-pinned builds, use the default local mode and install collection packages:

```bash
pnpm add -D @iconify-json/carbon @iconify-json/bx
```

Remove `mode: 'api'` or set `mode: 'local'`. Use `api.baseUrl`, `api.cacheDir`, and `api.timeout` to customize the endpoint, cache path, and timeout. Set `cacheDir: false` to disable disk caching.

API mode exposes three selectable endpoints and uses the first one by default. Pick another entry explicitly, or pass a private Iconify-compatible URL:

```ts
import {
  DEFAULT_API_ENDPOINTS,
  defineSaxIconConfig,
} from 'sax-design-vue-iconify'

export default defineSaxIconConfig({
  mode: 'api',
  collections: { cb: 'carbon' },
  api: {
    // 0: Iconify, 1: SimpleSVG, 2: UniSVG
    baseUrl: DEFAULT_API_ENDPOINTS[1],
  },
})
```

Register the Vite plugin before Vue:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import iconConfig from './sax-icons.config'

export default defineConfig({
  plugins: [saxIcons(iconConfig), vue()],
})
```

The plugin injects the `safelist` registry into Vite HTML entries automatically. No entry-file registration code is needed.

## Tree shaking

Static names are discovered automatically:

```vue
<s-icon name="cb:add" />
```

The build obtains `add` from an installed collection or Iconify API and emits only that SVG data. Registering Carbon does not place the complete collection in the browser bundle or create runtime browser requests.

Dynamic names are not statically knowable:

```vue
<s-icon :name="record.icon" />
```

Add every possible dynamic value to `safelist`. Only those entries are emitted.

## Size, color, rotation, and rolling

<card>
<template #example>
  <icons-example />
</template>

<template #template>

@[code](../.vuepress/components/icons/example.vue)

</template>
</card>

`color` defaults to `currentColor`, so icons inherit surrounding text and theme colors.

Set `rolling` to `true` to use the `--sax-icon-rolling-duration` CSS default of `0.9s`. A positive number sets seconds per revolution through an inline CSS variable override; smaller values rotate faster:

```vue
<s-icon name="cb:renew" rolling />
<s-icon name="cb:renew" :rolling="1.8" />
```

## Common examples

<card>
<template #example>
  <icons-collection />
</template>
</card>

## API

| Property  | Type                             | Default        | Description                                         |
| --------- | -------------------------------- | -------------- | --------------------------------------------------- |
| `name`    | `string`                         | —              | Registered Iconify name in `prefix:name` format.    |
| `size`    | `number \| string`               | `1em`          | Width and height. Numbers use pixels.               |
| `color`   | `string`                         | `currentColor` | CSS color or Sax color token.                       |
| `rotate`  | `number \| string`               | `0`            | Rotation. Numbers use degrees.                      |
| `flip`    | `horizontal \| vertical \| both` | —              | Mirrors the icon.                                   |
| `rolling` | `boolean \| number`              | `false`        | Rotates continuously; number is seconds per turn.   |
| `label`   | `string`                         | —              | Accessible name. Without it the icon is decorative. |
