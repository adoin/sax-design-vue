<script lang="ts" setup>
import { shallowRef } from 'vue'

const expanded = shallowRef(false)
</script>

<template>
  <s-content-ellipsis v-model:expanded="expanded" :collapsed-height="132">
    <div class="content-ellipsis-demo">
      <div class="content-ellipsis-demo__heading">
        <s-tag size="small" status="primary">工作区</s-tag>
        <strong>版本概览</strong>
      </div>
      <p>这次更新让导航、通用样式和内容操作在同一个工作区内保持一致。</p>
      <ul>
        <li>导航持续标明当前位置，便于返回和继续浏览。</li>
        <li>通用控件采用一致的尺寸和焦点反馈。</li>
        <li>更多说明在需要时仍可完整查看。</li>
      </ul>
    </div>
  </s-content-ellipsis>
</template>

<style scoped>
.content-ellipsis-demo {
  font-size: 14px;
  line-height: 1.65;
}

.content-ellipsis-demo__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.content-ellipsis-demo p {
  margin: 0 0 10px;
}

.content-ellipsis-demo ul {
  margin: 0;
  padding-left: 20px;
}
</style>
