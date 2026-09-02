<script setup lang="ts">
const variants = [
  { name: '浮层', value: 'elevated' },
  { name: '描边', value: 'outlined' },
  { name: '柔和', value: 'soft' },
  { name: '实色', value: 'solid' },
  { name: '素面', value: 'plain' },
  { name: '玻璃', value: 'glass' },
] as const
</script>

<template>
  <div class="variant-stage">
    <s-card
      v-for="item in variants"
      :key="item.value"
      :variant="item.value"
      color="primary"
      :title="item.name"
      text="表面样式可与内容结构和排列方式自由组合。"
    />
  </div>
</template>

<style lang="scss" scoped>
.variant-stage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 24px;
  border-radius: var(--sax-radius-xl);
  background:
    radial-gradient(
      circle at 12% 18%,
      hsl(var(--sax-primary) / 18%),
      transparent 34%
    ),
    radial-gradient(
      circle at 88% 82%,
      hsl(var(--sax-success) / 14%),
      transparent 36%
    ),
    hsl(var(--sax-background));
}
</style>
