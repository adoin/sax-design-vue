<template>
  <div class="list-virtual-example">
    <div class="list-virtual-example__actions">
      <s-button @click="list?.scrollToIndex(0, 'start')">回到首项</s-button>
      <s-button @click="list?.scrollToIndex(9999, 'end')">定位末项</s-button>
    </div>
    <s-list
      ref="list"
      :items="items"
      :item-key="itemKey"
      virtual
      :virtual-config="{
        height: 320,
        estimateSize: 52,
        overscan: 6,
        dynamic: true,
      }"
    >
      <s-list-header title="10,000 条记录" />
      <template #item="{ item, index }">
        <s-list-item
          :title="String(item.title)"
          :subtitle="String(item.subtitle)"
        >
          <s-tag>{{ index + 1 }}</s-tag>
        </s-list-item>
      </template>
    </s-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ListInstance, ListItemKey } from 'sax-design-vue'

const list = ref<ListInstance>()
const itemKey: ListItemKey = (item) => Number(item.id)
const descriptions = [
  '简短说明',
  '本周的设计资源已经更新，包含导航、表单和数据展示组件的使用说明。请各模块负责人核对相关页面中的文案、默认状态和禁用状态，并在评审前补充实际业务场景。对于移动端和较窄的侧边面板，还需要确认长标题与说明文字能够自然换行，操作按钮保持可见，内容不会被截断或相互遮挡。',
  '这是一条包含完整交付信息的项目记录。设计团队已整理组件规范、交互说明和资源目录，开发团队需要按模块完成接入，并检查不同主题、语言和屏幕宽度下的展示效果。对于较长的说明文字，应保留完整内容并允许自然换行，避免用户为了理解一条记录而反复展开弹层。测试阶段还需要覆盖空数据、加载中、请求失败、权限不足和连续操作等场景，确认每种状态都有清楚的反馈。完成后请补充使用示例、变更说明和必要的验证记录，再提交给相关负责人复核。最终交付时应确保设计稿、实现代码与文档中的行为一致，让后续维护者能够直接理解这条记录的背景、当前进展以及下一步需要完成的工作。',
]
const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  title: `记录 ${index + 1}`,
  subtitle: descriptions[index % descriptions.length],
}))
</script>

<style scoped>
.list-virtual-example {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.list-virtual-example__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
