<script lang="ts" setup>
import { shallowRef } from 'vue'

const active = shallowRef('members')
const trigger = shallowRef<'hover' | 'click'>('hover')
const items = [
  {
    key: 'product',
    label: 'Product',
    icon: 'cb:cube',
    description: 'Build and release',
    children: [
      { key: 'roadmap', label: 'Roadmap', badge: 'New' },
      {
        key: 'delivery',
        label: 'Delivery',
        children: [
          { key: 'releases', label: 'Releases' },
          { key: 'environments', label: 'Environments' },
        ],
      },
    ],
  },
  { key: 'divider', label: '', type: 'divider' as const },
  {
    key: 'people',
    label: 'People',
    type: 'group' as const,
    children: [
      { key: 'members', label: 'Members', icon: 'cb:user-multiple' },
      { key: 'roles', label: 'Roles', icon: 'cb:user-role' },
    ],
  },
]
</script>

<template>
  <div class="menu-popup-demo">
    <label class="menu-popup-demo__trigger">
      <s-switch v-model="trigger" active-value="click" inactive-value="hover">
        <template #off>hover</template>
        <template #on>click</template>
      </s-switch>
    </label>
    <s-menu
      v-model="active"
      :options="items"
      submenu-mode="popup"
      :trigger="trigger"
      variant="floating"
    />
  </div>
</template>

<style scoped>
.menu-popup-demo {
  display: grid;
  justify-items: start;
  gap: 16px;
  min-height: 280px;
}
</style>
