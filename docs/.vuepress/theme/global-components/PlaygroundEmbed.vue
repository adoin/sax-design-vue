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
      <div class="playground-embed__actions">
        <button
          class="playground-embed__copy"
          type="button"
          :class="{ copied }"
          @click="copySource"
        >
          <i :class="copied ? 'bx bx-check' : 'bx bx-copy'" />
          {{ copied ? 'Copied' : 'Copy code' }}
        </button>
        <a
          class="playground-embed__open"
          :href="fullPlaygroundUrl"
          target="_blank"
          rel="noopener"
        >
          Open full playground ↗
        </a>
      </div>
    </div>

    <div class="playground-embed__body">
      <aside class="playground-embed__code">
        <header class="playground-embed__code-header">
          <span>{{ activeDemo }}.vue</span>
        </header>
        <pre class="playground-embed__pre"><code>{{ activeSource }}</code></pre>
      </aside>
      <div class="playground-embed__preview">
        <iframe
          :key="activeDemo"
          class="playground-embed__frame"
          :src="iframeSrc"
          title="Sax Design Vue Playground"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PLAY_DEMOS } from '../../../../play/demo-list'

const rawSources = import.meta.glob('../../../../play/src/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const siteBase = import.meta.env.BASE_URL || '/'
const playBase = `${siteBase.replace(/\/$/, '')}/play/`

const demos = PLAY_DEMOS.filter((name) => name !== 'App')

const activeDemo = ref('divider')
const copied = ref(false)

const sourceMap = computed(() => {
  const map: Record<string, string> = {}
  for (const [path, code] of Object.entries(rawSources)) {
    const name = path.split('/').pop()?.replace('.vue', '') || ''
    map[name] = code
  }
  return map
})

const activeSource = computed(
  () => sourceMap.value[activeDemo.value] || '// Source not found'
)

const iframeSrc = computed(() => `${playBase}#/${activeDemo.value}`)
const fullPlaygroundUrl = computed(() => `${playBase}#/divider`)

const copySource = async () => {
  try {
    await navigator.clipboard.writeText(activeSource.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<style lang="scss" scoped>
.playground-embed {
  margin: 24px 0;
  border: 1px solid rgba(var(--s-accent-color), 0.18);
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(var(--s-theme-layout), 0.98),
    rgba(var(--s-accent-color), 0.06)
  );
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.playground-embed__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(var(--s-theme-color), 0.08);
  background: rgba(var(--s-theme-layout), 0.9);

  label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: rgb(var(--s-theme-color));
  }

  select {
    min-width: 160px;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid rgba(var(--s-theme-color), 0.12);
    background: rgba(var(--s-theme-bg), 0.8);
    color: rgb(var(--s-theme-color));
  }
}

.playground-embed__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.playground-embed__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--s-theme-color), 0.12);
  background: rgba(var(--s-theme-bg), 0.85);
  color: rgb(var(--s-theme-color));
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.copied {
    border-color: rgba(var(--s-accent-color), 0.35);
    color: rgb(var(--s-accent-color));
  }
}

.playground-embed__open {
  font-weight: 600;
  color: rgb(var(--s-accent-color));
  text-decoration: none;
}

.playground-embed__body {
  display: grid;
  grid-template-columns: minmax(260px, 44%) 1fr;
  min-height: 520px;
}

.playground-embed__code {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid rgba(var(--s-theme-color), 0.08);
  background: rgb(var(--s-theme-code));
}

.playground-embed__code-header {
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.playground-embed__pre {
  flex: 1;
  margin: 0;
  padding: 14px;
  overflow: auto;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.playground-embed__preview {
  min-height: 0;
  background: radial-gradient(
      circle at 15% 20%,
      rgba(var(--s-accent-color), 0.12),
      transparent 42%
    ),
    rgba(var(--s-theme-bg), 0.95);
}

.playground-embed__frame {
  width: 100%;
  height: 100%;
  min-height: 520px;
  border: 0;
  background: transparent;
}

@media (max-width: 900px) {
  .playground-embed__body {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(200px, 34vh) 1fr;
  }

  .playground-embed__code {
    border-right: 0;
    border-bottom: 1px solid rgba(var(--s-theme-color), 0.08);
  }
}
</style>
