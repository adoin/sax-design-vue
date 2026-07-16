<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { SNotification } from 'sax-design-vue'
import {
  buildIconCatalog,
  filterIconCatalog,
  iconNameToKebab,
  saxIcons,
} from '@sax-design-vue/icons-vue'

const copyIconVue = ref(true)
const iconNameFilter = ref('')

const { copy } = useClipboard()

const iconCatalog = buildIconCatalog(saxIcons)

const iconFiltered = computed(() =>
  filterIconCatalog(iconCatalog, iconNameFilter.value)
)

const copyContent = async (content: string) => {
  try {
    await copy(content)

    SNotification({
      showClose: true,
      content: 'Copied',
      border: 'success',
      position: 'top-center',
    })
  } catch {
    SNotification({
      showClose: true,
      content: 'Error',
      border: 'danger',
      position: 'top-center',
    })
  }
}

const copyIcon = async (
  name: string,
  refs: Record<string, unknown[] | undefined>
) => {
  if (copyIconVue.value) {
    await copyContent(`<s-icon><${name} /></s-icon>`)
  } else {
    const content =
      (
        refs[name]?.[0] as { $el?: HTMLElement } | undefined
      )?.$el?.querySelector('svg')?.outerHTML ?? ''
    await copyContent(content)
  }
}
</script>

<template>
  <div class="center">
    <div style="width: 100%">
      <div class="header">
        <s-input
          v-model="iconNameFilter"
          label="Search"
          placeholder="Type icon name (e.g. share, calendar, mail)"
        />

        <div class="icon-type">
          <span>Copy SVG</span>
          <s-switch v-model="copyIconVue" />
          <span>Copy Icon</span>
        </div>
      </div>

      <p v-if="iconNameFilter && iconFiltered.length === 0" class="empty">
        No icons match “{{ iconNameFilter }}”. Try kebab-case names like
        <code>share</code>, <code>map-pin</code>, or <code>info-circle</code>.
      </p>

      <s-row class="row">
        <s-col
          v-for="icon in iconFiltered"
          :key="icon.name"
          :ref="icon.name"
          :sm="2"
          class="col"
          @click="copyIcon(icon.name, $refs)"
        >
          <s-icon :size="30">
            <component :is="icon.component" />
          </s-icon>
          <span class="icon-name">
            {{ iconNameToKebab(icon.name) }}
          </span>
        </s-col>
      </s-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@function -color($color, $alpha: 1) {
  @return unquote('rgba(var(--sax-#{$color}), #{$alpha})');
}

.empty {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: rgba(var(--sax-theme-color), 0.72);

  code {
    font-weight: 600;
    color: rgb(var(--sax-accent-color));
  }
}

.col {
  padding: 16px;
  border: 0.5px solid -color(text, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  user-select: none;

  &:hover {
    background-color: -color(gray-4, 0.3);
  }

  .icon-name {
    font-size: 10px;
    margin-top: 12px;
    text-align: center;
    word-break: break-word;
  }
}

.header {
  display: flex;
  gap: 30px;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  margin: 20px 0;

  .icon-type {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }
}
</style>
