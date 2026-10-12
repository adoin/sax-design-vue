<template>
  <div class="skeleton-animation-demo">
    <div>
      <p>Shimmer</p>
      <s-skeleton animation="shimmer" />
    </div>
    <div>
      <p>Pulse</p>
      <s-skeleton animation="pulse" />
    </div>
    <div>
      <p>Static</p>
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
