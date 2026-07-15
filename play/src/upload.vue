<template>
  <div class="play-container demo">
    <s-upload
      text="Select files"
      :limit="3"
      :show-upload-button="false"
      @change="onChange"
    />
    <p v-if="count" class="hint">Selected {{ count }} file(s)</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const onChange = (files: File[]) => {
  count.value = files.length
}
</script>

<style lang="scss" scoped>
.hint {
  margin: 0;
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.9rem;
}
</style>
