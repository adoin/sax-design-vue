<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { usePageData } from '@vuepress/client'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SIcon } from '@vuesax-alpha/components/icon'
import {
  catalogGroups,
  catalogLinks,
  currentCatalogGroup,
} from '../util/catalog-navigation'
import NavLink from './NavLink.vue'
import type { NavbarGroup } from 'vuepress-vite'
import type { PopperInstance } from '@vuesax-alpha/components/popper'

const props = defineProps<{ item: NavbarGroup }>()
const panelId = useId()
const page = usePageData()
const open = ref(false)
const trigger = ref<HTMLButtonElement>()
const popper = ref<PopperInstance>()
const groups = computed(() => catalogGroups(props.item))
const selected = ref(0)
const current = computed(() => groups.value[selected.value] ?? groups.value[0])
const links = computed(() => (current.value ? catalogLinks(current.value) : []))
const selectCurrent = () => {
  selected.value = currentCatalogGroup(groups.value, page.value.path)
}
watch([groups, () => page.value.path], selectCurrent, { immediate: true })
watch(open, (visible) => {
  if (visible) selectCurrent()
})

async function focusPanel() {
  open.value = true
  await nextTick()
  popper.value?.contentRef
    ?.querySelector<HTMLButtonElement>(
      '.docs-catalog-categories button[aria-pressed="true"]',
    )
    ?.focus()
}
function closePanel() {
  open.value = false
  trigger.value?.focus({ preventScroll: true })
}
function selectLink(event: MouseEvent) {
  if ((event.target as Element).closest('a[href]')) open.value = false
}
function leavePanel(event: FocusEvent) {
  const next = event.relatedTarget
  if (
    next instanceof Node &&
    !(event.currentTarget as HTMLElement).contains(next) &&
    !trigger.value?.contains(next)
  )
    open.value = false
}
</script>

<template>
  <SPopper
    ref="popper"
    v-model:visible="open"
    trigger="hover"
    placement="bottom-start"
    :offset="8"
    :show-arrow="false"
    :show-after="80"
    :hide-after="160"
    popper-class="docs-catalog-popper"
  >
    <button
      ref="trigger"
      type="button"
      class="docs-catalog-trigger"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = true"
      @keydown.down.prevent="focusPanel"
      @keydown.esc.prevent="closePanel"
    >
      {{ item.text }}
      <SIcon name="bx:chevron-down" size="14px" />
    </button>
    <template #content>
      <nav
        :id="panelId"
        class="docs-catalog"
        :aria-label="item.text"
        @keydown.esc.prevent.stop="closePanel"
        @click="selectLink"
        @focusout="leavePanel"
      >
        <div class="docs-catalog-categories">
          <button
            v-for="(group, index) in groups"
            :key="group.text"
            type="button"
            :aria-pressed="selected === index"
            @pointerenter="selected = index"
            @focus="selected = index"
            @click="selected = index"
          >
            <span>{{ group.text }}</span>
            <small>{{ catalogLinks(group).length }}</small>
          </button>
        </div>
        <section class="docs-catalog-content">
          <h4>{{ current?.text }}</h4>
          <div class="docs-catalog-links">
            <NavLink v-for="link in links" :key="link.link" :nav-item="link" />
          </div>
        </section>
      </nav>
    </template>
  </SPopper>
</template>

<style lang="scss">
.docs-catalog-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 18px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  opacity: 0.7;
  cursor: pointer;
  &:hover,
  &:focus-visible,
  &[aria-expanded='true'] {
    color: var(--sax-css-primary);
    opacity: 1;
  }
}
.docs-catalog-popper.s-popper {
  max-width: calc(100vw - 32px);
  padding: 0;
  border: 0;
  border-radius: var(--sax-radius-xl);
  background: var(--sax-css-background);
  color: var(--sax-css-text);
  box-shadow: var(--sax-popper-shadow);
}
.docs-catalog {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  width: min(880px, calc(100vw - 32px));
  max-height: min(540px, calc(100dvh - 104px));
  overflow: auto;
  overscroll-behavior: contain;
  border-radius: inherit;
}
.docs-catalog-categories {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px;
  background: var(--sax-css-gray-3);
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 9px 10px;
    border: 0;
    border-radius: var(--sax-radius-sm);
    background: transparent;
    color: var(--sax-css-text-color-regular);
    font: inherit;
    font-size: 13px;
    line-height: 1.4;
    text-align: start;
    cursor: pointer;
    small {
      opacity: 0.6;
    }
    &:hover,
    &:focus-visible,
    &[aria-pressed='true'] {
      background: color-mix(in srgb, var(--sax-css-primary) 12%, transparent);
      color: var(--sax-css-primary);
    }
  }
}
.docs-catalog-content {
  min-width: 0;
  padding: 22px;
  h4 {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.5;
  }
}
.docs-catalog-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px 12px;
  align-content: start;
  .nav-link {
    padding: 8px;
    border-radius: var(--sax-radius-sm);
    color: var(--sax-css-text-color-regular);
    font-size: 13px;
    line-height: 1.5;
    text-decoration: none;
    white-space: normal;
    overflow-wrap: anywhere;
    &:hover,
    &:focus-visible,
    &.active {
      background: color-mix(in srgb, var(--sax-css-primary) 10%, transparent);
      color: var(--sax-css-primary);
    }
  }
}
@media (max-width: 900px) {
  .docs-catalog {
    grid-template-columns: 145px minmax(0, 1fr);
  }
  .docs-catalog-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 480px) {
  .docs-catalog {
    grid-template-columns: 120px minmax(0, 1fr);
  }
  .docs-catalog-content {
    padding: 14px;
  }
  .docs-catalog-links {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
