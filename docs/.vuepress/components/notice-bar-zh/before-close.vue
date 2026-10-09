<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
import type { NoticeBarBeforeCloseFn, NoticeBarInstance } from 'sax-design-vue'

const storageKey = 'sax-notice-before-close-example-zh'
const notice = useTemplateRef<NoticeBarInstance>('notice')
const visible = shallowRef(true)
const permanent = shallowRef(false)
const decisionOpen = shallowRef(false)
const storageError = shallowRef('')
let choice: 'temporary' | 'permanent' | undefined
let decision:
  { resolve: () => void; reject: (reason: Error) => void } | undefined

const beforeClose: NoticeBarBeforeCloseFn = () =>
  new Promise<void>((resolve, reject) => {
    choice = undefined
    storageError.value = ''
    decision = { resolve, reject }
    decisionOpen.value = true
  })

const choose = (value: 'temporary' | 'permanent') => {
  if (value === 'permanent') {
    try {
      localStorage.setItem(storageKey, 'closed')
      permanent.value = true
    } catch {
      storageError.value = '无法保存关闭偏好，仍可选择本次关闭。'
      return
    }
  }
  choice = value
  decisionOpen.value = false
}
const finishDecision = () => {
  const pending = decision
  decision = undefined
  if (choice) pending?.resolve()
  else pending?.reject(new Error('已取消关闭'))
}
const reset = () => {
  try {
    localStorage.removeItem(storageKey)
    permanent.value = false
    visible.value = true
  } catch {
    storageError.value = '无法清除已保存的关闭偏好。'
  }
}
onMounted(() => {
  try {
    permanent.value = localStorage.getItem(storageKey) === 'closed'
    visible.value = !permanent.value
  } catch {
    permanent.value = false
  }
})
onBeforeUnmount(() => {
  decision?.reject(new Error('示例已卸载'))
  decision = undefined
})
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-close-demo">
      <s-button
        size="small"
        flat
        :disabled="notice?.closePending"
        @click="reset"
      >
        清除偏好并显示
      </s-button>
      <s-notice-bar
        ref="notice"
        v-model="visible"
        content="工作区使用提示已更新，点击关闭可选择本次关闭或永久关闭。"
        closable
        :before-close="beforeClose"
      />
      <span role="status">
        {{
          permanent
            ? '已永久关闭，刷新后仍隐藏。'
            : visible
              ? '公告正在显示。'
              : '已本次关闭，刷新后重新显示。'
        }}
      </span>
      <s-dialog
        v-model="decisionOpen"
        title="如何关闭这条公告？"
        :width="460"
        show-footer
        :mask-closable="false"
        @closed="finishDecision"
      >
        <p>本次关闭会在刷新后重新显示；永久关闭会将偏好保存在当前浏览器。</p>
        <p v-if="storageError" role="alert">{{ storageError }}</p>
        <template #footer>
          <div class="notice-close-demo__actions">
            <s-button flat @click="decisionOpen = false">保留公告</s-button>
            <s-button flat @click="choose('temporary')">本次关闭</s-button>
            <s-button @click="choose('permanent')">永久关闭</s-button>
          </div>
        </template>
      </s-dialog>
      <p v-if="storageError && !decisionOpen" role="alert">
        {{ storageError }}
      </p>
    </div>
  </s-config-provider>
</template>

<style scoped>
.notice-close-demo {
  display: grid;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-close-demo__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
.notice-close-demo p {
  margin: 0;
  line-height: 1.6;
}
</style>
