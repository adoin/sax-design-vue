<template>
  <div class="center">
    <vs-collapse type="border">
      <vs-collapse-item open
        ><template #header>Border</template>Border style</vs-collapse-item
      >
    </vs-collapse>
    <vs-collapse type="shadow">
      <vs-collapse-item open
        ><template #header>Shadow</template>Shadow style</vs-collapse-item
      >
    </vs-collapse>
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
