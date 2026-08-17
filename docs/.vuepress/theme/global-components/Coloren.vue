<template>
  <div>
    <p>
      {{ t.colorNotice.helpIntro }} <code>color</code>
      {{ t.colorNotice.helpMiddle }}
      <router-link :to="withLocalePath('theme/')">{{
        t.colorNotice.helpLink
      }}</router-link>
      {{ t.colorNotice.helpSuffix }}
      <br />
      <br />
    </p>
    <p>{{ t.colorNotice.helpValues }}</p>
    <ul>
      <li><code>primary</code></li>
      <li><code>success</code></li>
      <li><code>danger</code></li>
      <li><code>warning</code></li>
      <li><code>dark</code></li>
      <li><code>RGB</code></li>
      <li><code>HEX</code></li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useDocLocaleUi } from '../composables/docLocale'

const { t, withLocalePath } = useDocLocaleUi()
</script>
<style scoped lang="scss">
a {
  text-decoration: underline;
}
</style>
