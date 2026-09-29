<template>
  <div :class="ns.e('item')">
    <div v-if="$slots.avatar" :class="ns.e('avatar')">
      <slot name="avatar" />
    </div>
    <div v-if="icon" :class="ns.e('icon')">
      <SIcon :name="icon" />
    </div>
    <div :class="ns.e('titles')">
      <div v-if="title || $slots.title" :class="ns.e('title')">
        <template v-if="title">{{ title }}</template
        ><slot v-else name="title" />
      </div>
      <div v-if="subtitle || $slots.subtitle" :class="ns.e('subtitle')">
        <template v-if="subtitle">{{ subtitle }}</template
        ><slot v-else name="subtitle" />
      </div>
    </div>
    <div v-if="$slots.default" :class="ns.e('slot')">
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
