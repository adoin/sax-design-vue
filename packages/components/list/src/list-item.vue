<template>
  <div :class="ns.e('item')">
    <div v-if="$slots.avatar" :class="ns.e('avatar')">
      <slot name="avatar" />
    </div>
    <div v-if="icon" :class="ns.e('icon')">
      <SIcon :icon="icon" :icon-pack="iconPack" />
    </div>
    <div :class="ns.e('titles')">
      <div v-if="title" :class="ns.e('title')">{{ title }}</div>
      <slot v-else name="title" />
      <div v-if="subtitle" :class="ns.e('subtitle')">{{ subtitle }}</div>
      <slot v-else name="subtitle" />
    </div>
    <div :class="ns.e('slot')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { listItemProps } from './list-item'

defineOptions({
  name: 'SListItem',
})

defineProps(listItemProps)

const ns = useNamespace('list')
</script>
