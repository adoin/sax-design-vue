<template>
  <div :class="[ns.e('header'), ns.m(color)]">
    <VsIcon
      v-if="icon"
      :icon="icon"
      :icon-pack="iconPack"
      :class="ns.e('header-icon')"
    />
    <div :class="ns.e('header-titles')">
      <div v-if="title" :class="ns.e('header-title')">{{ title }}</div>
      <slot v-else name="title" />
      <div v-if="subtitle" :class="ns.e('header-subtitle')">{{ subtitle }}</div>
      <slot v-else name="subtitle" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { listHeaderProps } from './list-header'

defineOptions({
  name: 'VsListHeader',
})

defineProps(listHeaderProps)

const ns = useNamespace('list')
</script>
