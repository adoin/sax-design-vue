<template>
  <div class="grid">
    <s-row>
      <s-col :sm="num">
        {{ num }}
      </s-col>
      <s-col :sm="num2">
        {{ num2 }}
      </s-col>
      <s-col :sm="num">
        {{ num }}
      </s-col>
    </s-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const num = ref(2)
const num2 = ref(8)

onMounted(() => {
  setInterval(() => {
    if (num.value == 2) {
      num.value = 4
      num2.value = 4
    } else if (num.value == 4) {
      num.value = 1
      num2.value = 10
    } else if (num.value == 1) {
      num.value = 5
      num2.value = 2
    } else if (num.value == 5) {
      num.value = 2
      num2.value = 8
    }
  }, 2000)
})
</script>
<style scoped lang="scss">
@function -var($var) {
  @return unquote('var(--sax-' + var + ')');
}
@function -color($color, $alpha: 1) {
  @return unquote('rgba(var(--sax-#{$color}), #{$alpha})');
}
.grid {
  border-radius: 20px;
}
.s-row {
  background: -color('theme-layout');
}
.s-col {
  padding: 10px;
  text-align: center;
  background: -color('theme-bg2');
  cursor: default;
  transition: all 0.25s ease;
  box-shadow: inset 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
  border: 2px solid -color('theme-layout');
  &:hover {
    transform: scale(0.93);
    box-shadow: inset 0px 10px 20px -10px rgba(0, 0, 0, 0.1);
  }
}
</style>
