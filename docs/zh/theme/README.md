# Colors

<card>

## Default Colors

Sax Design Vue 在全局维护一套主色，便于统一调整主题并保持视觉一致。

主色可按产品品牌自由定制。

Default colors:

- primary
- success
- danger
- warn
- dark

<colors-default />

</card>

<card>

## Customize Theme Colors

Sax Design Vue 使用原生 CSS 变量，可随时读取与覆盖。

可通过 CSS 或 JavaScript 修改主色。

</card>

<card>

## Javascript

<command>

```ts
import SaxDesignVue from 'sax-design-vue'

app.use(SaxDesignVue, {
  colors: {
    primary: '#5b3cc4',
    success: 'rgb(23, 201, 100)',
    danger: 'rgb(242, 19, 93)',
    warning: 'rgb(255, 130, 0)',
    dark: 'rgb(36, 33, 69)',
  },
})
```

</command>

</card>

<card>

## CSS

可通过 CSS 像修改普通变量一样覆盖 Sax Design Vue 主题变量。

::: warning HEX Format Numbers Only
It is important that the colors are in HEX format and only the numerical value for example: `rgb (255,100,50)` is equivalent to `255,100,50`
:::

<command>

```css
:root {
  --sax-primary: 91, 60, 196;
  --sax-success: 23, 201, 100;
  --sax-danger: 242, 19, 93;
  --sax-warn: 254, 130, 0;
  --sax-dark: 36, 33, 69;
}
```

</command>

</card>

<card>

## setCssVar

可在客户端任意时刻通过 `setCssVar()` 修改主色。

::: warning
仅当 document 可用时才能调用。例如不能在 Vue 的 `created()` 钩子中使用，因为 DOM 尚未渲染。
:::

<command>

```html
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { setCssVar } from 'sax-design-vue'

  onMounted(() => {
    setCssVar('primary', '#000')
  })
</script>
```

</command>

<command>

```ts
/**
 * @param propertyName The name of the property
 * @param value The value of the property
 * @param el The element to set the property. Default document.documentElement
 * @param namespace The namespace of the app. Default 'sax'
 */
const setCssVar: (
  propertyName: string,
  value: string,
  el?: HTMLElement,
  namespace?: string
) => void
```

</command>

</card>
