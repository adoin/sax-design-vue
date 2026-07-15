<template>
  <button
    class="theme-toggle"
    type="button"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="onToggle"
  >
    <i :class="isDark ? 'bx bxs-sun' : 'bx bxs-moon'" />
  </button>
</template>

<script setup lang="ts">
import { inject, onMounted, watch } from 'vue'
import { isDark, toggleDark } from '../composables'
import { vsThemeKey } from '../type'
import type { vsThemeContext } from '../type'

const $vsTheme = inject<vsThemeContext>(vsThemeKey, {} as vsThemeContext)

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
  border: 1px solid rgba(var(--s-theme-color), 0.12);
  border-radius: 10px;
  background: rgba(var(--s-theme-layout), 0.8);
  color: rgb(var(--s-theme-color));
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(var(--s-accent-color), 0.35);
    color: rgb(var(--s-accent-color));
  }

  i {
    font-size: 1.1rem;
  }
}
</style>
