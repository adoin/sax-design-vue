<script setup lang="ts">
import { shallowRef } from 'vue'
import { ClientOnly } from '@vuepress/client'
import { useDocLocaleUi } from '../composables/docLocale'
import ExamplePlaygroundWorkspace from './ExamplePlaygroundWorkspace.vue'
import type { DocExampleRecord } from '../type'

const { t } = useDocLocaleUi()

const readExample = (): DocExampleRecord | null => {
  if (typeof window === 'undefined') return null

  const exampleId = new URLSearchParams(window.location.search).get('exampleId')
  if (!exampleId) return null

  try {
    const raw = window.sessionStorage.getItem(`sax-doc-example:${exampleId}`)
    if (!raw) return null
    const value = JSON.parse(raw) as DocExampleRecord
    return value.id === exampleId && value.source ? value : null
  } catch {
    return null
  }
}

const example = shallowRef<DocExampleRecord | null>(readExample())
const editedSource = shallowRef(example.value?.source || '')
</script>

<template>
  <ClientOnly>
    <div v-if="example" class="example-playground-embed">
      <ExamplePlaygroundWorkspace v-model="editedSource" :example="example" />
    </div>

    <div
      v-else
      class="example-playground-embed example-playground-embed--missing"
    >
      <strong>{{ t.examples.unavailable }}</strong>
      <p>{{ t.examples.unavailableDescription }}</p>
    </div>

    <template #fallback>
      <div class="example-playground-embed example-playground-embed--missing">
        {{ t.examples.loadingExample }}
      </div>
    </template>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.example-playground-embed {
  margin: 14px auto 30px;
  overflow: hidden;
  border: 1px solid hsl(var(--sax-accent-color) / 0.13);
  border-radius: 20px;
  background: hsl(var(--sax-theme-layout) / 0.88);
  box-shadow: 0 20px 60px rgba(55, 43, 145, 0.12);
}

.example-playground-embed--missing {
  padding: 28px;
  color: hsl(var(--sax-theme-color));

  p {
    margin-bottom: 0;
    color: hsl(var(--sax-theme-color) / 0.66);
  }
}
</style>
