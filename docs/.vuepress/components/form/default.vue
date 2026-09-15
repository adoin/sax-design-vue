<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormItemConfig } from 'sax-design-vue'

const model = reactive({
  account: { name: '', email: '' },
  profile: { role: '', region: '', notifications: true },
  note: '',
})

const items: FormItemConfig[] = [
  {
    title: '账户信息',
    description: '用于登录和接收重要通知。',
    children: [
      {
        field: 'account.name',
        title: '姓名',
        span: 12,
        rules: { required: true, message: '请输入姓名', trigger: 'blur' },
        itemRender: {
          name: '$input',
          props: { placeholder: '请输入姓名' },
        },
      },
      {
        field: 'account.email',
        title: '邮箱',
        span: 12,
        rules: {
          required: true,
          message: '请输入邮箱',
          trigger: 'change',
          validator: (value) =>
            /.+@.+\..+/.test(String(value)) || '请输入有效邮箱',
        },
        itemRender: {
          name: '$input',
          props: { placeholder: 'name@example.com' },
        },
      },
    ],
  },
  {
    title: '工作资料',
    description: '嵌套 Item 内仍使用 24 栅格进行复杂布局。',
    children: [
      {
        field: 'profile.role',
        title: '角色',
        span: 12,
        itemRender: {
          name: '$select',
          props: { placeholder: '请选择角色' },
          options: [
            { label: '产品设计', value: 'design' },
            { label: '前端开发', value: 'frontend' },
            { label: '项目管理', value: 'manager' },
          ],
        },
      },
      {
        field: 'profile.region',
        title: '办公区域',
        span: 12,
        itemRender: {
          name: '$input',
          props: { placeholder: '例如：上海' },
        },
      },
      {
        field: 'profile.notifications',
        title: '消息通知',
        span: 12,
        description: '接收工作区状态和审核提醒。',
        itemRender: { name: '$switch' },
      },
      {
        field: 'note',
        title: '备注',
        span: 12,
        itemRender: {
          name: '$textarea',
          props: { placeholder: '补充说明', rows: 3 },
        },
      },
    ],
  },
  {
    span: 24,
    align: 'right',
    reserveErrorSpace: false,
    itemRender: {
      name: '$buttons',
      options: [
        { code: 'reset', text: '重置', props: { type: 'flat' } },
        { code: 'submit', text: '校验并保存' },
      ],
    },
  },
]
</script>

<template>
  <s-form :model="model" :items="items" />
</template>
