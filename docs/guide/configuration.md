# Configuration

<card>

## Global registration

Register the full library once at app bootstrap:

<command>

```ts
import SaxDesignVue from 'sax-design-vue'

app.use(SaxDesignVue)
```

</command>

For tree-shaking, register only the components you need — see [Using Components](/guide/using-components).

</card>

<card>

## Color tokens

Color tokens have two layers. Channel tokens such as `--sax-primary` store HSL values. Complete color tokens such as `--sax-css-primary` wrap them as `hsl(var(--sax-primary))`. Components consume the complete color tokens (`var(--sax-css-primary)` or `color-mix(in srgb, var(--sax-css-primary) 12%, transparent)`), so a theme can still edit H/S/L while an application can override `--sax-css-primary` with any CSS color.

<command>

```css
:root {
  --sax-theme-primary-h: 222.8deg;
  --sax-theme-primary-s: 100%;
  --sax-theme-primary-l: 54.9%;
  --sax-theme-primary-dark-h: var(--sax-theme-primary-h);
  --sax-theme-primary-dark-s: 92%;
  --sax-theme-primary-dark-l: 70%;
}

.hero {
  --sax-css-primary: oklch(0.62 0.18 264);
}
```

</command>

Pass `theme` to `SConfigProvider`, or call `applyThemeConfig()`, with HEX, RGB, or HSL values. Both generate the base primary, dark primary, and hover / active / subtle variables. See [Color themes](/theme/) for examples. Composite tokens such as `--sax-primary` remain readable, but theme customization should target the `--sax-theme-primary-*` keys. Override `--sax-css-*` when a complete CSS color is needed.

</card>

<card>

## Component language

Component-generated copy — including calendar months and weekdays, date/time controls, pagination, upload states, empty states, action buttons, and accessibility labels — reads from the locale supplied to `SConfigProvider`. English is the default. Use the built-in Chinese locale for Chinese UI:

<command>

```vue
<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <app />
  </s-config-provider>
</template>
```

</command>

Use `en` from the same entry for explicit English. The locale object is reactive, so changing the value passed to `locale` updates component-generated text without recreating the component tree. User-provided labels, slots, and placeholders remain under application control.

</card>

<card>

## Global date and time settings

Set a default IANA `timezone` for Date Picker, Date Range Picker, and Time Picker through `SConfigProvider`. `auto-apply-now` controls whether clicking Now immediately commits and closes. Component-level values take precedence.

<command>

```vue
<template>
  <s-config-provider timezone="Asia/Shanghai" :auto-apply-now="true">
    <app />
  </s-config-provider>
</template>
```

</command>

The time zone leaves the entered wall-clock fields unchanged but changes the corresponding `Date`, `value-format="x"`, or `value-format="timestamp"` instant. `timestamp` emits numeric milliseconds; `x` emits a millisecond string.

Date components can render directly in SSR and SSG. Configure the same `timezone` on the server and client to avoid hydration differences for absolute values. Consider `client-only` only when the application intentionally relies on the browser system zone.

</card>

<card>

## Global component shape

Set `shape="square"` on `SConfigProvider` to make compatible controls and their popups use square corners by default. A component-level `shape` still takes precedence, so individual controls can opt back into `rounded`, `circle`, or `pill` when supported.

<command>

```vue
<template>
  <s-config-provider shape="square">
    <s-input placeholder="Inherited square input" />
    <s-select placeholder="Inherited square select" />
    <s-button>Inherited square button</s-button>

    <s-input shape="rounded" placeholder="Local rounded override" />
  </s-config-provider>
</template>
```

</command>

The default remains `rounded` when no global value is configured. The setting is inherited by nested providers unless a nested provider supplies its own `shape`.

The same option can be configured once during full-library installation: `app.use(SaxDesignVue, { shape: 'square' })`.

</card>

<card>

## Global size

`size` sets the default density for components that use the shared `small` / `default` / `large` scale. Button, Input, Date Picker, Time Picker, Rate, Steps, Tabs, and Tag currently inherit it. An explicit component `size` always takes precedence.

<command>

```vue
<template>
  <s-config-provider size="large">
    <s-input placeholder="Inherits large" />
    <s-button>Inherits large</s-button>
    <s-button size="small">Locally overridden to small</s-button>
  </s-config-provider>
</template>
```

</command>

Components such as Calendar and Navbar have their own size vocabularies (for example, `medium` and `compact`) and therefore do not inherit this scale.

</card>

<card>

## Common interaction defaults

Application-wide interaction policies can be shared through `button`, `dialog`, `drawer`, `notification`, `pagination`, and `popper`. Each object accepts only reusable defaults; content, controlled values, callbacks, and business data remain local to component instances.

<command>

```vue
<script setup lang="ts">
const buttonDefaults = { debounce: false }
const dialogDefaults = { maskClosable: false, lockScroll: true }
const notificationDefaults = {
  duration: 6000,
  position: 'top-right' as const,
  showClose: true,
}
const paginationDefaults = {
  pageSizes: [20, 50, 100],
  pagerCount: 9,
}
</script>

<template>
  <s-config-provider
    :button="buttonDefaults"
    :dialog="dialogDefaults"
    :notification="notificationDefaults"
    :pagination="paginationDefaults"
  >
    <app />
  </s-config-provider>
</template>
```

</command>

Drawer can share its placement, size, close button, mask dismissal, and Teleport defaults. Direct `SPopper` usage can share show/hide delays, Teleport, positioning strategy, flipping, offset, arrow, and persistence. Composed components such as Tooltip, Select, and Date Picker keep their own semantic defaults and are not unexpectedly changed by the low-level `popper` configuration.

