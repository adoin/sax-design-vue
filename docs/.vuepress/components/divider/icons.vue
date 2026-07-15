<template>
  <div class="center">
    <s-divider icon="arrow_downward" />
    <s-divider color="primary" icon="star" />
    <s-divider color="success" icon="check" />
    <s-divider color="danger" icon="delete_forever" />
    <s-divider color="warning" icon="report_problem" />
    <s-divider color="dark" icon="watch_later" />
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
