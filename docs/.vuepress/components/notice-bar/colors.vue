<template>
  <div class="notice-demo">
    <s-notice-bar
      type="info"
      content="A general announcement for your workspace."
    /><s-notice-bar
      type="primary"
      content="A highlighted announcement worth reading."
    /><s-notice-bar
      type="success"
      content="The update completed successfully."
    /><s-notice-bar
      type="warning"
      content="Scheduled maintenance starts later today."
    /><s-notice-bar
      type="danger"
      content="Some services are temporarily unavailable."
    /><s-notice-bar color="#7658ab" content="A custom brand color." />
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
