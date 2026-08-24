<script lang="ts" setup>
import { shallowRef } from 'vue'

type NavbarVariant = 'surface' | 'floating' | 'transparent'
type NavbarSize = 'compact' | 'default' | 'spacious'

const active = shallowRef('overview')
const variant = shallowRef<NavbarVariant>('floating')
const size = shallowRef<NavbarSize>('default')
const color = shallowRef('#6366F1')
const gap = shallowRef(12)
const shadow = shallowRef(false)
const shadowScroll = shallowRef(false)
const blurred = shallowRef(false)
const textWhite = shallowRef(false)
const grouped = shallowRef(true)
const square = shallowRef(false)
const hideScroll = shallowRef(false)
const paddingScroll = shallowRef(false)
const notLine = shallowRef(false)

const surfaceOptions = [
  { label: 'Surface', value: 'surface' },
  { label: 'Floating', value: 'floating' },
  { label: 'Transparent', value: 'transparent' },
]
const sizeOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Default', value: 'default' },
  { label: 'Spacious', value: 'spacious' },
]
const colors = ['#6366F1', '#A855F7', '#2DD4BF', '#F97316']
</script>

<template>
  <div class="navbar-lab">
    <div id="navbar-lab-scroll" class="navbar-lab__scroll">
      <s-navbar
        v-model="active"
        :variant="variant"
        position="sticky"
        :size="size"
        :color="color"
        :gap="gap"
        :shadow="shadow"
        :shadow-scroll="shadowScroll"
        :blurred="blurred"
        :text-white="textWhite"
        :square="square"
        :hide-scroll="hideScroll"
        :padding-scroll="paddingScroll"
        :not-line="notLine"
        target-scroll="#navbar-lab-scroll"
        center-collapsed
        content-width="1100px"
      >
        <template #brand>
          <a
            class="navbar-lab__brand"
            href="#navbar-playground"
            aria-label="Sax home"
          >
            <img src="/sax-logo-mark.svg" alt="" />
            <strong>Sax</strong>
          </a>
        </template>

        <s-navbar-item id="overview" icon="bx:home-alt">
          Overview
        </s-navbar-item>
        <s-navbar-group v-if="grouped">
          Product
          <template #items>
            <s-navbar-item id="components">Components</s-navbar-item>
            <s-navbar-item id="templates" badge="12">Templates</s-navbar-item>
            <s-navbar-item id="changelog">Changelog</s-navbar-item>
          </template>
        </s-navbar-group>
        <s-navbar-item v-else id="product">Product</s-navbar-item>
        <s-navbar-item id="docs">Docs</s-navbar-item>

        <template #actions>
          <s-button type="flat">Sign in</s-button>
          <s-button>Get started</s-button>
        </template>
      </s-navbar>

      <div id="navbar-playground" class="navbar-lab__stage">
        <section class="navbar-lab__panel navbar-lab__panel--controls">
          <div class="navbar-lab__heading">
            <span>Navbar playground</span>
            <strong>Configure every state here</strong>
            <small>Scroll this panel to preview scroll behavior.</small>
          </div>

          <div class="navbar-lab__controls">
            <label class="navbar-lab__field">
              <span>Surface</span>
              <s-radio-group
                v-model="variant"
                type="button"
                :options="surfaceOptions"
              />
            </label>

            <label class="navbar-lab__field">
              <span>Size</span>
              <s-radio-group
                v-model="size"
                type="button"
                :options="sizeOptions"
              />
            </label>

            <label class="navbar-lab__field">
              <span>Accent</span>
              <s-color-picker v-model="color" :predefine="colors" />
            </label>

            <label class="navbar-lab__field navbar-lab__field--slider">
              <span>Region gap · {{ gap }}px</span>
              <s-slider v-model="gap" :min="4" :max="32" :step="2" />
            </label>
          </div>

          <div class="navbar-lab__toggles">
            <label class="navbar-lab__toggle">
              <span>Elevation</span>
              <s-switch v-model="shadow" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Scroll shadow</span>
              <s-switch v-model="shadowScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Glass blur</span>
              <s-switch v-model="blurred" />
            </label>
            <label class="navbar-lab__toggle">
              <span>White text</span>
              <s-switch v-model="textWhite" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Grouped menu</span>
              <s-switch v-model="grouped" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Square</span>
              <s-switch v-model="square" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Hide on scroll</span>
              <s-switch v-model="hideScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Scroll padding</span>
              <s-switch v-model="paddingScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>Hide active line</span>
              <s-switch v-model="notLine" />
            </label>
          </div>
        </section>

        <section class="navbar-lab__panel">
          <span>Navigation content</span>
          <strong>Composable slots</strong>
        </section>
        <section class="navbar-lab__panel">
          <span>Scroll preview</span>
          <strong>Keep scrolling</strong>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar-lab {
  overflow: hidden;
  background:
    radial-gradient(
      circle at 12% 8%,
      hsl(280deg 72% 58% / 0.12),
      transparent 32%
    ),
    radial-gradient(
      circle at 88% 4%,
      hsl(173deg 68% 50% / 0.12),
      transparent 28%
    ),
    hsl(220deg 35% 95%);

  &__scroll {
    position: relative;
    max-height: 620px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__brand {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 8px;
    color: inherit;
    text-decoration: none;

    img {
      width: 34px;
      height: 30px;
    }

    strong {
      font-size: 1rem;
      letter-spacing: -0.02em;
    }
  }

  &__stage {
    display: grid;
    gap: 18px;
    padding: 26px;
  }

  &__panel {
    display: flex;
    min-height: 220px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 24px;
    background: hsl(0deg 0% 100% / 0.74);
    box-shadow: 0 16px 40px hsl(231deg 40% 26% / 0.09);
    color: hsl(236deg 38% 15%);

    > span {
      color: hsl(233deg 14% 52%);
      font-size: 0.78rem;
      text-transform: uppercase;
    }
  }

  &__panel--controls {
    min-height: auto;
    align-items: stretch;
    justify-content: flex-start;
    gap: 20px;
    padding: 22px;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      color: hsl(233deg 14% 48%);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.2rem;
    }

    small {
      color: hsl(233deg 12% 48%);
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: end;
  }

  &__field,
  &__toggle {
    display: flex;
    gap: 8px;
    color: hsl(233deg 17% 40%);
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__field {
    min-width: 0;
    flex-direction: column;
  }

  &__field--slider {
    padding-bottom: 8px;
  }

  &__toggles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  &__toggle {
    min-height: 52px;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
    border-radius: 15px;
    background: hsl(var(--sax-primary) / 0.055);
    box-shadow: inset 0 2px 7px hsl(var(--sax-primary) / 0.055);
  }
}

@media (max-width: 720px) {
  .navbar-lab {
    &__stage {
      padding: 14px;
    }

    &__controls,
    &__toggles {
      grid-template-columns: 1fr;
    }

    &__panel--controls {
      padding: 16px;
    }
  }
}
</style>
