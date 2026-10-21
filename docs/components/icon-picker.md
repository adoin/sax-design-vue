---
API_TITLES:
  PROPS: Call options
PROPS:
  - name: locale
    type: Language
    values: 'Component locale object'
    description: Locale used by the dialog and its nested controls.
    default: English
  - name: title
    type: String
    values: 'Dialog title'
    description: Override the default title.
    default: Insert icon
  - name: iconList
    type: readonly string[]
    values: 'Iconify names or registered local SVG names'
    description: Candidate names; missing Iconify data loads when the picker opens.
    default: 168 common Carbon candidate names
  - name: api
    type: boolean | IconPickerApiOptions
    values: 'true / false / { baseUrl, collections, timeout }'
    description: true loads missing data from public Iconify; an object selects an intranet endpoint; false disables requests and requires prepared icon data.
    default: 'true'
    usage: '#icon-data-sources'
  - name: initialIcon
    type: String
    values: 'prefix:name'
    description: Initially selected icon.
    default: "''"
  - name: output
    type: String
    values: 'svg / code'
    description: Return complete SVG or a compact object containing code, color, and size.
    default: svg
  - name: color
    type: String
    values: 'HEX / RGB / HSL'
    description: Initial icon color.
    default: '#5667F4'
  - name: size
    type: Number
    values: '8 - 256'
    description: Fix the output size; omit it to let the user choose in the dialog.
    default: Dialog selection, initially 24
  - name: label
    type: String
    values: 'Accessible text'
    description: Adds role=img and aria-label; omitted output is decorative.
    default: null
  - name: showName
    type: Boolean
    values: 'true / false'
    description: Show names in the icon grid.
    default: 'true'
  - name: showAlpha
    type: Boolean
    values: 'true / false'
    description: Allow alpha selection.
    default: 'false'
  - name: predefine
    type: Array
    values: 'Color presets'
    description: Preset colors passed to the color picker.
    default: '[]'
  - name: maskClosable
    type: Boolean
    values: 'true / false'
    description: Allow closing by clicking the overlay.
    default: 'true'
  - name: confirmText
    type: String
    values: 'Button labels'
    description: Custom confirm and cancel labels.
    default: null
  - name: cancelText
    type: String
    values: 'Button labels'
    description: Custom confirm and cancel labels.
    default: null
description: 'Choose an icon, color, and size in a Promise-based dialog, then return compact icon data or complete SVG.'
---

# Icon Picker

<card>

IconPicker provides a Promise-based icon selection dialog. `output: 'svg'`
returns a complete SVG string, while `output: 'code'` returns a compact object
containing the icon code, color, and size. Cancellation, closing, or invocation
during server rendering returns `undefined`.

Passing `size` fixes the output dimensions. If it is omitted, the user can
choose a size from 8–256 px directly in the dialog.

The default catalog contains 168 candidate names without SVG payloads. IconPicker accepts registered data or an API and does not require a public service. However, default `api: true` retrieves missing data from public Iconify. For restricted networks, review [data sources](#icon-data-sources), use a [self-hosted API](#self-hosted-api), or prepare [offline icons](#offline-icons).

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: 'Insert icon',
  output: 'svg',
  color: '#5667F4',
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)

const icon = await SIconPicker({ output: 'code' })
// { code: 'cb:rocket', color: '#5667F4', size: 24 }
```

</card>

<card>

## Rich-text insertion

Place the caret in the editable area below and choose “Insert icon”. The demo
stores and inserts only the SVG returned by the Promise, not an icon name.

<template #example><icon-picker-default /></template>

<template #template>

@[code{64-93}](../.vuepress/components/icon-picker/default.vue)

</template>

<template #script>

@[code{1-62}](../.vuepress/components/icon-picker/default.vue)

</template>

<template #style>

@[code{95-148}](../.vuepress/components/icon-picker/default.vue)

</template>

</card>

<card>

## Icon data sources

IconPicker reuses application registrations and internal control fallbacks before loading missing candidates. Ordinary `SIcon` never starts a request, and the component library does not embed the full candidate SVG catalog.

| Environment                              | Recommended configuration                            | Runtime requirement                                                              |
| ---------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Public internet available                | Default `api: true`                                  | The browser can reach `https://api.iconify.design`                               |
| Private network with application servers | `api: { baseUrl: 'https://icons.intranet.example' }` | The browser can reach your Iconify-compatible service; no public API is required |
| Fully offline or static delivery         | `api: false` with a prepared `iconList`              | No icon API is required                                                          |

If a firewall, CSP, unreachable service or timeout prevents loading, missing candidates are unavailable. The dialog shows a failure message and retry action; existing data remains usable, but unloaded candidates are omitted. The default configuration is not a complete offline icon library. If no candidate is available locally and the API cannot be reached, there are no selectable icons.

Successful results are cached only for the current page. Reloading still needs a data source: this cache is not an offline asset store. Closing aborts pending requests.

