# Colors

<card>

## Default Colors

Sax Design Vue maintains a consistent palette across the application so theme changes stay predictable.

The main colors can be customized to match your product branding.

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

Sax Design Vue uses native CSS variables, so you can read and override them at any time.

You can change the main colors through CSS or JavaScript.

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

You can change Sax Design Vue variables through CSS like any other custom property.

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

You can change the main colors at any point in your application on the client side with `setCssVar()`.

::: warning
You can only use this function when the document object is available. For example, it cannot be used in the Vue `created()` hook because the DOM is not rendered yet.
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
