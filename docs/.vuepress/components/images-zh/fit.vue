<script setup lang="ts">
const examples = [
  { label: '完整容纳', fit: 'contain', position: 'center' },
  { label: '居中裁切', fit: 'cover', position: 'center' },
  { label: '顶部裁切', fit: 'cover', position: 'top' },
  { label: '拉伸填满', fit: 'fill', position: 'center' },
  { label: '原始尺寸', fit: 'none', position: 'center' },
  { label: '按需缩小', fit: 'scale-down', position: 'center' },
] as const
</script>

<template>
  <div class="fit-demo">
    <figure v-for="item in examples" :key="item.label" class="fit-demo__item">
      <figcaption>{{ item.label }}</figcaption>
      <s-images not-margin>
        <s-image
          src="https://picsum.photos/id/1025/480/720"
          :alt="`使用${item.label}模式展示的竖版照片`"
          :fit="item.fit"
          :position="item.position"
          width="176"
          aspect-ratio="4 / 3"
          loading="lazy"
        />
      </s-images>
    </figure>
  </div>
</template>

<style scoped>
.fit-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
  gap: 18px;
  width: 100%;
}

.fit-demo__item {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin: 0;
  color: hsl(var(--sax-text) / 0.72);
  font-size: 13px;
}

.fit-demo__item :deep(.s-images__ul) {
  justify-content: center;
  padding: 0;
}
</style>
