<template>
  <div class="center con-switch">
    <ul>
      <li>
        <p>Email messages</p>
        <s-switch v-model="active1" />
      </li>
      <li>
        <p>Change theme</p>
        <s-switch v-model="active2">
          <template #circle>
            <s-icon v-if="!active2"  name="bxs:moon" />
            <s-icon v-else  name="bxs:sun" />
          </template>
        </s-switch>
      </li>
      <li>
        <p>Desktop notifications</p>
        <s-switch v-model="active3">
          <s-icon  name="bxs:message" />
        </s-switch>
      </li>
      <li>
        <p>Type of user</p>
        <s-switch v-model="active4">
          <template #on> Admin </template>
          <template #off> Default </template>
        </s-switch>
      </li>
      <li>
        <p>Allow to send test data to improve this product</p>
        <s-switch v-model="active5" color="success">
          <template #off>
            <s-icon  name="bx:x" />
          </template>
          <template #on>
            <s-icon  name="bx:check" />
          </template>
        </s-switch>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active1 = ref(true)
const active2 = ref(false)
const active3 = ref(false)
const active4 = ref(true)
const active5 = ref(true)
</script>

<style lang="scss" scoped>
.con-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  ul {
    width: 100%;
    padding: 0px;
    li {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px;
      p {
        margin: 0px;
        font-size: 0.85rem;
      }
    }
  }
  .s-switch {
    margin: 5px;
  }
}
</style>
