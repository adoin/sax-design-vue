<script lang="ts" setup>
import { shallowRef } from 'vue'

const basicValue = shallowRef('design')
const planValue = shallowRef('team')
const periodValue = shallowRef('monthly')
const tabValues = shallowRef({
  workspace: 'team',
  notifications: 'mentions',
})

const plans = [
  {
    label: 'Starter / 入门',
    value: 'starter',
    description: 'Personal projects / 个人项目',
  },
  {
    label: 'Team / 团队',
    value: 'team',
    description: 'Shared workspace / 协作空间',
  },
  {
    label: 'Enterprise / 企业',
    value: 'enterprise',
    description: 'Contact sales / 联系销售',
  },
]

const periods = [
  { label: 'Monthly / 月付', value: 'monthly' },
  { label: 'Yearly / 年付', value: 'yearly' },
  { label: 'Lifetime / 买断', value: 'lifetime' },
]

const radioTabs = [
  {
    label: 'Workspace / 工作区',
    value: 'workspace',
    options: plans,
    columns: 3,
  },
  {
    label: 'Notifications / 通知',
    value: 'notifications',
    options: [
      { label: 'All / 全部', value: 'all' },
      { label: 'Mentions / 提及', value: 'mentions' },
      { label: 'None / 关闭', value: 'none' },
    ],
    columns: 3,
  },
]
</script>

<template>
  <div class="radio-patterns-demo">
    <section class="radio-patterns-demo__section">
      <div class="radio-patterns-demo__heading">
        <strong>Radio / 基础单选</strong>
        <span>{{ basicValue }}</span>
      </div>
      <div class="radio-patterns-demo__row">
        <s-radio v-model="basicValue" value="design">Design</s-radio>
        <s-radio v-model="basicValue" value="develop">Develop</s-radio>
        <s-radio v-model="basicValue" value="release">Release</s-radio>
      </div>
    </section>

    <section class="radio-patterns-demo__section">
      <div class="radio-patterns-demo__heading">
        <strong>RadioGroup / 数据分组</strong>
        <span>{{ planValue }}</span>
      </div>
      <s-radio-group v-model="planValue" :options="plans" :columns="3" />
    </section>

    <section class="radio-patterns-demo__section">
      <div class="radio-patterns-demo__heading">
        <strong>RadioGroupTabs / 页签分组</strong>
        <span>{{ Object.values(tabValues).join(' · ') }}</span>
      </div>
      <s-radio-group-tabs v-model="tabValues" :tabs="radioTabs" />
    </section>

    <section class="radio-patterns-demo__section">
      <div class="radio-patterns-demo__heading">
        <strong>RadioButton / 按钮分组</strong>
        <span>{{ periodValue }}</span>
      </div>
      <s-radio-group v-model="periodValue" type="button" :options="periods" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.radio-patterns-demo {
  display: grid;
  gap: 14px;

  &__section {
    min-width: 0;
    padding: 14px;
    border-radius: var(--sax-radius-lg);
    background: hsl(var(--sax-primary) / 0.025);
    box-shadow: inset 0 2px 7px hsl(var(--sax-primary) / 0.06);
  }

  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    color: hsl(var(--sax-text) / 0.78);
    font-size: 0.78rem;

    span {
      padding: 3px 7px;
      border-radius: var(--sax-radius-pill);
      background: hsl(var(--sax-primary) / 0.09);
      color: hsl(var(--sax-primary) / 1);
      font-family: var(--vp-font-family-mono);
      font-size: 0.7rem;
    }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .radio-patterns-demo__heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
