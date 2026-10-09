<template>
  <div class="notice-demo">
    <s-notice-bar size="small" content="Small notice" closable /><s-notice-bar
      size="default"
      content="Default notice"
      closable
    /><s-notice-bar size="large" content="Large notice" closable />
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
