<template>
  <div class="center">
    <s-radio v-model="picked" value="1">
      Yen
      <template #icon>
        <s-icon  name="bx:yen" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="2">
      Won
      <template #icon>
        <s-icon  name="bx:won" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="3">
      Pound
      <template #icon>
        <s-icon  name="bx:pound" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="4">
      Euro
      <template #icon>
        <s-icon  name="bx:euro" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="5">
      Rupee
      <template #icon>
        <s-icon  name="bx:rupee" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="6">
      Bitcoin
      <template #icon>
        <s-icon  name="bx:bitcoin" />
      </template>
    </s-radio>
    <s-radio v-model="picked" value="7">
      Dollar
      <template #icon>
        <s-icon  name="bx:dollar" />
      </template>
    </s-radio>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const picked = ref(1)
</script>
<style scoped lang="scss">
.center {
  align-items: flex-start;
  flex-direction: column;
  .s-radio-wrapper {
    margin: 5px 0px;
  }
}
</style>
