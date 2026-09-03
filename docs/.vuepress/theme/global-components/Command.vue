<template>
  <CodeCopied :copied="copied" :text="t.examples.copied" />
  <div class="command" :class="{ 'command--tabs': isMultipleSlot }">
    <div v-if="isMultipleSlot" class="tabs">
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

    <div ref="$el" class="slots">
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
  min-width: 0;
  margin: 20px;
  overflow: hidden;
  border-radius: 14px;
  background: hsl(var(--sax-theme-code));

  .tabs {
    display: flex;
    min-height: 56px;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px 58px 6px 8px;
    border-bottom: 1px solid rgb(255 255 255 / 0.12);
  }

  .tab {
    display: inline-flex;
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: rgb(255 255 255 / 0.72);
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition:
      background-color 0.18s ease,
      color 0.18s ease;

    &:hover,
    &.active {
      background: rgb(255 255 255 / 0.12);
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

  &.command--tabs .con-copy {
    right: 8px;
  }

  .tab:focus-visible,
  .con-copy:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -3px;
  }

  .slots {
    min-width: 0;

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
}

@media (max-width: 600px) {
  .command {
    margin-inline: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .command .tab {
    transition: none;
  }
}
</style>
