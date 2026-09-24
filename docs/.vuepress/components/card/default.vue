<template>
  <div class="default-card-demo">
    <s-card title="Project overview">
      <template #extra>
        <s-button size="small" type="flat">Details</s-button>
      </template>
      <p>
        Keep the title, supporting content, and optional actions in one quiet
        surface.
      </p>
      <template #actions>
        <s-button size="small">Continue</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.default-card-demo {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
