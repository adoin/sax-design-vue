<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import type { FormInstance } from 'sax-design-vue'

const formRef = useTemplateRef<FormInstance>('formRef')
const model = reactive({ city: '', street: '', receiver: '', mobile: '' })
const rules = {
  receiver: { required: true, message: '请输入收件人' },
  mobile: { required: true, message: '请输入手机号' },
}
</script>

<template>
  <s-form ref="formRef" :model="model" :rules="rules">
    <s-form-item label="配送信息" nested>
      <s-form-item label="城市" prop="city" :span="12">
        <s-input v-model="model.city" placeholder="城市" />
      </s-form-item>
      <s-form-item label="街道" prop="street" :span="12">
        <s-input v-model="model.street" placeholder="街道地址" />
      </s-form-item>
      <s-form-item label="收件人" prop="receiver" :span="12">
        <s-input v-model="model.receiver" placeholder="姓名" />
      </s-form-item>
      <s-form-item label="手机号" prop="mobile" :span="12">
        <s-input v-model="model.mobile" placeholder="联系电话" />
      </s-form-item>
    </s-form-item>
    <s-form-item :reserve-error-space="false" align="right">
      <s-button @click="formRef?.validate()"> 校验配送信息 </s-button>
    </s-form-item>
  </s-form>
</template>
