<template>
  <div class="center">
    <vs-images hover="zoom">
      <vs-image src="https://picsum.photos/seed/z1/300" />
      <vs-image src="https://picsum.photos/seed/z2/300" />
    </vs-images>
    <vs-images hover="blur">
      <vs-image src="https://picsum.photos/seed/b1/300" />
      <vs-image src="https://picsum.photos/seed/b2/300" />
    </vs-images>
  </div>
</template>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
