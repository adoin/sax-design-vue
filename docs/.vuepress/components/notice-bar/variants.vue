<template>
  <div class="notice-demo">
    <s-notice-bar
      type="primary"
      variant="soft"
      content="Soft background for everyday announcements."
    /><s-notice-bar
      type="primary"
      variant="solid"
      content="Solid surface for an emphasized announcement."
    /><s-notice-bar
      type="primary"
      variant="plain"
      content="Plain treatment that blends into surrounding content."
    />
  </div>
</template>

<style scoped>
.notice-demo {
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}
.notice-grid p {
  margin: 0 0 12px;
}
</style>
