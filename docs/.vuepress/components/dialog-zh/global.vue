<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { SDialog, STextarea } from 'sax-design-vue'
const mounted = ref(false)
const persistent = ref(false)
const Owner = defineComponent({
  props: { survive: Boolean },
  setup(props) {
    const visible = ref(true)
    const draft = ref('输入内容后先最小化，再使用页面按钮销毁所属组件。')
    return () =>
      h(
        SDialog,
        {
          modelValue: visible.value,
          'onUpdate:modelValue': (value: boolean) => {
            visible.value = value
          },
          global: props.survive,
          fullScreen: true,
          lockScroll: true,
          title: props.survive ? '全局草稿' : '局部草稿',
        },
        {
          default: () =>
            h(STextarea, {
              modelValue: draft.value,
              'onUpdate:modelValue': (value: string) => {
                draft.value = value
              },
              rows: 6,
              'aria-label': '草稿内容',
            }),
        },
      )
  },
})
</script>

<template>
  <div class="dialog-owner-demo">
    <div class="dialog-owner-demo__controls">
      <s-switch v-model="persistent" :disabled="mounted" aria-label="global" />
      <span>global</span>
      <s-button :disabled="mounted" @click="mounted = true"
        >创建并打开</s-button
      >
      <s-button :disabled="!mounted" @click="mounted = false"
        >销毁所属组件</s-button
      >
    </div>
    <p>
      先最小化弹窗，再销毁所属组件。默认气泡会消失；开启 global
      后，可从底部气泡恢复并继续编辑。用气泡或弹窗的关闭按钮结束全局实例。
    </p>
    <Owner v-if="mounted" :survive="persistent" />
  </div>
</template>

<style scoped>
.dialog-owner-demo {
  display: grid;
  gap: 16px;
}
.dialog-owner-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.dialog-owner-demo p {
  margin: 0;
}
</style>
