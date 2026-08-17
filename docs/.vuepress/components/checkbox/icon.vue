<template>
  <div class="center checks">
    <s-checkbox v-model="option1">
      <template #icon>
        <s-icon  name="bx:check" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option2" color="success">
      <template #icon>
        <s-icon  name="bx:check-double" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option3" color="danger">
      <template #icon>
        <s-icon  name="bx:x" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option4" color="warn">
      <template #icon>
        <s-icon  name="bxs:shield" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option5" color="dark">
      <template #icon>
        <s-icon  name="bxs:heart" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option6" color="#7d33ff">
      <template #icon>
        <s-icon  name="bx:brightness" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option7" color="rgb(59,222,200)">
      <template #icon>
        <s-icon  name="bxs:paint" />
      </template>
    </s-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const option1 = ref(true)
const option2 = ref(true)
const option3 = ref(true)
const option4 = ref(false)
const option5 = ref(true)
const option6 = ref(true)
const option7 = ref(true)
</script>
<style lang="scss">
.checks {
  .s-checkbox {
    margin: 5px;
  }
}
</style>
