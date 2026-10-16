<script lang="ts" setup>
import { shallowRef } from 'vue'

type NavbarVariant = 'surface' | 'floating' | 'transparent'
type NavbarSize = 'compact' | 'comfortable' | 'spacious'

const active = shallowRef('overview')
const variant = shallowRef<NavbarVariant>('floating')
const size = shallowRef<NavbarSize>('comfortable')
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
  { label: 'Comfortable (default)', value: 'comfortable' },
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
      color-mix(in srgb, var(--sax-css-primary) 10%, transparent),
      transparent 32%
    ),
    radial-gradient(
      circle at 88% 4%,
      color-mix(in srgb, var(--sax-css-success) 6%, transparent),
      transparent 28%
    ),
    var(--sax-css-bg-color-page);

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
    background: var(--sax-css-background);
    box-shadow: 0 12px 28px -18px
      color-mix(in srgb, var(--sax-css-black) 20%, transparent);
    color: var(--sax-css-text);

    > span {
      color: var(--sax-css-text-color-secondary);
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
      color: var(--sax-css-text-color-secondary);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.2rem;
    }

    small {
      color: var(--sax-css-text-color-secondary);
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
    color: var(--sax-css-text-color-regular);
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
    background: color-mix(in srgb, var(--sax-css-primary) 5.5%, transparent);
    box-shadow: inset 0 2px 7px
      color-mix(in srgb, var(--sax-css-primary) 5.5%, transparent);
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
