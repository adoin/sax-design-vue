<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

const active = shallowRef('overview')
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        labels: [
          '概览',
          '分析',
          '订单',
          '客户',
          '自动化',
          '集成',
          '账单',
          '成员',
        ],
        panel: '当前标签',
      }
    : {
        labels: [
          'Overview',
          'Analytics',
          'Orders',
          'Customers',
          'Automation',
          'Integrations',
          'Billing',
          'Members',
        ],
        panel: 'Current tab',
      },
)

const tabNames = [
  'overview',
  'analytics',
  'orders',
  'customers',
  'automation',
  'integrations',
  'billing',
  'members',
]
</script>

<template>
  <div class="tabs-overflow-demo">
    <s-tabs v-model="active" type="pill" overflow="collapse">
      <s-tab
        v-for="(name, index) in tabNames"
        :key="name"
        :name="name"
        :label="copy.labels[index]"
        :badge="index === 2 ? 12 : undefined"
      >
        <div class="tabs-overflow-demo__panel">
          <strong>{{ copy.panel }}</strong>
          <span>{{ copy.labels[index] }}</span>
        </div>
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.tabs-overflow-demo {
  width: min(100%, 590px);
}

.tabs-overflow-demo__panel {
  display: flex;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 16px;
  background: hsl(var(--sax-background) / 0.7);
  box-shadow: 0 18px 38px -28px hsl(var(--sax-primary) / 0.45);
}

.tabs-overflow-demo__panel span {
  color: hsl(var(--sax-primary));
}
</style>
