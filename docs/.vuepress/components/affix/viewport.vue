<template>
  <div class="affix-viewport-demo">
    <p>Scroll the documentation page. This action pins below the page header.</p>
    <s-affix :offset-top="88" @change="handleChange">
      <s-button type="gradient">
        {{ affixed ? 'Pinned to page' : 'Scroll page to pin' }}
      </s-button>
    </s-affix>
    <p>The default target is the browser window. No container target is required.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const affixed = ref(false)
const handleChange = (value: boolean) => (affixed.value = value)
</script>

<style scoped>
.affix-viewport-demo {
  padding: 8px 0;
}
</style>
