<template>
  <section class="code-variants">
    <header class="code-variants__header">
      <span>{{ locale === 'zh' ? '渲染写法' : 'Render syntax' }}</span>
      <div class="code-variants__actions">
        <button
          type="button"
          :class="{ active: active === 'tsx' }"
          :aria-pressed="active === 'tsx'"
          @click="active = 'tsx'"
        >
          {{ locale === 'zh' ? 'TSX（推荐）' : 'TSX (recommended)' }}
        </button>
        <button
          type="button"
          :class="{ active: active === 'h' }"
          :aria-pressed="active === 'h'"
          @click="active = 'h'"
        >
          h()
        </button>
      </div>
    </header>

    <div v-show="active === 'tsx'" class="code-variants__panel">
      <slot name="tsx" />
    </div>
    <div v-show="active === 'h'" class="code-variants__panel">
      <slot name="h" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { useDocLocale } from '../composables/docLocale'

defineOptions({ name: 'CodeVariants' })

const { locale } = useDocLocale()
const active = shallowRef<'tsx' | 'h'>('tsx')
</script>

<style scoped lang="scss">
.code-variants {
  overflow: hidden;
  margin: 14px 20px 18px;
  border: 1px solid hsl(var(--sax-primary) / 0.12);
  border-radius: 12px;
  background: hsl(var(--sax-theme-layout) / 0.46);
}

.code-variants__header {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 8px 6px 16px;
  border-bottom: 1px solid hsl(var(--sax-primary) / 0.1);
  color: hsl(var(--sax-text-color-secondary));
  font-size: 12px;
}

.code-variants__actions {
  display: flex;
  gap: 4px;

  button {
    min-height: 36px;
    padding: 0 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: hsl(var(--sax-text-color-secondary));
    font: inherit;
    cursor: pointer;

    &:hover,
    &:focus-visible,
    &.active {
      background: hsl(var(--sax-primary) / 0.1);
      color: hsl(var(--sax-primary));
    }

    &:focus-visible {
      outline: 2px solid hsl(var(--sax-primary) / 0.24);
      outline-offset: 1px;
    }
  }
}

.code-variants__panel :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
}

@media (max-width: 520px) {
  .code-variants {
    margin-inline: 10px;
  }

  .code-variants__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 10px;
  }

  .code-variants__actions {
    width: 100%;

    button {
      flex: 1;
    }
  }
}
</style>
