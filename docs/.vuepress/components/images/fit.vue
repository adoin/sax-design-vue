<script setup lang="ts">
const examples = [
  { label: 'Contain', fit: 'contain', position: 'center' },
  { label: 'Cover · center', fit: 'cover', position: 'center' },
  { label: 'Cover · top', fit: 'cover', position: 'top' },
  { label: 'Fill', fit: 'fill', position: 'center' },
  { label: 'None', fit: 'none', position: 'center' },
  { label: 'Scale down', fit: 'scale-down', position: 'center' },
] as const
</script>

<template>
  <div class="fit-demo">
    <figure v-for="item in examples" :key="item.label" class="fit-demo__item">
      <figcaption>{{ item.label }}</figcaption>
      <s-images not-margin>
        <s-image
          src="https://picsum.photos/id/1025/480/720"
          :alt="`Portrait photograph rendered with ${item.label}`"
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
