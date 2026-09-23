<template>
  <div class="center">
    <s-divider border-style="solid">实线 · 1px</s-divider>
    <s-divider border-style="dashed" border-height="2px" color="primary">
      虚线 · 2px
    </s-divider>
    <s-divider border-style="dotted" border-height="2px" color="success">
      点线 · 2px
    </s-divider>
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
