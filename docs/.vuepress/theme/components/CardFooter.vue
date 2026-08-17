<template>
  <footer
    :title="active ? t.shell.hideCode : t.shell.showCode"
    class="footer-code"
    @click="$emit('toggleCode')"
  >
    <s-icon  name="bx:hide" />
  </footer>
</template>

<script setup lang="ts">
import { useDocLocaleUi } from '../composables/docLocale'

defineProps<{
  active?: boolean
}>()
defineEmits<{
  (event: 'toggleCode'): void
}>()

const { t } = useDocLocaleUi()
</script>

<style lang="scss">
.footer-code {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    opacity: 0.4;
  }
}
</style>
