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
    <vs-spacer />
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
    <vs-divider>Default</vs-divider>
    <vs-divider color="primary">Primary</vs-divider>
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
    <vs-progress :percent="60" color="primary" />
    <vs-progress indeterminate color="success" />
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
    <vs-chip>Default</vs-chip>
    <vs-chip color="primary">Primary</vs-chip>
    <vs-chip color="success" transparent>Transparent</vs-chip>
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
  <vs-breadcrumb :items="items" color="primary" />
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
  <vs-textarea v-model="text" label="Notes" :counter="100" />
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
  <vs-collapse accordion>
    <vs-collapse-item open>
      <template #header>One</template>
      First panel
    </vs-collapse-item>
    <vs-collapse-item>
      <template #header>Two</template>
      Second panel
    </vs-collapse-item>
  </vs-collapse>
</template>
`,
  },
  {
    name: 'list',
    title: 'List',
    vueContent: `<template>
  <vs-list>
    <vs-list-item title="Inbox" subtitle="12 messages" icon="mail" />
    <vs-list-item title="Drafts" subtitle="3 items" icon="drafts" />
  </vs-list>
</template>
`,
  },
  {
    name: 'images',
    title: 'Images',
    vueContent: `<template>
  <vs-images hover="zoom">
    <vs-image src="https://picsum.photos/seed/a/300/300" />
    <vs-image src="https://picsum.photos/seed/b/300/300" />
    <vs-image src="https://picsum.photos/seed/c/300/300" />
  </vs-images>
</template>
`,
  },
  {
    name: 'prompt',
    title: 'Prompt',
    vueContent: `<template>
  <div>
    <vs-button @click="open = true">Open</vs-button>
    <vs-prompt
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
  <vs-tabs v-model="active" color="primary">
    <vs-tab label="One">Tab one</vs-tab>
    <vs-tab label="Two">Tab two</vs-tab>
  </vs-tabs>
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
  <vs-slider v-model="value" :min="0" :max="100" color="primary" />
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
  <vs-upload text="Upload files" :show-upload-button="false" />
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
