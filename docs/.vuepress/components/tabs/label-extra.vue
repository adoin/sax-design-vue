<script setup lang="ts">
import { ref } from 'vue'
import { STabs, STab, STag, SButton } from 'sax-design-vue'
const active = ref('account')
const selected = ref(2)
</script>
<template>
  <div style="width: 100%">
    <STabs v-model="active" type="card">
      <STab name="account" label="Account">Account settings</STab>
      <STab name="campaigns" label="Campaigns">
        <template #label-extra="{ active: isActive }">
          <STag
            v-if="selected"
            size="small"
            closable
            :color="isActive ? 'primary' : 'dark'"
            @close="selected = 0"
            >Selected {{ selected }}</STag
          >
        </template>
        Campaign settings
      </STab>
    </STabs>
    <p>Active tab: {{ active }}</p>
    <SButton size="small" type="flat" @click="selected = 2"
      >Restore selection count</SButton
    >
  </div>
</template>
