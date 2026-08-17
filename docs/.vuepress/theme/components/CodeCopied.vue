<template>
  <div :class="{ copied }" class="noti-code">
    <s-icon  name="bx:check" /> {{ text || t.examples.codeCopied }}
  </div>
</template>

<script setup lang="ts">
import { useDocLocaleUi } from '../composables/docLocale'

defineProps<{
  copied: boolean
  text?: string
}>()

const { t } = useDocLocaleUi()
</script>

<style lang="scss">
@use '../styles/use' as *;

.noti-code {
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 500px;
  background: -color('theme-color');
  left: 50%;
  transform: translate(-50%, 100%);
  padding: 10px 20px;
  text-align: center;
  color: -color('theme-layout');
  border-radius: 20px 20px 0px 0px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
  z-index: 1000;

  i {
    position: absolute;
    left: 0px;
    top: 0px;
    font-size: 20px;
    width: 45px;
    height: 45px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px 0px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.copied {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0%);
  }
}
</style>
