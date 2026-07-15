<template>
  <div class="center">
    <s-images hover="zoom">
      <s-image src="https://picsum.photos/seed/z1/300" />
      <s-image src="https://picsum.photos/seed/z2/300" />
    </s-images>
    <s-images hover="blur">
      <s-image src="https://picsum.photos/seed/b1/300" />
      <s-image src="https://picsum.photos/seed/b2/300" />
    </s-images>
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
