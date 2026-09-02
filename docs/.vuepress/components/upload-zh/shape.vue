<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>圆角</s-text>
      <s-upload
        text="圆角上传区"
        :multiple="false"
        :show-submit-button="false"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>方形</s-text>
      <s-upload
        text="方形上传区"
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
