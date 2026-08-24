<template>
  <div ref="panel" class="affix-demo">
    <s-affix :target="getTarget" :offset-top="12" @change="handleChange">
      <s-button type="gradient">{{ affixed ? 'Pinned' : 'Pin me' }}</s-button>
    </s-affix>

    <p v-for="index in 18" :key="index">
      Scroll this panel. The action stays pinned to its top edge.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const panel = ref<HTMLElement>()
const affixed = ref(false)
const getTarget = () => panel.value || window
const handleChange = (value: boolean) => (affixed.value = value)
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
</style>
