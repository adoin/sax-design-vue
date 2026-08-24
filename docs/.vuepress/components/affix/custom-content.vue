<template>
  <div ref="panel" class="affix-demo">
    <s-affix :target="getTarget" :offset-top="12" :z-index="2">
      <div class="affix-demo__toolbar">
        <strong>Project filters</strong>
        <div>
          <s-tag round>Vue 3</s-tag>
          <s-button size="small">Apply</s-button>
        </div>
      </div>
    </s-affix>

    <p v-for="index in 18" :key="index">
      Default slot accepts any content, including a complete toolbar.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const panel = ref<HTMLElement>()
const getTarget = () => panel.value || window
</script>

<style scoped>
.affix-demo {
  position: relative;
  height: 260px;
  padding: 12px 20px 20px;
  overflow-y: auto;
  border-radius: 14px;
  background: hsl(var(--sax-theme-bg2) / 0.46);
}

.affix-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: min(100%, 360px);
  padding: 10px 12px;
  border-radius: 12px;
  background: hsl(var(--sax-theme-layout));
  box-shadow: 0 10px 22px hsl(var(--sax-accent-color) / 0.12);
}

.affix-demo__toolbar > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
