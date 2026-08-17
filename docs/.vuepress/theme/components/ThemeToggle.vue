<template>
  <button
    class="theme-toggle"
    type="button"
    :title="isDark ? t.shell.switchLight : t.shell.switchDark"
    :aria-label="isDark ? t.shell.switchLight : t.shell.switchDark"
    @click="onToggle"
  >
    <s-icon :name="isDark ? 'bxs:sun' : 'bxs:moon'"  />
  </button>
</template>

<script setup lang="ts">
import { inject, onMounted, watch } from 'vue'
import { isDark, toggleDark } from '../composables'
import { vsThemeKey } from '../type'
import { useDocLocaleUi } from '../composables/docLocale'
import type { vsThemeContext } from '../type'

const $vsTheme = inject<vsThemeContext>(vsThemeKey, {} as vsThemeContext)
const { t } = useDocLocaleUi()

const syncTheme = () => {
  $vsTheme.themeDarken = isDark.value
}

const onToggle = () => {
  toggleDark()
  syncTheme()
}

onMounted(syncTheme)
watch(isDark, syncTheme)
</script>

<style lang="scss" scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 8px;
  border: 1px solid rgba(var(--sax-theme-color), 0.12);
  border-radius: 10px;
  background: rgba(var(--sax-theme-layout), 0.8);
  color: rgb(var(--sax-theme-color));
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(var(--sax-accent-color), 0.35);
    color: rgb(var(--sax-accent-color));
  }

  i {
    font-size: 1.1rem;
  }
}
</style>
