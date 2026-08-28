<template>
  <section class="live-example-preview">
    <header>{{ t.examples.livePreview }}</header>
    <div class="live-example-preview__canvas">
      <component :is="previewComponent" v-if="previewComponent" />
      <pre v-else-if="compileError" class="live-example-preview__error">{{
        compileError
      }}</pre>
      <span v-else class="live-example-preview__loading">{{
        t.examples.renderingExample
      }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useDocLocaleUi } from '../composables/docLocale'
import type { Component } from 'vue'

const props = defineProps<{
  source: string
  scopeKey: string
}>()

const previewComponent = shallowRef<Component | null>(null)
const compileError = ref<string | null>(null)
const { t } = useDocLocaleUi()

const compileSource = async () => {
  if (!props.source.trim()) {
    previewComponent.value = null
    compileError.value = t.value.examples.noExampleSource
    return
  }

  const [{ compileDemoSfc }, { demoRuntimeModules }] = await Promise.all([
    import('../../../../play/compile-demo-sfc'),
    import('../../../../play/demo-runtime-modules'),
  ])
  const result = compileDemoSfc(
    props.source,
    props.scopeKey,
    demoRuntimeModules,
  )
  previewComponent.value = result.component
  compileError.value = result.error
}

const scheduleCompile = useDebounceFn(async () => {
  await compileSource()
}, 180)

watch(
  () => [props.source, props.scopeKey],
  () => scheduleCompile(),
  { immediate: true },
)
</script>

<style scoped lang="scss">
.live-example-preview {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  background: hsl(var(--sax-theme-bg) / 0.84);
}

.live-example-preview > header {
  padding: 10px 14px;
  color: hsl(var(--sax-theme-color) / 0.7);
  border-bottom: 1px solid hsl(var(--sax-accent-color) / 0.1);
  font-size: 0.78rem;
  font-weight: 700;
}

.live-example-preview__canvas {
  min-height: 260px;
  flex: 1;
  padding: 20px;
}

.live-example-preview__loading {
  color: hsl(var(--sax-theme-color) / 0.56);
  font-size: 0.82rem;
}

.live-example-preview__error {
  margin: 0;
  color: hsl(var(--sax-danger));
  font:
    0.75rem/1.6 ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  white-space: pre-wrap;
}
</style>
