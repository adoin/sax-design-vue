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
    label: 'Production',
    children: [
      { value: 'east', label: 'East cluster' },
      { value: 'west', label: 'West cluster' },
    ],
  },
  {
    value: 'staging',
    label: 'Staging',
    children: [
      { value: 'blue', label: 'Blue cluster' },
      { value: 'green', label: 'Green cluster' },
    ],
  },
]
</script>

<template>
  <div class="control-group-spans-demo">
    <span id="request-address-label" class="control-group-spans-demo__label">
      Request address
    </span>
    <s-control-group block aria-labelledby="request-address-label">
      <s-select v-model="method" :span="4">
        <s-option label="GET" value="GET">GET</s-option>
        <s-option label="POST" value="POST">POST</s-option>
      </s-select>
      <s-select v-model="protocol" :span="4">
        <s-option label="HTTPS" value="https://">HTTPS</s-option>
        <s-option label="HTTP" value="http://">HTTP</s-option>
      </s-select>
      <s-input v-model="address" placeholder="Domain or IP" />
      <s-cascader
        v-model="deployment"
        :options="deploymentOptions"
        :span="7"
        placeholder="Deployment"
      />
      <s-select v-model="region" :span="4">
        <s-option label="China" value="CN">China</s-option>
        <s-option label="Global" value="GLOBAL">Global</s-option>
      </s-select>
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
