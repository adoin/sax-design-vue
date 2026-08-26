<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import type { FormInstance, FormItemConfig } from 'sax-design-vue'

const formRef = useTemplateRef<FormInstance>('formRef')
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
          name: 'SInput',
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
          name: 'SInput',
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
          name: 'SSelect',
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
          name: 'SInput',
          props: { placeholder: '例如：上海' },
        },
      },
      {
        field: 'profile.notifications',
        title: '消息通知',
        span: 12,
        description: '接收工作区状态和审核提醒。',
        itemRender: { name: 'SSwitch' },
      },
      {
        field: 'note',
        title: '备注',
        span: 12,
        itemRender: {
          name: 'STextarea',
          props: { placeholder: '补充说明', rows: 3 },
        },
      },
    ],
  },
  {
    span: 24,
    align: 'right',
    reserveErrorSpace: false,
    slots: { default: 'actions' },
  },
]
</script>

<template>
  <s-form ref="formRef" :model="model" :items="items">
    <template #actions>
      <span class="form-demo__actions">
        <s-button type="flat" @click="formRef?.resetFields()"> 重置 </s-button>
        <s-button @click="formRef?.validate()"> 校验并保存 </s-button>
      </span>
    </template>
  </s-form>
</template>

<style scoped>
.form-demo__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
