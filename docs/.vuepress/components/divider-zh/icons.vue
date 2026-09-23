<template>
  <div class="center">
    <s-divider icon="cb:arrow-down" aria-label="更多内容" />
    <s-divider
      color="primary"
      variant="soft"
      icon="cb:star"
      aria-label="精选内容"
    />
    <s-divider color="success" icon="cb:checkmark" aria-label="已完成的章节" />
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
