<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

const active = shallowRef(1)
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        ariaLabel: '工作区配置流程',
        previous: '上一步',
        next: '下一步',
        items: [
          {
            key: 'account',
            title: '创建账号',
            description: '填写账号信息',
            icon: 'cb:user',
          },
          {
            key: 'profile',
            title: '完善资料',
            description: '补充个人资料',
            icon: 'cb:user-avatar',
          },
          {
            key: 'preferences',
            title: '偏好设置',
            description: '选择工作区默认配置',
            icon: 'cb:settings',
          },
          {
            key: 'ready',
            title: '准备就绪',
            description: '开始使用工作区',
            icon: 'cb:rocket',
          },
        ],
      }
    : {
        ariaLabel: 'Workspace setup',
        previous: 'Previous',
        next: 'Next step',
        items: [
          {
            key: 'account',
            title: 'Account',
            description: 'Create your account',
            icon: 'cb:user',
          },
          {
            key: 'profile',
            title: 'Profile details',
            description: 'Complete your profile information',
            icon: 'cb:user-avatar',
          },
          {
            key: 'preferences',
            title: 'Preferences',
            description: 'Choose workspace defaults',
            icon: 'cb:settings',
          },
          {
            key: 'ready',
            title: 'Ready',
            description: 'Start using the workspace',
            icon: 'cb:rocket',
          },
        ],
      },
)

const items = computed(() => copy.value.items)

const previous = () => {
  active.value = Math.max(0, active.value - 1)
}

const next = () => {
  active.value = Math.min(items.value.length - 1, active.value + 1)
}
</script>

<template>
  <div class="steps-focus-demo">
    <s-steps
      v-model:active="active"
      :aria-label="copy.ariaLabel"
      :items="items"
    />
    <div class="steps-focus-demo__actions">
      <s-button flat :disabled="active === 0" @click="previous">
        {{ copy.previous }}
      </s-button>
      <s-button :disabled="active === items.length - 1" @click="next">
        {{ copy.next }}
      </s-button>
    </div>
  </div>
</template>

<style scoped>
.steps-focus-demo {
  display: grid;
  width: 100%;
  gap: 24px;
}

.steps-focus-demo__actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
