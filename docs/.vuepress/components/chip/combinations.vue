<template>
  <div class="chip-combinations">
    <s-chip color="warning" tag-style="mark" round icon="cb:bookmark">
      Release candidate
    </s-chip>
    <s-chip
      color="primary"
      tag-style="arrow"
      round
      size="large"
      icon="cb:play"
    >
      Continue
    </s-chip>
    <s-chip color="success" tag-style="dashed" round icon="cb:checkmark-filled">
      Verified
    </s-chip>
  </div>
</template>

<style scoped>
.chip-combinations {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

</style>
