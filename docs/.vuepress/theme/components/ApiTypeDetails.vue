<script setup lang="ts">
import { computed, nextTick, shallowRef, useId, useTemplateRef } from 'vue'
import { useEscapeKeydown } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'

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

const props = withDefaults(defineProps<Props>(), {
  definitions: () => ({}),
})

const open = shallowRef(false)
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const contentId = `api-type-details-${useId()}`
const referencedDefinitions = computed(() => Object.values(props.definitions))
const triggerLabel = computed(() =>
  open.value ? props.labels.closeTypeDetails : props.labels.openTypeDetails,
)

useEscapeKeydown((event) => {
  if (event.key !== 'Escape' || !open.value) return
  open.value = false
  nextTick(() => trigger.value?.focus())
})
</script>

<template>
  <SPopper
    v-model:visible="open"
    trigger="click"
    placement="bottom-start"
    :offset="8"
    :show-arrow="true"
    popper-class="api-type-popper"
  >
    <button
      ref="trigger"
      class="api-type-trigger"
      type="button"
      :aria-controls="contentId"
      :aria-expanded="open"
      :aria-label="`${triggerLabel}: ${type}`"
    >
      <span>{{ type }}</span>
      <SIcon
        class="api-type-trigger__icon"
        :class="{ 'is-open': open }"
        name="bx:chevron-down"
        aria-hidden="true"
      />
    </button>

    <template #content>
      <section
        :id="contentId"
        class="api-type-details"
        role="region"
        :aria-label="labels.typeDetailsTitle"
      >
        <header class="api-type-details__header">
          <strong>{{ labels.typeDetailsTitle }}</strong>
          <span>{{ labels.currentType }}</span>
        </header>

        <code class="api-type-details__expression">{{ type }}</code>

        <div v-if="referencedDefinitions.length" class="api-type-details__list">
          <h4>{{ labels.referencedTypes }}</h4>
          <article
            v-for="definition in referencedDefinitions"
            :key="`${definition.source}:${definition.name}`"
            class="api-type-definition"
          >
            <header class="api-type-definition__header">
              <code>{{ definition.name }}</code>
              <span>{{ labels.source }} · {{ definition.source }}</span>
            </header>
            <pre><code>{{ definition.declaration }}</code></pre>
          </article>
        </div>

        <p v-else class="api-type-details__empty">
          {{ labels.noReferencedTypes }}
        </p>
      </section>
    </template>
  </SPopper>
</template>

<style scoped lang="scss">
.api-type-trigger {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border: 0;
  border-radius: 7px;
  background: hsl(var(--sax-accent-secondary) / 0.08);
  color: hsl(var(--sax-accent-secondary));
  cursor: pointer;
  font: inherit;
  line-height: 1.35;
  text-align: left;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.api-type-trigger:hover,
.api-type-trigger[aria-expanded='true'] {
  background: hsl(var(--sax-accent-secondary) / 0.14);
}

.api-type-trigger:focus-visible {
  outline: 2px solid hsl(var(--sax-primary));
  outline-offset: 2px;
}

.api-type-trigger__icon {
  flex: 0 0 auto;
  transition: transform 160ms ease;
}

.api-type-trigger__icon.is-open {
  transform: rotate(180deg);
}

.api-type-details {
  width: min(620px, calc(100vw - 24px));
  max-height: min(480px, calc(100vh - 32px));
  padding: 16px;
  overflow: auto;
  color: hsl(var(--sax-theme-color));
}

.api-type-details__header,
.api-type-definition__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.api-type-details__header strong {
  font-size: 0.92rem;
}

.api-type-details__header span,
.api-type-definition__header span {
  color: hsl(var(--sax-theme-color) / 0.72);
  font-size: 0.68rem;
}

.api-type-details__expression {
  display: block;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 9px;
  background: hsl(var(--sax-primary) / 0.09);
  color: hsl(var(--sax-accent-secondary));
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}

.api-type-details__list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.api-type-details__list h4 {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.api-type-definition {
  min-width: 0;
  overflow: hidden;
  border-radius: 10px;
  background: hsl(var(--sax-theme-color) / 0.055);
}

.api-type-definition__header {
  padding: 9px 11px;
  border-bottom: 1px solid hsl(var(--sax-theme-color) / 0.07);
}

.api-type-definition__header span {
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-type-definition pre {
  max-height: 240px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  background: transparent;
  color: hsl(var(--sax-theme-color));
  font-size: 0.72rem;
  line-height: 1.55;
  white-space: pre;
}

.api-type-definition pre code {
  padding: 0;
  background: transparent;
  color: hsl(var(--sax-theme-color)) !important;
  font: inherit;
  -webkit-text-fill-color: currentcolor;
}

.api-type-details__empty {
  margin: 12px 0 0;
  color: hsl(var(--sax-theme-color) / 0.72);
  font-size: 0.74rem;
}

@media (prefers-reduced-motion: reduce) {
  .api-type-trigger,
  .api-type-trigger__icon {
    transition: none;
  }
}
</style>
