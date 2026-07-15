<template>
  <div class="play-container demo">
    <s-divider> Divider </s-divider>
    <s-divider color="primary"> Primary </s-divider>
    <s-divider position="left"> Left </s-divider>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  gap: 8px;
  width: min(520px, 90vw);
}
</style>
