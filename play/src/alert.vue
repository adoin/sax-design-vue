<template>
  <div class="play-container demo">
    <s-button type="flat" @click="active = !active">
      {{ active ? 'Close alert' : 'Open alert' }}
    </s-button>

    <s-alert closable v-model="active">
      <template #title>Sax Design Vue</template>
      Interactive alert with a <b>title</b>, body content, and a closable button.
    </s-alert>

    <s-alert color="success" type="border">
      <template #title>Success</template>
      Border style alert — click the title on a hidden-content alert to toggle body.
    </s-alert>

    <s-alert hidden-content>
      <template #title>Collapsible content</template>
      Click the title to show or hide this message.
    </s-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(true)
</script>

<style lang="scss" scoped>
.demo {
  gap: 16px;
}
</style>
