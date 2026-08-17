<template>
  <div class="center">
    <s-divider icon="cb:arrow-down" />
    <s-divider color="primary" icon="cb:star" />
    <s-divider color="success" icon="cb:checkmark" />
    <s-divider color="danger" icon="cb:trash-can" />
    <s-divider color="warning" icon="cb:warning" />
    <s-divider color="dark" icon="cb:time" />
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
