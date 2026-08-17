<template>
  <div class="button-click-limit-demo">
    <div class="button-click-limit-demo__item">
      <s-button :debounce="400" @click="debounceCount += 1">
        {{ isZh ? '防抖点击' : 'Debounced click' }}
      </s-button>
      <span>{{ isZh ? '触发次数' : 'Emitted' }}: {{ debounceCount }}</span>
    </div>

    <div class="button-click-limit-demo__item">
      <s-button
        :debounce="false"
        :throttle="1000"
        type="border"
        @click="throttleCount += 1"
      >
        {{ isZh ? '节流点击' : 'Throttled click' }}
      </s-button>
      <span>{{ isZh ? '触发次数' : 'Emitted' }}: {{ throttleCount }}</span>
    </div>

    <s-button type="flat" @click="reset">
      {{ isZh ? '重置' : 'Reset' }}
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const debounceCount = ref(0)
const throttleCount = ref(0)

const reset = () => {
  debounceCount.value = 0
  throttleCount.value = 0
}
</script>

<style scoped>
.button-click-limit-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}

.button-click-limit-demo__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>
