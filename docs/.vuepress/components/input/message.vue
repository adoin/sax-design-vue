<template>
  <div class="center content-inputs">
    <s-input v-model="value1" placeholder="Email">
      <template #message-success> Email Valid </template>
    </s-input>

    <s-input v-model="value2" placeholder="Name">
      <template #message-danger> Required </template>
    </s-input>

    <s-input v-model="value3" type="password" placeholder="Password">
      <template #message-warn> Insecure password </template>
    </s-input>

    <s-input
      v-model="value4"
      label="Example Regex Validation"
      placeholder="vuesax@gmail.com"
    >
      <template v-if="validEmail" #message-success> Email Valid </template>
      <template v-if="!validEmail && value4 !== ''" #message-danger>
        Email Invalid
      </template>
    </s-input>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const value1 = ref('vuesax.alpha@gmail.com')
const value2 = ref('')
const value3 = ref('123456')
const value4 = ref('')
const REGEX_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const validEmail = computed(() => REGEX_EMAIL.test(value4.value))
</script>

<style lang="scss" scoped>
.content-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  .s-input {
    margin: 10px;
  }
}
</style>