</card>

<card>

## Global Table defaults

Use `table` to share feature policies and presentation defaults across Table instances. It accepts reusable editing, validation, history, change tracking, dragging, keyboard, range, clipboard, find, chart, context-menu, resizing, virtualization, multi-sort, selection, pagination, overflow, parent-indicator, header, alignment, striped, selection-mode, and `rowKey` settings. `align` defaults both headers and cells to left when omitted; `headerAlign` overrides headers only.

<command>

```vue
<script setup lang="ts">
import type { TableGlobalConfig } from 'sax-design-vue'

const tableDefaults: TableGlobalConfig = {
  striped: true,
  align: 'left',
  headerAlign: 'center',
  showOverflow: 'tooltip',
  editConfig: {
    mode: 'cell',
    onSwitch: 'commit',
    onContextChange: 'cancel',
    onScroll: 'keep',
  },
  selectionConfig: { trigger: 'row', reserve: true },
  virtualConfig: { estimateSize: 48, overscan: 6 },
}
const rows = [{ id: 1, name: 'Example' }]
const columns = [{ field: 'name', title: 'Name' }]
</script>

<template>
  <s-config-provider :table="tableDefaults">
    <s-table :data="rows" :columns="columns" />

    <!-- Scalars and false replace defaults; object fields are merged. -->
    <s-table
      :data="rows"
      :columns="columns"
      :striped="false"
      :edit-config="false"
      :selection-config="{ trigger: 'cell' }"
    />
  </s-config-provider>
</template>
```

</command>

Precedence is “explicit component value > nearest Provider > outer Provider > built-in component default.” Object configurations are shallow-merged by field, and an explicit `false` disables a globally enabled feature. Data, controlled state, columns, renderers, validation rules, business requests, and model-specific callbacks stay local to each Table so unrelated data models never become implicitly coupled.

</card>

<card>

## Shape and motion tokens

Use the global tokens below to keep component geometry and motion consistent. `--sax-radius` is the master corner radius: core inputs, menus, popups, trees, buttons, pagination, and other shared controls inherit from it through the scale variables.

<command>

```css
:root {
  /* Change one value to reshape the shared component scale. */
  --sax-radius: 10px;

  /* Change one value to speed up or slow down shared interactions. */
  --sax-motion-duration: 180ms;
  --sax-motion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

</command>

| Variable                                                                                                                  | Default                           | Purpose                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--sax-radius`                                                                                                            | `12px`                            | Master radius for standard surfaces and controls.                                                     |
| `--sax-radius-xs` / `--sax-radius-sm` / `--sax-radius-md`                                                                 | derived                           | Compact control radii, derived from the master radius.                                                |
| `--sax-radius-lg` / `--sax-radius-xl` / `--sax-radius-2xl` / `--sax-radius-3xl`                                           | derived                           | Large containers, emphasized surfaces, and expressive legacy shapes.                                  |
| `--sax-radius-pill` / `--sax-radius-circle`                                                                               | `9999px` / `50%`                  | Semantic values for pill and circular controls.                                                       |
| `--sax-radius-loader-orb-a` / `-b` / `-c`                                                                                 | derived shape presets             | Optional overrides for the three asymmetric loader illustrations.                                     |
| `--sax-radius-avatar` / `--sax-radius-checkbox`                                                                           | `35%` / `32%`                     | Optional shape overrides for avatar and checkbox visual variants.                                     |
| `--sax-motion-duration`                                                                                                   | `0.25s`                           | Shared transition duration.                                                                           |
| `--sax-motion-duration-fast` / `--sax-motion-duration-slow` / `--sax-motion-duration-loop` / `--sax-motion-duration-long` | `0.18s` / `0.43s` / `0.7s` / `1s` | Optional durations for compact state changes, entrances, looped animation, and long list transitions. |
| `--sax-motion-easing`                                                                                                     | `cubic-bezier(.645,.045,.355,1)`  | Default shared easing curve.                                                                          |
| `--sax-motion-easing-emphasized` / `--sax-motion-easing-standard`                                                         | built-in curves                   | Optional easing overrides for entrance and state-change motion.                                       |

Pill and circle shapes intentionally use their semantic tokens so they remain pill-shaped and circular. The legacy `--sax-border-radius-*` and `--sax-transition-*` variables remain available. They now resolve through these global tokens, so existing overrides continue to work.

</card>

<card>

## Per-component configuration

Each component page documents:

- **Props** — typed configuration (color, size, variants)
- **Events** — `v-model` and interaction callbacks
- **Slots** — composition and custom content
- **Example + code** — live preview with copy-ready snippets

Start from the default example, then jump to the API table at the bottom of the page.

</card>

<card>

## Auto-import (Vite)

Vite already resolves `sax-design-vue` from `node_modules`; no alias is needed. Install `unplugin-vue-components`, then use a small resolver for **S**-prefixed components. Import Sax styles once from your application entry file.

<command>

```ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'

const SaxDesignVueResolver = (name: string) => {
  if (!name.startsWith('S')) return

  return { name, from: 'sax-design-vue' }
}

export default defineConfig({
  plugins: [
    Components({
      resolvers: [SaxDesignVueResolver],
    }),
  ],
})
```

</command>

```ts
// src/main.ts
import 'sax-design-vue/theme-chalk/index.css'
import 'sax-design-vue/theme-chalk/dark/css-vars.css'
```

This resolver imports components from the package root; it does not need a filesystem path. Alternatively, import components directly from `sax-design-vue` for full control.

</card>

<card>

## Nuxt

See [Usage with Nuxt](/guide/nuxt.html) for SSR-specific notes.

</card>
