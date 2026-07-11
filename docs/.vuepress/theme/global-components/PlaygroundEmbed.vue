<template>
  <div class="playground-embed">
    <div class="playground-embed__toolbar">
      <label>
        <span>Demo</span>
        <select v-model="activeDemo">
          <option v-for="demo in demos" :key="demo" :value="demo">
            {{ demo }}
          </option>
        </select>
      </label>
      <a
        class="playground-embed__open"
        :href="fullPlaygroundUrl"
        target="_blank"
        rel="noopener"
      >
        Open full playground ↗
      </a>
    </div>
    <iframe
      :key="activeDemo"
      class="playground-embed__frame"
      :src="iframeSrc"
      title="Sax Design Vue Playground"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const siteBase = import.meta.env.BASE_URL || '/'
const playBase = `${siteBase.replace(/\/$/, '')}/play/`

const demos = [
  'App',
  'alert',
  'spacer',
  'divider',
  'progress',
  'chip',
  'breadcrumb',
  'textarea',
  'collapse',
  'list',
  'images',
  'prompt',
  'tabs',
  'slider',
  'upload',
]

const activeDemo = ref('divider')

const iframeSrc = computed(() => `${playBase}#/${activeDemo.value}`)
const fullPlaygroundUrl = computed(() => `${playBase}#/App`)
</script>

<style lang="scss" scoped>
.playground-embed {
  margin: 24px 0;
  border: 1px solid rgba(var(--vs-theme-color), 0.1);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--vs-theme-layout), 0.9);
}

.playground-embed__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(var(--vs-theme-color), 0.08);

  label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: rgb(var(--vs-theme-color));
  }

  select {
    min-width: 160px;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid rgba(var(--vs-theme-color), 0.12);
    background: rgba(var(--vs-theme-bg), 0.8);
    color: rgb(var(--vs-theme-color));
  }
}

.playground-embed__open {
  font-weight: 600;
  color: rgb(var(--vs-accent-color));
  text-decoration: none;
}

.playground-embed__frame {
  width: 100%;
  min-height: 520px;
  border: 0;
  background: rgb(var(--vs-theme-bg));
}
</style>
