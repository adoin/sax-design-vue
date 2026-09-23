<script setup lang="ts">
import { reactive } from 'vue'
import type { DividerProps } from 'sax-design-vue'

const settings = reactive({
  direction: 'horizontal' as DividerProps['direction'],
  variant: 'plain' as DividerProps['variant'],
  position: 'center' as DividerProps['position'],
  color: 'primary',
  background: 'transparent',
  labelColor: '',
  borderStyle: 'solid' as DividerProps['borderStyle'],
  borderHeight: '1px',
  gap: '12px',
  content: 'text' as 'text' | 'icon' | 'none',
})

const directionOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
]
const contentOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Icon', value: 'icon' },
  { label: 'Line only', value: 'none' },
]
const positionOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Left center', value: 'left-center' },
  { label: 'Center', value: 'center' },
  { label: 'Right center', value: 'right-center' },
  { label: 'Right', value: 'right' },
]
const variantOptions = [
  { label: 'Plain', value: 'plain' },
  { label: 'Soft', value: 'soft' },
  { label: 'Solid', value: 'solid' },
]
const colorOptions = [
  { label: 'Neutral', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
  { label: 'Custom violet', value: '#8756d8' },
]
const backgroundOptions = [
  { label: 'None', value: 'transparent' },
  { label: 'Lavender', value: '#edf1ff' },
  { label: 'Mint', value: '#e8f7f1' },
  { label: 'Dark', value: 'dark' },
]
const labelColorOptions = [
  { label: 'Automatic', value: '' },
  { label: 'Deep blue', value: '#334888' },
  { label: 'Deep green', value: '#246853' },
  { label: 'White', value: '#ffffff' },
]
const lineStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
]
const lineHeightOptions = [
  { label: '1 px', value: '1px' },
  { label: '2 px', value: '2px' },
  { label: '3 px', value: '3px' },
]
const gapOptions = [
  { label: '8 px', value: '8px' },
  { label: '12 px', value: '12px' },
  { label: '20 px', value: '20px' },
]
</script>

<template>
  <div class="divider-configurator">
    <div class="divider-configurator__controls">
      <div class="divider-configurator__group">
        <h3>Composition</h3>
        <div class="divider-configurator__fields">
          <s-select
            v-model="settings.direction"
            label="Direction"
            :options="directionOptions"
          />
          <s-select
            v-model="settings.content"
            label="Content"
            :options="contentOptions"
            :disabled="settings.direction === 'vertical'"
          />
          <s-select
            v-model="settings.position"
            label="Position"
            :options="positionOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.gap"
            label="Content gap"
            :options="gapOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
        </div>
      </div>
      <div class="divider-configurator__group">
        <h3>Appearance</h3>
        <div class="divider-configurator__fields">
          <s-select
            v-model="settings.variant"
            label="Label variant"
            :options="variantOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.color"
            label="Accent"
            :options="colorOptions"
          />
          <s-select
            v-model="settings.background"
            label="Custom surface"
            :options="backgroundOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.labelColor"
            label="Label color"
            :options="labelColorOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.borderStyle"
            label="Line style"
            :options="lineStyleOptions"
          />
          <s-select
            v-model="settings.borderHeight"
            label="Line thickness"
            :options="lineHeightOptions"
          />
        </div>
      </div>
    </div>

    <div class="divider-configurator__preview">
      <span class="divider-configurator__eyebrow">Live preview</span>
      <div
        v-if="settings.direction === 'vertical'"
        class="divider-configurator__inline"
      >
        <span>Overview</span>
        <s-divider
          direction="vertical"
          :color="settings.color"
          :border-style="settings.borderStyle"
          :border-height="settings.borderHeight"
        />
        <span>Activity</span>
      </div>
      <div v-else class="divider-configurator__stack">
        <span>Recent updates</span>
        <s-divider
          :variant="settings.variant"
          :position="settings.position"
          :color="settings.color"
          :background="settings.background"
          :label-color="settings.labelColor"
          :border-style="settings.borderStyle"
          :border-height="settings.borderHeight"
          :gap="settings.gap"
          :icon="settings.content === 'icon' ? 'cb:star' : undefined"
          :aria-label="
            settings.content === 'icon' ? 'Featured section' : undefined
          "
        >
          <template v-if="settings.content === 'text'"
            >Section details</template
          >
        </s-divider>
        <span>Earlier updates</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divider-configurator {
  display: grid;
  width: 100%;
  gap: 20px;
}

.divider-configurator__controls {
  display: grid;
  gap: 16px;
}

.divider-configurator__group {
  display: grid;
  gap: 10px;
}

.divider-configurator__group h3 {
  margin: 0;
  color: var(--sax-css-text);
  font-size: 0.875rem;
  font-weight: 700;
}

.divider-configurator__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(142px, 1fr));
  gap: 10px;
}

.divider-configurator__preview {
  display: grid;
  align-content: center;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid var(--sax-css-divider);
  border-radius: var(--sax-radius-xl);
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 3%,
    var(--sax-css-background)
  );
}

.divider-configurator__eyebrow {
  color: var(--sax-css-text-color-regular);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.divider-configurator__stack {
  display: grid;
  width: 100%;
  gap: 10px;
  color: var(--sax-css-text);
  font-size: 0.875rem;
}

.divider-configurator__inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: var(--sax-css-text);
  font-size: 0.875rem;
}

@media (max-width: 520px) {
  .divider-configurator__preview {
    padding: 18px;
  }
}
</style>
