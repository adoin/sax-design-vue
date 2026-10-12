<template>
  <div class="skeleton-animation-demo">
    <div>
      <p>流光</p>
      <s-skeleton animation="shimmer" />
    </div>
    <div>
      <p>呼吸</p>
      <s-skeleton animation="pulse" />
    </div>
    <div>
      <p>静态</p>
      <s-skeleton animation="none" />
    </div>
  </div>
</template>
<style scoped>
.skeleton-animation-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 28px;
  width: 100%;
}
.skeleton-animation-demo p {
  margin: 0 0 20px;
}
</style>
