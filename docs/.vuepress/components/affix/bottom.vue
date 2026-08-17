<template>
  <div ref="panel" class="affix-demo">
    <p v-for="index in 18" :key="index">
      Scroll this panel. The status stays visible at the lower edge.
    </p>

    <s-affix :target="getTarget" :offset-bottom="12">
      <s-tag type="success" round>Saved changes</s-tag>
    </s-affix>
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
  background: rgba(var(--sax-theme-bg2), 0.46);
}
</style>
