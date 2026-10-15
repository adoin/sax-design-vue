<script setup lang="ts">
import { ref } from 'vue'
import { STabs, STab, STag, SButton } from 'sax-design-vue'
const active = ref('account')
const selected = ref(2)
</script>
<template>
  <div style="width: 100%">
    <STabs v-model="active" type="card">
      <STab name="account" label="广告账户">账户设置</STab>
      <STab name="campaigns" label="广告系列">
        <template #label-extra="{ active: isActive }">
          <STag
            v-if="selected"
            size="small"
            closable
            :color="isActive ? 'primary' : 'dark'"
            @close="selected = 0"
            >已选 {{ selected }}</STag
          >
        </template>
        广告系列内容
      </STab>
    </STabs>
    <p>当前标签： {{ active }}</p>
    <SButton size="small" type="flat" @click="selected = 2"
      >恢复已选数量</SButton
    >
  </div>
</template>
