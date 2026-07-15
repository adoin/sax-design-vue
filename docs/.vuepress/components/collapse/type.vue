<template>
  <div class="center">
    <s-collapse type="border">
      <s-collapse-item open
        ><template #header>Border</template>Border style</s-collapse-item
      >
    </s-collapse>
    <s-collapse type="shadow">
      <s-collapse-item open
        ><template #header>Shadow</template>Shadow style</s-collapse-item
      >
    </s-collapse>
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
