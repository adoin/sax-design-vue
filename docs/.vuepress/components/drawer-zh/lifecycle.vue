<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
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
        `局部点击次数: ${count.value}`,
      )
  },
})
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-checkbox v-model="destroy">关闭后销毁内容</s-checkbox>
      <s-checkbox v-model="force">首次打开前渲染</s-checkbox>
      <s-button @click="visible = true">打开计数器</s-button>
      <s-drawer
        v-model="visible"
        title="内容生命周期"
        :destroy-on-close="destroy"
        :force-render="force"
      >
        <Counter />
        <template #footer="{ close }"
          ><s-button @click="close()">关闭</s-button></template
        >
      </s-drawer>
    </div>
  </s-config-provider>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
