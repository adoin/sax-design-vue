<template>
  <div class="center checks">
    <s-checkbox v-model="option1" icon-animation="draw">
      <template #icon="{ checked }">
        <svg
          class="checkbox-line-icon"
          :data-checked="checked"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M 4.7071 12.2929 l 5 5 c 0.3905 0.3905 1.0237 0.3905 1.4142 0 l 11 -11"
            stroke-width="3.5"
            stroke-linecap="round"
          />
        </svg>
      </template>
    </s-checkbox>
    <s-checkbox v-model="option2" color="success">
      <template #icon>
        <s-icon name="bx:check-double" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option3" color="danger">
      <template #icon>
        <s-icon name="bx:x" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option4" color="warn">
      <template #icon>
        <s-icon name="bxs:shield" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option5" color="dark">
      <template #icon>
        <s-icon name="bxs:heart" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option6" color="#7d33ff">
      <template #icon>
        <s-icon name="bx:brightness" />
      </template>
    </s-checkbox>
    <s-checkbox v-model="option7" color="rgb(59,222,200)">
      <template #icon>
        <s-icon name="bxs:paint" />
      </template>
    </s-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const option1 = ref(false)
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

  .checkbox-line-icon {
    width: 1em;
    height: 1em;
  }
}
</style>
