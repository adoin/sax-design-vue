<template>
  <div class="center">
    <s-card
      type="metric"
      color="success"
      title="¥ 128,430"
      subtitle="较上月增长 18.2%"
    >
      <template #header>
        <span class="metric-label">本月收入</span>
      </template>
      <template #extra>
        <s-icon name="bx:trending-up" aria-hidden="true" />
      </template>

      <div class="metric-chart" aria-hidden="true">
        <i
          v-for="height in bars"
          :key="height"
          :style="{ height: `${height}%` }"
        />
      </div>

      <template #footer>
        <div class="metric-footer">
          <span>年度目标</span>
          <strong>已完成 84%</strong>
        </div>
      </template>
    </s-card>
  </div>
</template>

<script lang="ts" setup>
const bars = [32, 46, 38, 61, 54, 72, 66, 84, 78, 92, 86, 100]
</script>

<style lang="scss" scoped>
.metric-label {
  color: hsl(var(--sax-text) / 0.68);
  font-weight: 600;
}

.metric-chart {
  display: flex;
  align-items: end;
  gap: 6px;
  height: 72px;

  i {
    flex: 1;
    min-width: 4px;
    border-radius: 4px 4px 1px 1px;
    background: hsl(var(--sax-color) / 0.72);
  }
}

.metric-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  color: hsl(var(--sax-text) / 0.62);
  font-size: 0.76rem;

  strong {
    color: hsl(var(--sax-text));
  }
}
</style>
