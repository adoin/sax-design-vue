<template>
  <div class="center">
    <s-divider>透明背景</s-divider>
    <s-divider background="#edf1ff" label-color="#334888">
      淡紫色表面
    </s-divider>
    <s-divider background="#e8f7f1" label-color="#246853">
      薄荷色表面
    </s-divider>
    <s-divider background="dark">深色表面</s-divider>
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
