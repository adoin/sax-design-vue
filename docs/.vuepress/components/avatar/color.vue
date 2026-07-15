<template>
  <div class="center con-avatars">
    <s-avatar color="primary">
      <template #text> Primary </template>
    </s-avatar>
    <s-avatar color="success">
      <template #text> Success </template>
    </s-avatar>
    <s-avatar color="danger">
      <template #text> Danger </template>
    </s-avatar>
    <s-avatar color="warn">
      <template #text> Warn </template>
    </s-avatar>
    <s-avatar color="dark">
      <template #text> Dark </template>
    </s-avatar>
    <s-avatar color="#7d33ff">
      <template #text> HEX </template>
    </s-avatar>
    <s-avatar color="rgb(59,222,200)">
      <template #text> RGB </template>
    </s-avatar>
  </div>
</template>
<style scoped lang="scss">
.con-avatars {
  .vs-avatar-content {
    margin: 10px;
  }
}
</style>
