#!/usr/bin/env tsx
/**
 * Generate minimal docs + vuepress demo stubs for newly added components.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

type DemoSpec = {
  name: string
  title: string
  vueContent: string
}

const demos: DemoSpec[] = [
  {
    name: 'spacer',
    title: 'Spacer',
    vueContent: `<template>
  <div class="center">
    <span>Left</span>
    <s-spacer />
    <span>Right</span>
  </div>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 420px;
  padding: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
}
</style>
`,
  },
  {
    name: 'divider',
    title: 'Divider',
    vueContent: `<template>
  <div class="center">
    <s-divider>Default</s-divider>
    <s-divider color="primary">Primary</s-divider>
  </div>
</template>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 420px;
}
</style>
`,
  },
  {
    name: 'progress',
    title: 'Progress',
    vueContent: `<template>
  <div class="center">
    <s-progress :percent="60" color="primary" />
    <s-progress indeterminate color="success" />
  </div>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}
</style>
`,
  },
  {
    name: 'chip',
    title: 'Chip',
    vueContent: `<template>
  <div class="center">
    <s-chip>Default</s-chip>
    <s-chip color="primary">Primary</s-chip>
    <s-chip color="success" transparent>Transparent</s-chip>
  </div>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
`,
  },
  {
    name: 'breadcrumb',
    title: 'Breadcrumb',
    vueContent: `<template>
  <s-breadcrumb :items="items" color="primary" />
</template>

<script setup lang="ts">
const items = [
  { title: 'Home', url: '#' },
  { title: 'Docs', url: '#' },
  { title: 'Breadcrumb', active: true },
]
</script>
`,
  },
  {
    name: 'textarea',
    title: 'Textarea',
    vueContent: `<template>
  <s-textarea v-model="text" label="Notes" :counter="100" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Hello textarea')
</script>
`,
  },
  {
    name: 'collapse',
    title: 'Collapse',
    vueContent: `<template>
  <s-collapse accordion>
    <s-collapse-item open>
      <template #header>One</template>
      First panel
    </s-collapse-item>
    <s-collapse-item>
      <template #header>Two</template>
      Second panel
    </s-collapse-item>
  </s-collapse>
</template>
`,
  },
  {
    name: 'list',
    title: 'List',
    vueContent: `<template>
  <s-list>
    <s-list-item title="Inbox" subtitle="12 messages" icon="mail" />
    <s-list-item title="Drafts" subtitle="3 items" icon="drafts" />
  </s-list>
</template>
`,
  },
  {
    name: 'images',
    title: 'Images',
    vueContent: `<template>
  <s-images hover="zoom">
    <s-image src="https://picsum.photos/seed/a/300/300" />
    <s-image src="https://picsum.photos/seed/b/300/300" />
    <s-image src="https://picsum.photos/seed/c/300/300" />
  </s-images>
</template>
`,
  },
  {
    name: 'prompt',
    title: 'Prompt',
    vueContent: `<template>
  <div>
    <s-button @click="open = true">Open</s-button>
    <s-prompt
      v-model="open"
      title="Confirm"
      text="Continue?"
      type="confirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
`,
  },
  {
    name: 'tabs',
    title: 'Tabs',
    vueContent: `<template>
  <s-tabs v-model="active" color="primary">
    <s-tab label="One">Tab one</s-tab>
    <s-tab label="Two">Tab two</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('One')
</script>
`,
  },
  {
    name: 'slider',
    title: 'Slider',
    vueContent: `<template>
  <s-slider v-model="value" :min="0" :max="100" color="primary" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(40)
</script>
`,
  },
  {
    name: 'upload',
    title: 'Upload',
    vueContent: `<template>
  <s-upload text="Upload files" :show-upload-button="false" />
</template>
`,
  },
]

for (const demo of demos) {
  const demoDir = path.join(ROOT, 'docs/.vuepress/components', demo.name)
  fs.mkdirSync(demoDir, { recursive: true })
  fs.writeFileSync(path.join(demoDir, 'default.vue'), demo.vueContent)

  const md = `---
PROPS: []
EVENTS: []
EXPOSES: []
NEWS:
  - default
---

# ${demo.title}

<card>

## Default

<template #example>
<${demo.name}-default />
</template>

<template #template>

@[code vue](../.vuepress/components/${demo.name}/default.vue)

</template>

</card>

<card>

## API

</card>
`
  fs.writeFileSync(path.join(ROOT, `docs/components/${demo.name}.md`), md)
}

console.log(`Generated docs for ${demos.length} components.`)
