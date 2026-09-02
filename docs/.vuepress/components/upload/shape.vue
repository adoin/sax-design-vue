<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-upload
        text="Rounded upload"
        :multiple="false"
        :show-submit-button="false"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-upload
        text="Square upload"
        shape="square"
        :multiple="false"
        :show-submit-button="false"
      />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
}

.shape-demo__item {
  display: grid;
  gap: 8px;
}
</style>
