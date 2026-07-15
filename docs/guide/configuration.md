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

## Theme variables

Vuesax components read CSS variables such as `--vs-primary`. Override them on `:root` or `html.dark`:

<command>

```css
:root {
  --vs-primary: 37, 99, 255;
}

html.dark {
  --vs-primary: 96, 165, 250;
}
```

</command>

The documentation site uses the same variable system — use the navbar theme toggle to preview dark mode.

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

Use `unplugin-vue-components` with the resolver from `@vuesax-alpha/auto-import-resolver` (component names are unchanged). Point imports at **sax-design-vue**:

<command>

```ts
import path from 'node:path'
import Components from 'unplugin-vue-components/vite'
import { VuesaxAlphaResolver } from '@vuesax-alpha/auto-import-resolver'

export default defineConfig({
  resolve: {
    alias: {
      'vuesax-alpha': path.resolve(__dirname, 'node_modules/sax-design-vue'),
    },
  },
  plugins: [
    Components({
      resolvers: [VuesaxAlphaResolver({ importStyle: 'sass' })],
    }),
  ],
})
```

</command>

Alternatively, import components directly from `sax-design-vue` for full control.

</card>

<card>

## Nuxt

See [Usage with Nuxt](/guide/nuxt/) for SSR-specific notes.

</card>
