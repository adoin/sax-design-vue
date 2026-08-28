<template>
  <CodeCopied :copied="copied" />

  <div class="code">
    <header class="header-codex">
      <div class="example-actions">
        <button
          type="button"
          :title="t.examples.openExamplePlayground"
          @click="openPlayground"
        >
          <s-icon name="bx:play-circle" />
          <span>{{ t.examples.playground }}</span>
        </button>
        <button
          type="button"
          :title="t.examples.copyCode"
          :class="{ copied }"
          @click="copySource"
        >
          <s-icon :name="copied ? 'bx:check' : 'bx:clipboard'" />
          <span>{{ t.examples.copy }}</span>
        </button>
        <button type="button" :title="t.examples.viewCode" @click="openCode">
          <s-icon name="bx:code-alt" />
          <span>{{ t.examples.code }}</span>
        </button>
      </div>
    </header>
  </div>

  <Teleport to="body">
    <Transition name="code-dialog">
      <div v-if="codeOpen" class="code-dialog-backdrop" @click.self="closeCode">
        <section
          class="code-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="t.examples.exampleCode"
          @keydown.esc="closeCode"
        >
          <header class="code-dialog__header">
            <div>
              <strong>{{ t.examples.exampleCode }}</strong>
              <span>{{ t.examples.exampleCodeDescription }}</span>
            </div>
            <div class="code-dialog__header-actions">
              <button
                type="button"
                :title="t.examples.copyCode"
                @click="copySource"
              >
                <s-icon :name="copied ? 'bx:check' : 'bx:clipboard'" />
              </button>
              <button
                type="button"
                :title="t.examples.closeCode"
                @click="closeCode"
              >
                <s-icon name="bx:x" />
              </button>
            </div>
          </header>

          <nav v-if="sections.length > 1" class="code-dialog__tabs">
            <button
              v-for="section in sections"
              :key="section.id"
              type="button"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id"
            >
              {{ section.label }}
            </button>
          </nav>

          <div class="code-dialog__body">
            <div v-if="activeSection === 'template'" class="code-section">
              <slot name="template" />
            </div>
            <div v-else-if="activeSection === 'script'" class="code-section">
              <slot name="script" />
            </div>
            <div v-else-if="activeSection === 'style'" class="code-section">
              <slot name="style" />
            </div>
            <div v-else class="code-section">
              <slot name="template" />
              <slot name="script" />
              <slot name="style" />
            </div>
          </div>

          <footer class="code-dialog__footer">
            <button type="button" @click="openPlayground">
              {{ t.examples.openInPlayground }}
              <s-icon name="bx:right-arrow-alt" />
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>

  <div ref="sourceRef" class="source-cache" aria-hidden="true">
    <slot name="template" />
    <slot name="script" />
    <slot name="style" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import { useRouteLocale } from '@vuepress/client'
import { useClipboard } from '@vueuse/core'

import CodeCopied from '../components/CodeCopied.vue'
import { useDocLocaleUi } from '../composables/docLocale'

type CodeSection = 'template' | 'script' | 'style' | 'all'

interface DocExampleRecord {
  id: string
  component: string
  section: string
  title: string
  source: string
}

const slots = useSlots()
const routeLocale = useRouteLocale()
const { t } = useDocLocaleUi()
const sourceRef = ref<HTMLElement>()
const codeOpen = ref(false)
const activeSection = ref<CodeSection>('template')
const openedExample = ref<DocExampleRecord | null>(null)
const { copied, copy } = useClipboard({ legacy: true })

defineProps<{
  codepen?: string
  codesandbox?: string
}>()

const sections = computed(() => {
  const available: { id: CodeSection; label: string }[] = []
  if (slots.template)
    available.push({ id: 'template', label: t.value.examples.template })
  if (slots.script)
    available.push({ id: 'script', label: t.value.examples.script })
  if (slots.style)
    available.push({ id: 'style', label: t.value.examples.style })
  if (available.length > 1)
    available.push({ id: 'all', label: t.value.examples.all })
  return available
})

const getSource = () => {
  const blocks = sourceRef.value?.querySelectorAll('pre code')
  return blocks
    ? Array.from(blocks)
        .map((block) => block.textContent?.trim())
        .filter(Boolean)
        .join('\n\n')
    : ''
}

const getDocExample = (event?: Event): DocExampleRecord => {
  const trigger = event?.currentTarget as HTMLElement | null
  const card = trigger?.closest('.card')
  const heading = card?.querySelector<HTMLElement>('.text h2, .text h3')
  const source = getSource()
  const component =
    window.location.pathname
      .split('/')
      .pop()
      ?.replace(/\.html$/, '') || 'example'
  const sourceHash = Array.from(source).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  )
  const section = heading?.id || `example-${sourceHash.toString(36)}`
  const title = heading?.textContent?.trim() || t.value.examples.example

  return {
    id: `${component}--${section}`,
    component,
    section,
    title,
    source,
  }
}

