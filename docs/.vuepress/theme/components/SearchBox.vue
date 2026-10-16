<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { useRouteLocale } from '@vuepress/client'
import { SIcon } from '@vuesax-alpha/components/icon'
import { isDocumentationSearchShortcut } from '../util/documentation-search'
import DocumentationSearchDialog from './DocumentationSearchDialog.vue'
const emits = defineEmits<{
  showSuggestions: [active: boolean]
  focus: []
  blur: []
}>()
const locale = useRouteLocale()
const zh = computed(() => locale.value.startsWith('/zh/'))
const open = shallowRef(false)
const shortcut = shallowRef('Ctrl K')
const previousFocus = shallowRef<HTMLElement | null>(null)
const dialog = shallowRef<InstanceType<typeof DocumentationSearchDialog>>()
function openSearch() {
  if (!open.value && document.activeElement instanceof HTMLElement)
    previousFocus.value = document.activeElement
  open.value = true
  emits('focus')
  emits('showSuggestions', true)
  dialog.value?.focus()
}
function onHotkey(event: KeyboardEvent) {
  if (event.defaultPrevented) return
  const target = event.target instanceof Element ? event.target : null
  const plain =
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.isComposing &&
    ['s', '/'].includes(event.key) &&
    !target?.closest(
      'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
    )
  if (!isDocumentationSearchShortcut(event) && !plain) return
  event.preventDefault()
  openSearch()
}
function onClosed() {
  emits('blur')
  emits('showSuggestions', false)
}
onMounted(() => {
  shortcut.value = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K'
  document.addEventListener('keydown', onHotkey)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onHotkey))
</script>
<template>
  <div class="search-box">
    <button
      class="docs-search-trigger"
      type="button"
      :aria-label="
        zh ? '搜索组件与文档' : 'Search components and documentation'
      "
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-keyshortcuts="Control+k Meta+k"
      @click="openSearch"
    >
      <SIcon name="cb:search" size="16px" />
      <kbd aria-hidden="true">{{ shortcut }}</kbd>
    </button>
    <DocumentationSearchDialog
      ref="dialog"
      v-model:open="open"
      :return-focus-to="previousFocus"
      @closed="onClosed"
    />
  </div>
</template>
<style scoped lang="scss">
.search-box {
  flex-shrink: 0;
  width: auto;
  margin-right: 1rem;
}
.docs-search-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  width: auto;
  height: 40px;
  padding: 0 14px;
  border: 0;
  outline: none;
  border-radius: var(--sax-radius-lg);
  background: var(--sax-css-gray-1);
  color: var(--sax-css-text-color-secondary);
  font-size: 0.85rem;
  line-height: 20px;
  cursor: pointer;
}
.docs-search-trigger kbd {
  padding: 2px 5px;
  border: 0;
  border-radius: var(--sax-radius-xs);
  background: color-mix(in srgb, var(--sax-css-text) 6%, transparent);
  color: inherit;
  white-space: nowrap;
  font: inherit;
  font-size: 11px;
  line-height: 18px;
}
.docs-search-trigger:hover,
.docs-search-trigger:focus-visible {
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 10%,
    var(--sax-css-gray-1)
  );
  color: var(--sax-css-primary);
  box-shadow: var(--sax-input-shadow-hover);
}
@media (max-width: 719px) {
  .search-box {
    width: 40px;
    margin-right: 0;
  }
  .docs-search-trigger {
    justify-content: center;
    padding: 0;
  }
  .docs-search-trigger kbd {
    display: none;
  }
}
</style>
