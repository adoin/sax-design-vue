<template>
  <s-breadcrumb :items="items" separator="chevron_right" />
</template>

<script lang="ts" setup>
const items = [
  {
    title: '工作区',
    url: '#default',
    children: [
      { title: '概览', url: '#default' },
      {
        title: '资源库',
        url: '#tree-shortcuts',
        children: [
          { title: '组件', url: '#color' },
          { title: '设计模式', url: '#separator' },
        ],
      },
    ],
  },
  {
    title: '组件',
    url: '#color',
    children: [
      { title: '导航', url: '#alignment' },
      { title: '反馈', url: '#separator' },
      { title: '数据录入', url: '#default' },
    ],
  },
  { title: '面包屑', active: true },
]
</script>