const openCode = (event: Event) => {
  openedExample.value = getDocExample(event)
  activeSection.value = sections.value[0]?.id || 'template'
  codeOpen.value = true
}

const closeCode = () => {
  codeOpen.value = false
}

const copySource = () => {
  const source = getSource()
  if (source) copy(source)
}

const openPlayground = (event?: Event) => {
  if (typeof window === 'undefined') return

  const trigger = event?.currentTarget as HTMLElement | null
  const example = trigger?.closest('.card')
    ? getDocExample(event)
    : openedExample.value || getDocExample()

  if (example.source) {
    window.sessionStorage.setItem(
      `sax-doc-example:${example.id}`,
      JSON.stringify(example),
    )
  }
  const exampleId = encodeURIComponent(example.id)
  window.location.assign(
    `${routeLocale.value}guide/example-playground.html?exampleId=${exampleId}`,
  )
}
</script>

<style lang="scss">
.code {
  position: relative;
  z-index: 2;
  min-height: 52px;
  background: transparent;
}

.header-codex {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 18px;
}

.example-actions,
.code-dialog__header-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.example-actions button,
.code-dialog__header-actions button,
.code-dialog__tabs button,
.code-dialog__footer button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: hsl(var(--sax-theme-color) / 0.68);
  font: inherit;
  cursor: pointer;
}

.example-actions button {
  min-height: 32px;
  padding: 0 9px;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 600;
}

.example-actions button:hover,
.example-actions button:focus-visible {
  background: hsl(var(--sax-accent-color) / 0.1);
  color: hsl(var(--sax-accent-color));
}

.example-actions button.copied {
  color: hsl(var(--sax-badge-tip-color));
}

.source-cache {
  display: none;
}

.code-dialog-backdrop {
  position: fixed;
  z-index: 2200;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(18, 16, 45, 0.36);
  backdrop-filter: blur(7px);
}

.code-dialog {
  display: flex;
  width: min(860px, 100%);
  max-height: calc(100dvh - 32px);
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px;
  background: hsl(var(--sax-theme-layout));
  box-shadow: 0 28px 70px rgba(20, 16, 62, 0.28);
}

.code-dialog__header {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 18px;
  border-bottom: 1px solid hsl(var(--sax-accent-color) / 0.12);

  strong,
  span {
    display: block;
  }

  strong {
    color: hsl(var(--sax-theme-color));
    font-size: 0.95rem;
  }

  span {
    margin-top: 2px;
    color: hsl(var(--sax-theme-color) / 0.58);
    font-size: 0.76rem;
  }
}

.code-dialog__header-actions button {
  width: 34px;
  height: 34px;
  border-radius: 9px;
}

.code-dialog__header-actions button:hover,
.code-dialog__header-actions button:focus-visible {
  background: hsl(var(--sax-accent-color) / 0.1);
  color: hsl(var(--sax-accent-color));
}

.code-dialog__tabs {
  display: flex;
  gap: 4px;
  padding: 8px 14px 0;
  background: hsl(var(--sax-theme-bg2) / 0.24);
}

.code-dialog__tabs button {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px 8px 0 0;
  font-size: 0.78rem;
  font-weight: 600;
}

.code-dialog__tabs button.active {
  background: hsl(var(--sax-theme-code));
  color: #fff;
}

.code-dialog__body {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-color: hsl(var(--sax-accent-color) / 0.62)
    hsl(var(--sax-theme-code2) / 0.72);
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  background: hsl(var(--sax-theme-code));
}

.code-dialog__body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.code-dialog__body::-webkit-scrollbar-track {
  background: hsl(var(--sax-theme-code2) / 0.72);
}

.code-dialog__body::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: hsl(var(--sax-accent-color) / 0.62);
  background-clip: padding-box;
}

.code-section > div[class*='language-'],
.code-section pre {
  margin: 0;
  border-radius: 0;
}

.code-dialog__footer {
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 18px;
  border-top: 1px solid hsl(var(--sax-accent-color) / 0.12);
}

.code-dialog__footer button {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 9px;
  background: hsl(var(--sax-accent-color) / 0.1);
  color: hsl(var(--sax-accent-color));
  font-size: 0.78rem;
  font-weight: 700;
}

.code-dialog__footer button:hover,
.code-dialog__footer button:focus-visible {
  background: hsl(var(--sax-accent-color));
  color: #fff;
}

.code-dialog-enter-active,
.code-dialog-leave-active {
  transition: opacity 0.18s ease;
}

.code-dialog-enter-active .code-dialog,
.code-dialog-leave-active .code-dialog {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.code-dialog-enter-from,
.code-dialog-leave-to {
  opacity: 0;
}

.code-dialog-enter-from .code-dialog,
.code-dialog-leave-to .code-dialog {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}

@media (max-width: 560px) {
  .example-actions button span {
    display: none;
  }

  .code-dialog-backdrop {
    padding: 10px;
  }

  .code-dialog__header span {
    display: none;
  }
}
</style>
