<script setup lang="ts">
import { shallowRef } from 'vue'

const announcementsEnabled = shallowRef(false)
const emailUpdatesEnabled = shallowRef(false)
const premiumWorkspace = shallowRef(false)
</script>

<template>
  <div class="switch-text-examples">
    <s-switch v-model="announcementsEnabled">
      Receive product announcements
    </s-switch>

    <s-switch v-model="emailUpdatesEnabled">
      <template #off>Email updates disabled</template>
      <template #on>Email updates enabled</template>
    </s-switch>

    <s-switch
      v-model="premiumWorkspace"
      variant="text"
      inactive-text="Standard workspace"
      active-text="Premium workspace enabled"
    />
  </div>
</template>

<style lang="scss" scoped>
.switch-text-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px 18px;
}
</style>
