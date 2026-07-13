<template>
  <div class="center">
    <vs-divider icon="arrow_downward" />
    <vs-divider color="primary" icon="star" />
    <vs-divider color="success" icon="check" />
    <vs-divider color="danger" icon="delete_forever" />
    <vs-divider color="warning" icon="report_problem" />
    <vs-divider color="dark" icon="watch_later" />
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
