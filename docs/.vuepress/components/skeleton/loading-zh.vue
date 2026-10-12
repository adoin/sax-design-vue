<script setup lang="ts">
import { shallowRef } from 'vue'
import type { SkeletonRow } from 'sax-design-vue'
const loading = shallowRef(true)
const rows: SkeletonRow[] = [
  [
    { type: 'circle', size: 56 },
    {
      type: 'group',
      gap: 8,
      rows: [
        [{ type: 'line', width: '40%', height: 20 }],
        [{ type: 'line', height: 20 }],
        [{ type: 'line', width: '68%', height: 20 }],
      ],
    },
  ],
]
</script>
<template>
  <div class="skeleton-demo">
    <s-button @click="loading = !loading">{{
      loading ? '展示内容' : '重新加载'
    }}</s-button>
    <s-skeleton :loading="loading" :rows="rows">
      <div class="profile-content">
        <s-avatar shape="circle" :size="56"
          ><img src="/avatars/avatar-5.png" alt="林悦"
        /></s-avatar>
        <div class="profile-copy">
          <strong>林悦</strong>
          <p>产品设计师</p>
          <p>负责工作台与组件设计。</p>
        </div>
      </div>
    </s-skeleton>
  </div>
</template>
<style scoped>
.skeleton-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 24px;
}
.skeleton-demo > .s-button {
  justify-self: start;
}
.profile-content {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 76px;
}
.profile-copy {
  display: grid;
  gap: 8px;
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
}
.profile-copy p {
  margin: 0;
  line-height: 20px;
}
.profile-content .s-avatar-content {
  flex-shrink: 0;
}
</style>
