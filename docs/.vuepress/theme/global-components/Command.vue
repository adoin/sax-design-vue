<template>
  <CodeCopied :copied="copied" :text="t.examples.copied" />
  <div class="command" :class="{ 'command--tabs': isMultipleSlot }">
    <div v-if="isMultipleSlot" class="tabs">
      <svg
        class="tab-cap"
        viewBox="0 0 320 56"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 56 C34 56 30 0 64 0 H256 C290 0 286 56 320 56 Z" />
      </svg>
      <button
        v-for="(slot, index) of slotsNames"
        :key="slot"
        type="button"
        class="tab"
        :class="{ active: activeSlot === index }"
        :aria-pressed="activeSlot === index"
        @click="activeSlot = index"
      >
        {{ slot }}
      </button>
    </div>
    <div ref="$el" class="slots">
      <button
        type="button"
        :title="t.examples.copyCode"
        :aria-label="copied ? t.examples.copied : t.examples.copyCode"
        class="con-copy"
        :class="{ copied }"
        @click="copy($el?.querySelector('pre code')?.textContent || '')"
      >
        <s-icon v-if="!copied" name="bx:clipboard" />
        <s-icon v-else name="bx:check" />
      </button>
      <template v-if="isMultipleSlot">
        <template v-for="(slot, index) of slotsNames" :key="index">
          <slot v-if="activeSlot === index" :name="slot" />
        </template>
      </template>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useSlots } from 'vue'
import { useClipboard } from '@vueuse/core'
import CodeCopied from '../components/CodeCopied.vue'
import { useDocLocaleUi } from '../composables/docLocale'

const slots = useSlots()
const { t } = useDocLocaleUi()

const slotsNames = Object.keys(slots)
const isMultipleSlot = slotsNames.length > 1

const $el = ref<HTMLElement>()
const activeSlot = ref(0)

const { copied, copy } = useClipboard({
  legacy: true,
})
</script>

<style lang="scss">
@use '../styles/syntax-tokens' as *;

.command {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin: 20px;

  .tabs {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 56px;
    max-width: calc(100% - 6px);
    align-self: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0 0 -2px 6px;
    padding: 6px 48px;
  }

  // One continuous silhouette keeps both shoulders smooth at browser zoom
  // levels. Explicit dimensions avoid the theme's global SVG size overrides.
  .tab-cap {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    fill: hsl(var(--sax-theme-code));
    pointer-events: none;
  }

  .tab {
    position: relative;
    display: inline-flex;
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border: 0;
    border-radius: 8px;
    background: hsl(var(--sax-accent-color) / 0.14);
    color: color-mix(in srgb, #fff 78%, hsl(var(--sax-accent-color)));
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition:
      background-color 0.18s ease,
      color 0.18s ease;

    &:hover {
      background: hsl(var(--sax-accent-color) / 0.25);
      color: #fff;
    }

    &.active {
      background: color-mix(
        in srgb,
        hsl(var(--sax-accent-color)) 75%,
        hsl(var(--sax-theme-code))
      );
      color: #fff;
    }
  }

  .con-copy {
    position: absolute;
    z-index: 3;
    top: 6px;
    right: 40px;
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: rgb(255 255 255 / 0.72);
    font-size: 1.1rem;
    cursor: pointer;

    &:hover,
    &.copied {
      background: rgb(255 255 255 / 0.12);
      color: #fff;
    }
  }

  .tab:focus-visible,
  .con-copy:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -3px;
  }

  .slots {
    position: relative;
    min-width: 0;
    overflow: hidden;
    border-radius: 20px;
    background: hsl(var(--sax-theme-code));

    div[class*='language-'] {
      margin: 0;
      border-radius: 0;
      @include syntax-tokens(true);
    }

    pre {
      margin: 0;
      border-radius: 0;
    }
  }

  &.command--tabs .slots {
    border-top-left-radius: 14px;
    border-top-right-radius: 10px;
  }
}

@media (max-width: 600px) {
  .command {
    margin-inline: 12px;
  }
}

@media (max-width: 360px) {
  .command {
    .tabs {
      padding-inline: 36px;
    }

    .tab {
      padding-inline: 8px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .command .tab {
    transition: none;
  }
}
</style>
