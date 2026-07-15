<template>
  <div class="prompt-demo">
    <s-button type="border" @click="active = true"
      >Run validation prompt</s-button
    >
    <s-prompt
      v-model="active"
      color="danger"
      title="Dialog"
      :is-valid="validName"
      @cancel="reset"
      @accept="active = false"
      @close="active = false"
    >
      <div class="con-exemple-prompt">
        Enter your first and last name to <b>continue</b>.
        <s-input v-model="firstName" placeholder="Name" />
        <s-input v-model="lastName" placeholder="Last Name" />
        <s-alert :active="!validName" color="danger" icon="new_releases">
          Fields can not be empty please enter the data
        </s-alert>
      </div>
    </s-prompt>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const active = ref(false)
const firstName = ref('')
const lastName = ref('')

const validName = computed(
  () => firstName.value.length > 0 && lastName.value.length > 0
)

const reset = () => {
  firstName.value = ''
  lastName.value = ''
}
</script>

<style scoped lang="scss">
.prompt-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.con-exemple-prompt {
  padding: 10px 10px 0;

  :deep(.vs-input) {
    width: 100%;
    margin-top: 10px;
  }

  :deep(.vs-alert) {
    margin-top: 10px;
  }
}
</style>
