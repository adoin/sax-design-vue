<template>
  <div class="timezone-demo">
    <s-config-provider timezone="Asia/Shanghai" :auto-apply-now="true">
      <div class="timezone-demo__item">
        <s-date-picker
          v-model="shanghaiValue"
          type="datetime"
          value-format="timestamp"
          label="Asia/Shanghai"
          label-float
        />
        <code>{{ shanghaiValue }}</code>
      </div>

      <div class="timezone-demo__item">
        <s-date-picker
          v-model="newYorkValue"
          type="datetime"
          value-format="timestamp"
          timezone="America/New_York"
          label="America/New_York"
          label-float
        />
        <code>{{ newYorkValue }}</code>
      </div>
    </s-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const shanghaiValue = ref(Date.UTC(2026, 7, 5, 6, 0, 22))
const newYorkValue = ref(Date.UTC(2026, 7, 5, 18, 0, 22))
</script>

<style scoped lang="scss">
.timezone-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: min(100%, 720px);

  &__item {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: var(--sax-radius);
    background: hsl(var(--sax-background) / 0.66);
    box-shadow: 0 10px 24px -20px hsl(var(--sax-text) / 0.3);
  }

  code {
    overflow-wrap: anywhere;
    color: hsl(var(--sax-text) / 0.62);
    font-variant-numeric: tabular-nums;
  }
}

@media (max-width: 640px) {
  .timezone-demo {
    grid-template-columns: 1fr;
  }
}
</style>
