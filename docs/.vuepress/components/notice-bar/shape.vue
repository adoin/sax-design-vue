<template>
  <div class="notice-grid">
    <div>
      <p>Rounded</p>
      <s-notice-bar
        type="primary"
        shape="rounded"
        content="The same notice with a different geometry."
        closable
      />
    </div>
    <div>
      <p>Square</p>
      <s-notice-bar
        type="primary"
        shape="square"
        content="The same notice with a different geometry."
        closable
      />
    </div>
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
