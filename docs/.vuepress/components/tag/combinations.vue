<template>
  <div class="tag-combinations">
    <s-tag color="warning" variant="mark" shape="pill" icon="cb:bookmark">
      Release candidate
    </s-tag>
    <s-tag
      color="primary"
      variant="arrow"
      shape="pill"
      size="large"
      icon="cb:play"
    >
      Continue
    </s-tag>
    <s-tag
      color="success"
      variant="dashed"
      shape="pill"
      icon="cb:checkmark-filled"
    >
      Verified
    </s-tag>
  </div>
</template>

<style scoped>
.tag-combinations {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
