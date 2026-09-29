<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))

const method = shallowRef('GET')
const protocol = shallowRef('https://')
const address = shallowRef('api.sax-design.dev')
const region = shallowRef('CN')
const deployment = shallowRef<Array<string | number>>(['production', 'east'])
const date = shallowRef('2026-08-18')
const time = shallowRef('09:30')
const details = shallowRef('')

const deploymentOptions = [
  {
    value: 'production',
    label: '生产环境',
    children: [
      { value: 'east', label: '东部集群' },
      { value: 'west', label: '西部集群' },
    ],
  },
  {
    value: 'staging',
    label: '预发布环境',
    children: [
      { value: 'blue', label: '蓝色集群' },
      { value: 'green', label: '绿色集群' },
    ],
  },
]
const selectOptions1 = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
]
const selectOptions2 = [
  { label: 'HTTPS', value: 'https://' },
  { label: 'HTTP', value: 'http://' },
]
const selectOptions3 = [
  { label: '中国', value: 'CN' },
  { label: '全球', value: 'GLOBAL' },
]
</script>

<template>
  <div class="control-group-spans-demo">
    <span id="request-address-label" class="control-group-spans-demo__label">
      请求地址
    </span>
    <s-control-group block aria-labelledby="request-address-label">
      <s-select v-model="method" :span="4" :options="selectOptions1" />
      <s-select v-model="protocol" :span="4" :options="selectOptions2" />
      <s-input v-model="address" placeholder="域名或 IP" />
      <s-cascader
        v-model="deployment"
        :options="deploymentOptions"
        :span="7"
        placeholder="部署环境"
      />
      <s-select v-model="region" :span="4" :options="selectOptions3" />
    </s-control-group>
    <s-control-group block :aria-label="isZh ? '日期与时间' : 'Date and time'">
      <s-date-picker
        v-model="date"
        :span="8"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :placeholder="isZh ? '选择日期' : 'Select date'"
      />
      <s-time-picker
        v-model="time"
        :span="6"
        format="HH:mm"
        value-format="HH:mm"
        :placeholder="isZh ? '选择时间' : 'Select time'"
      />
      <s-input
        v-model="details"
        :placeholder="isZh ? '补充内容' : 'Additional details'"
      />
    </s-control-group>
  </div>
</template>

<style scoped>
.control-group-spans-demo {
  display: flex;
  width: min(100%, 760px);
  flex-direction: column;
  gap: 8px;
}

.control-group-spans-demo__label {
  color: var(--sax-text-color);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
