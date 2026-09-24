<script setup lang="ts">
import { computed, reactive } from 'vue'
import type {
  CardEffect,
  CardHoverEffect,
  CardOrientation,
  CardTexture,
  CardType,
} from 'sax-design-vue'

const settings = reactive({
  type: 'default' as CardType,
  texture: 'default' as CardTexture,
  effect: 'default' as CardEffect,
  orientation: '' as CardOrientation | '',
  hoverEffect: 'none' as CardHoverEffect,
  shape: 'rounded' as 'rounded' | 'square',
  color: 'primary',
  interactive: false,
  selectable: false,
  selected: false,
  loading: false,
})

const typeOptions = [
  'default',
  'classic',
  'overlay',
  'split',
  'frosted',
  'reveal',
  'profile',
  'metric',
  'article',
].map((value) => ({ label: value, value }))
const textureOptions = ['default', 'liquid-glass', 'liquid-glass-2'].map(
  (value) => ({ label: value, value }),
)
const effectOptions = ['default', 'spotlight', 'gradient-glow'].map(
  (value) => ({ label: value, value }),
)
const orientationOptions = [
  { label: 'Type layout', value: '' },
  { label: 'vertical', value: 'vertical' },
  { label: 'horizontal', value: 'horizontal' },
]
const hoverOptions = ['none', 'lift', 'glow'].map((value) => ({
  label: value,
  value,
}))
const shapeOptions = ['rounded', 'square'].map((value) => ({
  label: value,
  value,
}))
const colorOptions = ['primary', 'success', 'warn', 'danger', 'dark'].map(
  (value) => ({ label: value, value }),
)

const summary = computed(
  () =>
    `${settings.type} · ${settings.texture} · ${settings.effect} · ${settings.shape}`,
)
</script>

<template>
  <div class="configurator">
    <div class="configurator__controls">
      <s-select v-model="settings.type" label="Type" :options="typeOptions" />
      <s-select
        v-model="settings.texture"
        label="Texture"
        :options="textureOptions"
      />
      <s-select
        v-model="settings.effect"
        label="Effect"
        :options="effectOptions"
      />
      <s-select
        v-model="settings.orientation"
        label="Orientation"
        :options="orientationOptions"
      />
      <s-select
        v-model="settings.hoverEffect"
        label="Hover effect"
        :options="hoverOptions"
      />
      <s-select
        v-model="settings.shape"
        label="Shape"
        :options="shapeOptions"
      />
      <s-select
        v-model="settings.color"
        label="Color"
        :options="colorOptions"
      />
      <label class="configurator__toggle">
        <span>Interactive</span>
        <s-switch v-model="settings.interactive" />
      </label>
      <label class="configurator__toggle">
        <span>Selectable</span>
        <s-switch v-model="settings.selectable" />
      </label>
      <label class="configurator__toggle">
        <span>Selected</span>
        <s-switch v-model="settings.selected" />
      </label>
      <label class="configurator__toggle">
        <span>Loading</span>
        <s-switch v-model="settings.loading" />
      </label>
    </div>

    <div class="configurator__preview">
      <s-card
        v-model:selected="settings.selected"
        :type="settings.type"
        :texture="settings.texture"
        :effect="settings.effect"
        :orientation="settings.orientation || undefined"
        :hover-effect="settings.hoverEffect"
        :shape="settings.shape"
        :color="settings.color"
        :interactive="settings.interactive"
        :selectable="settings.selectable"
        :loading="settings.loading"
        title="Live Card"
        :subtitle="summary"
        text="Every visual axis updates independently without replacing the others."
      >
        <template #img>
          <img src="/foto5.png" alt="Card configurator preview" />
        </template>
        <template #interactions>
          <s-button icon aria-label="Favorite preview card">
            <s-icon name="bx:heart" />
          </s-button>
        </template>
        <template #buttons>
          <s-button size="small">Action</s-button>
        </template>
      </s-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.configurator {
  display: grid;
  gap: 24px;
  width: 100%;
}

.configurator__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  padding: 20px;
  border-radius: var(--sax-radius-xl);
  background: hsl(var(--sax-background));
}

.configurator__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  gap: 12px;
  padding: 0 4px;
  font-size: 0.875rem;
}

.configurator__preview {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 360px;
  place-items: center;
  overflow: hidden;
  padding: 52px;
  border-radius: var(--sax-radius-xl);
  background:
    radial-gradient(circle at 18% 38%, rgb(255 0 153 / 72%), transparent 28%),
    radial-gradient(circle at 82% 62%, rgb(4 217 196 / 68%), transparent 28%),
    repeating-linear-gradient(
      118deg,
      transparent 0 52px,
      rgb(255 255 255 / 10%) 53px 55px,
      transparent 56px 104px
    ),
    #171b42;
}

.configurator__preview :deep(.s-card-content) {
  z-index: 1;
}

.configurator__preview :deep(.s-card-content > .s-card) {
  margin-inline: auto;
}

@media (max-width: 600px) {
  .configurator__preview {
    min-height: 300px;
    padding: 28px 18px;
  }
}
</style>
