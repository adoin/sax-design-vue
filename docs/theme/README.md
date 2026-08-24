# Colors

<card>

## Default Colors

Sax Design Vue maintains primary, success, danger, warn, and dark semantic colors.

<colors-default />

</card>

<card>

## HSL Theme Key

Component colors are stored as HSL channels. Define `primary` once; hover, active, and subtle states keep its H value and change only S/L. Dark mode uses the same H with its own S/L scale.

Use `SConfigProvider` for application themes:

<command>

```vue
<script setup lang="ts">
const theme = {
  primary: '#5b3cc4',
  // Optional: a same-hue dark primary is derived when omitted.
  darkPrimary: 'hsl(252 82% 72%)',
  states: {
    hover: { saturation: -2, lightness: -7 },
    active: { saturation: -4, lightness: -12 },
  },
  darkStates: {
    hover: { lightness: 7 },
    active: { lightness: 12 },
  },
}
</script>

<template>
  <s-config-provider :theme="theme">
    <App />
  </s-config-provider>
</template>
```

</command>

</card>

<card>

## CSS

When using CSS directly, provide HSL channels without `hsl()`.

<command>

```css
:root {
  --sax-theme-primary-h: 252deg;
  --sax-theme-primary-s: 54%;
  --sax-theme-primary-l: 50%;
  --sax-theme-primary-dark-h: var(--sax-theme-primary-h);
  --sax-theme-primary-dark-s: 82%;
  --sax-theme-primary-dark-l: 72%;
}
```

</command>

</card>

<card>

## Runtime Themes

`applyThemeConfig()` accepts the same object as `SConfigProvider` and returns a restore function.

<command>

```vue
<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { applyThemeConfig } from 'sax-design-vue'

let restoreTheme: (() => void) | undefined

onMounted(() => {
  restoreTheme = applyThemeConfig({ primary: '#5b3cc4' })
})

onBeforeUnmount(() => restoreTheme?.())
</script>
```

</command>

</card>
