<template>
  <div class="processing-demo">
    <div class="processing-demo__group">
      <span class="processing-demo__label">{{ labels.normal }}</span>
      <div class="processing-demo__badges">
        <s-badge :value="7">
          <s-avatar>
            <img src="/avatars/avatar-5.png" alt="" />
          </s-avatar>
        </s-badge>
        <s-badge is-dot type="success">
          <span class="processing-demo__target">{{ labels.sync }}</span>
        </s-badge>
      </div>
    </div>

    <div class="processing-demo__group is-processing">
      <span class="processing-demo__label">{{ labels.processing }}</span>
      <div class="processing-demo__badges">
        <s-badge :value="7" processing>
          <s-avatar>
            <img src="/avatars/avatar-5.png" alt="" />
          </s-avatar>
        </s-badge>
        <s-badge is-dot processing type="success">
          <span class="processing-demo__target">{{ labels.sync }}</span>
        </s-badge>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const labels = computed(() =>
  route.path.startsWith('/zh/')
    ? { normal: '普通状态', processing: '处理中', sync: '数据同步' }
    : { normal: 'Normal', processing: 'Processing', sync: 'Data sync' },
)
</script>

<style scoped>
.processing-demo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
}

.processing-demo__group {
  display: grid;
  min-width: 180px;
  gap: 16px;
  padding: 18px 20px;
  border-radius: var(--sax-radius-lg);
  background: hsl(var(--sax-theme-color) / 0.035);
}

.processing-demo__group.is-processing {
  background: hsl(var(--sax-primary) / 0.055);
  box-shadow: 0 10px 28px hsl(var(--sax-primary) / 0.1);
}

.processing-demo__label {
  color: hsl(var(--sax-theme-color) / 0.66);
  font-size: 12px;
  font-weight: 700;
}

.processing-demo__badges {
  display: flex;
  align-items: center;
  gap: 34px;
}

.processing-demo__target {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 12px;
  border-radius: var(--sax-radius-md);
  background: hsl(var(--sax-theme-color) / 0.06);
  color: hsl(var(--sax-theme-color) / 0.78);
  font-size: 13px;
}
</style>
