<template>
  <div class="loading-demo">
    <section
      v-for="loadingType in loadingTypes"
      :key="loadingType"
      class="loading-demo__preset"
    >
      <div class="loading-demo__heading">
        <strong>{{ labels[loadingType] }}</strong>
        <code>loading-type="{{ loadingType }}"</code>
      </div>

      <div class="loading-demo__buttons">
        <s-button
          :loading="loading"
          :loading-type="loadingType"
          color="primary"
        >
          <template #prefix><s-icon name="bxs:save" /></template>
          保存更改
          <template #suffix><s-icon name="bx:right-arrow-alt" /></template>
        </s-button>

        <s-button
          :loading="loading"
          :loading-type="loadingType"
          icon
          color="success"
          type="flat"
          aria-label="拨打电话"
        >
          <template #prefix><s-icon name="bxs:phone-call" /></template>
        </s-button>

        <s-button
          :loading="loading"
          :loading-type="loadingType"
          color="danger"
          type="border"
        >
          喜欢
          <template #suffix><s-icon name="bxs:heart" /></template>
        </s-button>
      </div>
    </section>
  </div>

  <div class="loading-demo__control">
    <s-button type="flat" @click="loading = !loading">
      {{ loading ? '查看原内容' : '查看加载态' }}
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const loading = shallowRef(true)
const loadingTypes = ['default', 'pulse', 'ripple', 'shimmer'] as const
const labels = {
  default: '品牌标志',
  pulse: '呼吸光轨',
  ripple: '双层脉冲波',
  shimmer: '流光扫描',
} as const
</script>

<style scoped>
.loading-demo {
  display: grid;
  gap: 22px;
}

.loading-demo__preset {
  display: grid;
  gap: 12px;
}

.loading-demo__heading,
.loading-demo__buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.loading-demo__heading {
  justify-content: space-between;
}

.loading-demo__heading code {
  opacity: 0.68;
}

.loading-demo__buttons {
  min-height: 42px;
}

.loading-demo__control {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
