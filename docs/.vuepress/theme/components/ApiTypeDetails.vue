<script setup lang="ts">
import { nextTick, shallowRef, useId, watch } from 'vue'
import { useEscapeKeydown, useZIndex } from '@vuesax-alpha/hooks'
import { SPopper } from '@vuesax-alpha/components/popper'

import ApiTypeTokens from './ApiTypeTokens.vue'
import type { ThemeApiTypeDefinition } from '../shared/frontmatter/normal'

interface Props {
  type: string
  definitions?: Record<string, ThemeApiTypeDefinition>
  labels: {
    openTypeDetails: string
    closeTypeDetails: string
    typeDetailsTitle: string
    currentType: string
    referencedTypes: string
    noReferencedTypes: string
    source: string
  }
}

interface TypeLayer {
  key: number
  definition: ThemeApiTypeDefinition
  trigger: HTMLElement
  triggerTokenIndex: number
  zIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  definitions: () => ({}),
})

const layers = shallowRef<TypeLayer[]>([])
const rootTrigger = shallowRef<HTMLElement>()
const { nextZIndex } = useZIndex()
const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const stackClass = `api-type-stack-${instanceId}`
const stackSelector = `.${stackClass}`
let layerKey = 0

const closeStack = async (restoreFocus = false) => {
  const focusTarget = restoreFocus ? rootTrigger.value : undefined
  layers.value = []
  rootTrigger.value = undefined
  if (focusTarget) {
    await nextTick()
    focusTarget.focus()
  }
}

const openReference = (
  name: string,
  tokenIndex: number,
  parentIndex: number,
  event: MouseEvent,
) => {
  const definition = props.definitions[name]
  const trigger = event.currentTarget
  if (!definition || !(trigger instanceof HTMLElement)) return

  const targetIndex = parentIndex + 1
  const activeLayer = layers.value[targetIndex]
  if (
    activeLayer?.definition.name === name &&
    activeLayer.trigger === trigger
  ) {
    layers.value = layers.value.slice(0, targetIndex)
    if (targetIndex === 0) rootTrigger.value = undefined
    return
  }

  if (
    layers.value
      .slice(0, targetIndex)
      .some((layer) => layer.definition.name === name)
  ) {
    return
  }

  if (targetIndex === 0) rootTrigger.value = trigger
  layers.value = [
    ...layers.value.slice(0, targetIndex),
    {
      key: ++layerKey,
      definition,
      trigger,
      triggerTokenIndex: tokenIndex,
      zIndex: nextZIndex(),
    },
  ]
}

const updateLayerVisible = (index: number, visible: boolean) => {
  if (!visible && index === 0) closeStack()
}

const pathThrough = (index: number) =>
  layers.value.slice(0, index + 1).map((layer) => layer.definition.name)

useEscapeKeydown((event) => {
  if (event.key === 'Escape' && layers.value.length) closeStack(true)
})

watch([() => props.type, () => props.definitions], () => closeStack())
</script>

<template>
  <span class="api-type-details-root" :class="stackClass">
    <ApiTypeTokens
      class="api-type-expression"
      :expression="type"
      :definitions="definitions"
      :active-reference="layers[0]?.definition.name"
      :active-reference-index="layers[0]?.triggerTokenIndex"
      :open-label="labels.openTypeDetails"
      :close-label="labels.closeTypeDetails"
      @open-reference="
        (name, tokenIndex, event) => openReference(name, tokenIndex, -1, event)
      "
    />
  </span>

  <SPopper
    v-for="(layer, index) in layers"
    :key="layer.key"
    :visible="true"
    :virtual-ref="layer.trigger"
    virtual-triggering
    :trigger="[]"
    :placement="index === 0 ? 'bottom-start' : 'right-start'"
    :offset="8"
    :z-index="layer.zIndex"
    :show-arrow="true"
    :close-on-click-outside="index === 0"
    :outside-click-ignore="[stackSelector]"
    :popper-class="['api-type-popper', stackClass]"
    @update:visible="updateLayerVisible(index, $event)"
  >
    <template #content>
      <article
        :id="`api-type-layer-${instanceId}-${index}`"
        class="api-type-definition"
        :data-layer="index + 1"
        role="region"
        :aria-label="`${labels.typeDetailsTitle}: ${layer.definition.name}`"
      >
        <header class="api-type-definition__header">
          <strong>{{ layer.definition.name }}</strong>
          <span :title="layer.definition.source">
            {{ labels.source }} · {{ layer.definition.source }}
          </span>
        </header>
        <pre class="api-type-definition__code"><ApiTypeTokens
          :expression="layer.definition.declaration"
          :definitions="definitions"
          :references="layer.definition.references"
          :disabled-references="pathThrough(index)"
          :active-reference="layers[index + 1]?.definition.name"
          :active-reference-index="layers[index + 1]?.triggerTokenIndex"
          :open-label="labels.openTypeDetails"
          :close-label="labels.closeTypeDetails"
          @open-reference="
            (name, tokenIndex, event) =>
              openReference(name, tokenIndex, index, event)
          "
        /></pre>
      </article>
    </template>
  </SPopper>
</template>

<style scoped lang="scss">
.api-type-details-root {
  display: inline;
  min-width: 0;
}

.api-type-expression {
  overflow-wrap: anywhere;
  font-size: 0.78rem;
  line-height: 1.55;
}

.api-type-definition {
  width: min(560px, calc(100vw - 24px));
  max-height: min(440px, calc(100vh - 32px));
  overflow: auto;
  user-select: text;
  color: hsl(var(--sax-theme-color));
}

.api-type-definition__header {
  position: sticky;
  z-index: 1;
  top: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid hsl(var(--sax-theme-color) / 0.08);
  background: hsl(var(--sax-background));
}

.api-type-definition__header strong {
  color: hsl(var(--sax-accent-secondary));
  font-size: 0.84rem;
}

.api-type-definition__header span {
  max-width: 68%;
  overflow: hidden;
  color: hsl(var(--sax-theme-color) / 0.62);
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-type-definition__code {
  margin: 0;
  padding: 14px;
  overflow: auto;
  background: transparent;
  font-size: 0.72rem;
  line-height: 1.65;
  tab-size: 2;
  white-space: pre;
}

.api-type-definition__code :deep(.api-type-code) {
  white-space: pre;
}

@media (max-width: 720px) {
  .api-type-definition {
    width: min(92vw, 560px);
  }

  .api-type-definition__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .api-type-definition__header span {
    max-width: 100%;
  }
}
</style>
