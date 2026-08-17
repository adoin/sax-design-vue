<template>
  <div class="loading-demo">
    <section
      v-for="loadingType in loadingTypes"
      :key="loadingType"
      class="loading-demo__preset"
    >
      <div class="loading-demo__heading">
        <strong>{{ labels.types[loadingType] }}</strong>
        <code>loading-type="{{ loadingType }}"</code>
      </div>

      <div class="loading-demo__buttons">
        <s-button
          :loading="loading"
          :loading-type="loadingType"
          color="primary"
        >
          <s-icon  name="bxs:save" />
          {{ labels.save }}
        </s-button>

        <s-button
          :loading="loading"
          :loading-type="loadingType"
          icon
          color="success"
          type="flat"
          :aria-label="labels.call"
        >
          <s-icon  name="bxs:phone-call" />
        </s-button>

        <s-button
          :loading="loading"
          :loading-type="loadingType"
          color="danger"
          type="border"
        >
          <s-icon  name="bxs:heart" />
          {{ labels.like }}
        </s-button>
      </div>
    </section>
  </div>

  <div class="loading-demo__control">
    <s-button type="flat" @click="loading = !loading">
      {{ loading ? labels.showContent : labels.showLoading }}
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const loadingTypes = ['pulse', 'ripple', 'shimmer'] as const

const labels = computed(() => {
  const isZh = route.path.startsWith('/zh/')

  return isZh
    ? {
        save: '保存更改',
        call: '拨打电话',
        like: '喜欢',
        showContent: '查看原内容',
        showLoading: '查看加载态',
        types: {
          pulse: '呼吸光轨',
          ripple: '双层脉冲波',
          shimmer: '流光扫描',
        },
      }
    : {
        save: 'Save changes',
        call: 'Call',
        like: 'Like',
        showContent: 'Show content',
        showLoading: 'Show loading',
        types: {
          pulse: 'Pulse rail',
          ripple: 'Double pulse wave',
          shimmer: 'Surface shimmer',
        },
      }
})
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