</card>

<card>

## Self-hosted API

For larger intranet catalogs, deploy Iconify API with Docker and configure its address in the application. The official repository provides [`iconify/api` image instructions](https://github.com/iconify/api#docker) and [icon source configuration](https://github.com/iconify/api/blob/main/src/config/icon-sets.ts).

Self-hosting does not automatically make a deployment offline: default icon sources can fetch updates when the service starts. For an isolated network, prepare the image and required Iconify JSON sets beforehand and serve local files instead of downloading data at runtime.

1. In a connected preparation environment, obtain the `iconify/api` image and `icons.json` from `@iconify-json/carbon`. Save the JSON as `icon-sets/carbon.json`; the filename must match its JSON `prefix: "carbon"`. Add other collections as separate prefix-named JSON files.
2. Import the image and data into the private network. Put this `compose.yaml` beside the `icon-sets` directory:

```yaml
services:
  iconify-api:
    image: iconify/api:latest
    pull_policy: never
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      ICONIFY_SOURCE: none
      ALLOW_UPDATE: 'false'
    volumes:
      - ./icon-sets:/data/iconify-api/icons:ro
```

```sh
docker compose up -d
```

`pull_policy: never` uses only an image already imported on the host; see the [Compose pull policy specification](https://github.com/compose-spec/compose-spec/blob/main/container_spec.md#pull_policy). `ICONIFY_SOURCE: none` disables remote official icon sources and loads only the mounted local JSON. Default candidates require `carbon.json`; an empty directory cannot serve them. These files belong to the API service, not a frontend import of the full collection. For deployment, replace the sample `latest` with a verified tag or digest and import that image into the isolated network beforehand.

3. Verify that `http://server-address:3000/carbon.json?icons=home,search` returns icon JSON, then configure the picker:

```ts
import { SIconPicker } from 'sax-design-vue'

const icon = await SIconPicker({
  output: 'code',
  api: {
    baseUrl: 'https://icons.intranet.example',
    collections: { cb: 'carbon' },
    timeout: 10000,
  },
  iconList: ['cb:home', 'cb:search'],
})
```

`baseUrl` must be reachable by the user's browser, not just a Docker-only service hostname. Cross-origin services must allow the frontend origin. HTTPS pages should use an HTTPS API; a same-origin reverse proxy is another option. See the [official reverse proxy guide](https://iconify.design/docs/api/hosting-js/reverse-proxy.html).

The intranet API supplies data; `iconList` still selects the candidates. This picker does not automatically search every icon hosted on the server. A configured endpoint receives all missing-data requests; failures do not fall back to the public API.

</card>

<card>

## Offline icons

For a fixed catalog, prebundle icons during the business application's build and run with `api: false`. SVG data belongs to that application bundle; the component library still contains only internal control icons.

Install the required collection in the application's build environment:

```sh
pnpm add -D sax-design-vue-iconify @iconify-json/carbon
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { saxIcons } from 'sax-design-vue-iconify/vite'

export default defineConfig({
  plugins: [
    saxIcons({
      mode: 'local',
      collections: { cb: 'carbon' },
      safelist: ['cb:home', 'cb:search'],
    }),
    vue(),
  ],
})
```

```ts
import { SIconPicker } from 'sax-design-vue'

const icon = await SIconPicker({
  api: false,
  iconList: ['cb:home', 'cb:search'],
  output: 'code',
})
```

Build dependencies must also be staged in an isolated environment. `mode: 'local'` reads local collections at build time, and the browser needs no icon service. Alternatively, build with `mode: 'api'` while connected, then deploy the resulting application offline. SSR and non-HTML entries must import `virtual:sax-icons/register` before rendering to apply the safelist.

Register project SVGs as names such as `lo-home` with [`signSvgs`](../icons/#local-svg-files), or register data through `addIconDataRecord`. Dynamic candidates must be covered by the application's safelist. Setting `api: false` alone does not populate all 168 default candidates: unregistered icons without control fallbacks remain unavailable. Pass an explicit, prepared `iconList`.

</card>

<card>

## Output formats and icon source

`SIconPicker(options)`, `openIconPicker(options)`, and the installed
`this.$iconPicker(options)` property call the same service:

```ts
interface IconPickerCodeResult {
  code: string
  color: string
  size: number
}
```

- `output: 'svg'` returns a complete `<svg>...</svg>` string that can be inserted into HTML without an icon runtime.
- `output: 'code'` returns `IconPickerCodeResult`; it is more compact, but later rendering requires the matching icon collection.
- Cancel or close returns `undefined`.
- `iconList` controls what can be selected in this invocation.
- Data comes from application registrations, control fallbacks or the configured trusted API. ColorPicker normalizes the output color. See [data sources](#icon-data-sources) for network/offline requirements; restricted networks should prefer a [self-hosted API](#self-hosted-api).

</card>
