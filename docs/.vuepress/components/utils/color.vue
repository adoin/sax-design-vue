<template>
  <div>
    <div class="warning custom-block">
      <p class="custom-block-title">{{ t.colorNotice.allowedTitle }}</p>
      <p>
        {{ t.colorNotice.allowedIntro }}
        <b>primary</b>, <b>success</b>, <b>danger</b>, <b>warn</b>, <b>dark</b>
        <br />
        {{ t.colorNotice.allowedFormats }}
      </p>
    </div>
    <div class="tip custom-block">
      <p class="custom-block-title">{{ t.colorNotice.booleanTitle }}</p>
      <p>
        {{ t.colorNotice.booleanIntro }}
        <br />
        {{ t.colorNotice.booleanExamplePrefix }} <code>warn</code>
        {{ t.colorNotice.booleanExampleSuffix }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocLocaleUi } from '../../theme/composables/docLocale'

const { t } = useDocLocaleUi()
</script>
