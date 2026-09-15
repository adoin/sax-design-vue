<script setup lang="ts">
import { shallowRef } from 'vue'
import type { LogoLoadingPhase } from 'sax-design-vue'

const active = shallowRef(true)
const phase = shallowRef<LogoLoadingPhase>('idle')
</script>

<template>
  <div class="logo-loading-demo">
    <s-logo-loading
      :active="active"
      size="96px"
      label="Loading content"
      @phase-change="phase = $event"
    />
    <code>{{ phase }}</code>
    <s-button type="flat" @click="active = !active">
      {{ active ? 'Stop and restore' : 'Start loading' }}
    </s-button>
  </div>
</template>

<style scoped>
.logo-loading-demo {
  display: grid;
  place-items: center;
  gap: 14px;
  padding: 20px;
}
</style>
