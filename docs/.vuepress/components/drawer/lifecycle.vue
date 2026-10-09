<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { SButton } from 'sax-design-vue'
const visible = ref(false)
const destroy = ref(false)
const force = ref(false)
const Counter = defineComponent({
  setup() {
    const count = ref(0)
    return () =>
      h(
        SButton,
        { onClick: () => count.value++ },
        `Local clicks: ${count.value}`,
      )
  },
})
</script>

<template>
  <div class="drawer-demo">
    <s-checkbox v-model="destroy">Destroy after closing</s-checkbox>
    <s-checkbox v-model="force">Render before first opening</s-checkbox>
    <s-button @click="visible = true">Open counter</s-button>
    <s-drawer
      v-model="visible"
      title="Content lifecycle"
      :destroy-on-close="destroy"
      :force-render="force"
    >
      <Counter />
      <template #footer="{ close }"
        ><s-button @click="close()">Close</s-button></template
      >
    </s-drawer>
  </div>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
