<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

const active = shallowRef(1)
const { lang } = useLocale()

const items = computed(() =>
  lang.value.startsWith('zh')
    ? [
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
          description: '设置你的使用偏好',
          icon: 'cb:settings',
        },
      ]
    : [
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
          description: 'Set your preferences',
          icon: 'cb:settings',
        },
      ],
)
</script>

<template>
  <s-steps
    v-model:active="active"
    class="steps-tiles-demo"
    :items="items"
    simple
  >
    <template #item="{ item, status, statusLabel, icon, active: isActive }">
      <span
        :class="[
          'steps-tiles-demo__tile',
          `is-${status}`,
          { 'is-active': isActive },
        ]"
      >
        <span class="steps-tiles-demo__icon">
          <s-icon v-if="icon" :name="icon" />
        </span>
        <span class="steps-tiles-demo__copy">
          <strong>{{ item.title }}</strong>
          <small>{{ statusLabel }}</small>
          <span>{{ item.description }}</span>
        </span>
      </span>
    </template>
  </s-steps>
</template>

<style scoped>
.steps-tiles-demo__tile {
  display: grid;
  width: 100%;
  min-height: 132px;
  grid-template-columns: 40px minmax(0, 1fr);
  align-content: center;
  align-items: start;
  gap: 12px;
  padding: 18px;
  border-radius: var(--sax-radius-lg);
  background: hsl(var(--sax-background));
  box-shadow:
    0 15px 34px -28px hsl(var(--sax-primary) / 45%),
    0 5px 16px -13px hsl(var(--sax-text) / 20%);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.steps-tiles-demo__tile.is-active {
  background: hsl(var(--sax-primary) / 8%);
  box-shadow:
    0 20px 42px -28px hsl(var(--sax-primary) / 65%),
    0 7px 20px -15px hsl(var(--sax-primary) / 30%);
}

.steps-tiles-demo__tile:hover {
  background: hsl(var(--sax-primary) / 6%);
  box-shadow:
    0 22px 44px -29px hsl(var(--sax-primary) / 62%),
    0 8px 22px -16px hsl(var(--sax-text) / 24%);
}

.steps-tiles-demo__icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: var(--sax-radius);
  background: hsl(var(--sax-primary) / 10%);
  color: hsl(var(--sax-primary));
  font-size: 20px;
}

.steps-tiles-demo__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.steps-tiles-demo__copy strong {
  color: hsl(var(--sax-text));
  font-size: 14px;
}

.steps-tiles-demo__copy small {
  color: hsl(var(--sax-primary));
  font-weight: 600;
}

.steps-tiles-demo__copy span {
  color: hsl(var(--sax-text) / 62%);
  font-size: 12px;
  line-height: 1.45;
}

@media (prefers-reduced-motion: reduce) {
  .steps-tiles-demo__tile {
    transition: none;
  }
}
</style>
