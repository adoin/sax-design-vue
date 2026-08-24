# 颜色

<card>

## 默认颜色

Sax Design Vue 统一维护 primary、success、danger、warn 与 dark 等语义色。

<colors-default />

</card>

<card>

## HSL 主题主键

组件颜色统一保存为 HSL 通道。`primary` 只定义一次，hover、active 与 subtle 保持相同 H 值，只调整 S/L；暗色主题使用同一 H 值和独立的 S/L。

推荐通过 `SConfigProvider` 配置：

<command>

```vue
<script setup lang="ts">
const theme = {
  primary: '#5b3cc4',
  // 可省略；省略时按主色自动生成同 H 的暗色基色
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

直接使用 CSS 时只填写 HSL 通道，不包含 `hsl()`。

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

## 运行时切换

`applyThemeConfig()` 接收与 `SConfigProvider` 相同的配置，并返回恢复函数。

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
