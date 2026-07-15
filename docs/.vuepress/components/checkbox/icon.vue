<template>
  <div class="center checks">
    <s-checkbox v-model="option1">
      <template #icon>
        <i class="bx bx-check" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option2" color="success">
      <template #icon>
        <i class="bx bx-check-double" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option3" color="danger">
      <template #icon>
        <i class="bx bx-x" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option4" color="warn">
      <template #icon>
        <i class="bx bxs-shield" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option5" color="dark">
      <template #icon>
        <i class="bx bxs-heart" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option6" color="#7d33ff">
      <template #icon>
        <i class="bx bx-brightness" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option7" color="rgb(59,222,200)">
      <template #icon>
        <i class="bx bxs-paint" />
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
  .vs-checkbox {
    margin: 5px;
  }
}
</style>
