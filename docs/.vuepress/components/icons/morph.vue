<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { SaxIconData } from 'sax-design-vue'

const changed = shallowRef(false)
const selected = shallowRef(0)
const duration = shallowRef(360)
const spring = shallowRef<'smooth' | 'snappy' | 'bouncy'>('snappy')
const examples = [
  {
    label: 'Expand and collapse',
    from: 'cb:chevron-down',
    to: 'cb:chevron-up',
    description: 'Switch between down and up arrows for an expandable menu.',
  },
  {
    label: 'Pin status',
    from: 'cb:pin',
    to: 'cb:pin-filled',
    description:
      'Switch between outline and filled pins to show the pinned state.',
  },
  {
    label: 'Show and hide',
    from: 'cb:view',
    to: 'cb:view-off',
    description:
      'Switch between an eye and a crossed-out eye to show visibility.',
  },
  {
    label: 'Multicolor icons',
    from: '',
    to: '',
    description: 'Fill colors and opacity change together with the shape.',
  },
  {
    label: 'Gradient icons',
    from: '',
    to: '',
    description:
      'Switch between a gradient square and circle to see the shape and colors change together.',
  },
]
const customIcons: SaxIconData[][] = [
  [
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<path fill="#ff004080" d="M2 2H15V15H2Z"/><path fill="rgb(0 120 255 / 75%)" d="M10 10H22V22H10Z"/>',
    },
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<path fill="hsl(160 90% 40%)" d="M10 10H22V22H10Z"/><path fill="#ff9900" d="M2 2H15V15H2Z"/>',
    },
  ],
  [
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<defs><linearGradient id="paint"><stop offset="0" stop-color="#ff0066"/><stop offset="1" stop-color="#4466ff"/></linearGradient></defs><path fill="url(#paint)" d="M3 3H21V21H3Z"/>',
    },
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<defs><linearGradient id="paint" x2="0%" y2="100%"><stop offset="0" stop-color="#00bb99"/><stop offset=".4" stop-color="#ffee00" stop-opacity=".7"/><stop offset="1" stop-color="#ff7700"/></linearGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
  ],
]
const example = computed(() => examples[selected.value])
const options = examples.map((item, value) => ({ label: item.label, value }))
const name = computed(() =>
  changed.value ? example.value.to : example.value.from,
)
const iconData = computed(() =>
  selected.value >= 3
    ? customIcons[selected.value - 3][Number(changed.value)]
    : undefined,
)
</script>

<template>
  <div class="morph-demo">
    <div class="morph-demo__controls">
      <label class="morph-demo__field">
        <span>Example</span>
        <s-select v-model="selected" :options="options" aria-label="Example" />
      </label>
      <label class="morph-demo__field">
        <span>Duration</span>
        <s-select
          v-model="duration"
          aria-label="Duration"
          :options="[
            { label: '180 ms (faster)', value: 180 },
            { label: '360 ms (default)', value: 360 },
            { label: '800 ms (slower)', value: 800 },
          ]"
        />
      </label>
      <label class="morph-demo__field">
        <span>Animation style</span>
        <s-select
          v-model="spring"
          aria-label="Animation style"
          :options="[
            { label: 'Smooth', value: 'smooth' },
            { label: 'Subtle bounce (default)', value: 'snappy' },
            { label: 'Bouncy', value: 'bouncy' },
          ]"
        />
      </label>
    </div>
    <p class="morph-demo__description">{{ example.description }}</p>
    <div class="morph-demo__preview">
      <s-icon
        :name="name"
        :icon-data="iconData"
        :size="76"
        color="primary"
        :morph="{ duration, spring }"
        label="Icon morph preview"
      />
      <s-button @click="changed = !changed">Switch icon</s-button>
      <p>Click the button to animate between the two icons.</p>
    </div>
  </div>
</template>

<style scoped>
.morph-demo {
  display: grid;
  gap: 20px;
}
.morph-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.morph-demo__field {
  display: grid;
  gap: 8px;
  flex: 1 1 160px;
  min-width: 0;
}
.morph-demo__description,
.morph-demo__preview p {
  margin: 0;
}
.morph-demo__preview {
  display: grid;
  justify-items: center;
  gap: 20px;
  padding: 28px;
  border-radius: 20px;
  background: var(--sax-css-background);
  box-shadow: inset 0 2px 10px
    color-mix(in srgb, var(--sax-css-text) 8%, transparent);
}
</style>
