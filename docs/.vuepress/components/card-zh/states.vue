<script setup lang="ts">
import { shallowRef } from 'vue'

const selected = shallowRef(false)
</script>

<template>
  <div class="state-grid">
    <s-card
      v-model:selected="selected"
      selectable
      hover-effect="glow"
      title="可选择"
      :subtitle="selected ? '已选中' : '点击或按 Enter / 空格键'"
      text="受控状态通过 v-model:selected 与 aria-pressed 对外暴露。"
    />
    <s-card
      loading
      title="加载中"
      text="等待内容时，骨架屏会保持卡片占位稳定。"
    />
  </div>
</template>

<style lang="scss" scoped>
.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 12px;
}
</style>
