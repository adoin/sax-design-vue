<template>
  <div>
    <div class="warning custom-container">
      <p class="custom-container-title">{{ t.iconNotice.defaultTitle }}</p>
      <p>
        {{ t.iconNotice.defaultPrefix }}
        {{ t.iconNotice.defaultControls }}
        {{ t.iconNotice.defaultReplacePrefix }} <code>#icon</code>
        {{ t.iconNotice.defaultReplaceSuffix }}
      </p>
    </div>
    <div class="tip custom-container">
      <p class="custom-container-title">{{ t.iconNotice.docsTitle }}</p>
      <p>
        {{ t.iconNotice.docsPrefix }}
        <a target="_blank" href="https://boxicons.com/">Boxicons</a>
        {{ t.iconNotice.docsSuffix }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocLocaleUi } from '../../theme/composables/docLocale'

const { t } = useDocLocaleUi()
</script>
