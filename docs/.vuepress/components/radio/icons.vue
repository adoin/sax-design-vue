<template>
  <div class="center">
    <s-radio v-model="picked" value="1" icon-animation="draw">
      Draw SVG
      <template #icon="{ checked }">
        <svg
          class="radio-line-icon"
          :data-checked="checked"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M5 12.5 9.5 17 19 7.5"
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
    </s-radio>
    <s-radio v-model="picked" value="2">
      Won
      <template #icon>
        <s-icon name="bx:won" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="3">
      Pound
      <template #icon>
        <s-icon name="bx:pound" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="4">
      Euro
      <template #icon>
        <s-icon name="bx:euro" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="5">
      Rupee
      <template #icon>
        <s-icon name="bx:rupee" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="6">
      Bitcoin
      <template #icon>
        <s-icon name="bx:bitcoin" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="7">
      Dollar
      <template #icon>
        <s-icon name="bx:dollar" />
      </template>
    </s-radio>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'

const picked = shallowRef('1')
</script>
<style scoped lang="scss">
.center {
  align-items: flex-start;
  flex-direction: column;
  .s-radio-wrapper {
    margin: 5px 0px;
  }

  .radio-line-icon {
    width: 100%;
    height: 100%;
  }
}
</style>
