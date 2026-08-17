<template>
  <div>
    <div class="tip custom-block">
      <p class="custom-block-title">{{ t.iconNotice.docsTitle }}</p>
      <p>
        {{ t.iconNotice.docsPrefix }}
        <a target="_blank" href="https://icon-sets.iconify.design/">Iconify</a>
        {{ t.iconNotice.docsSuffix }}
        <br />
        {{ t.iconNotice.libraryFreedom }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocLocaleUi } from '../composables/docLocale'

const { t } = useDocLocaleUi()
</script>
