<template>
  <ol
    :class="[ns.b(), ns.m(direction), ns.is('simple', simple)]"
    :aria-orientation="direction"
  >
    <li
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      :class="[
        ns.e('item'),
        ns.is('active', index === active),
        ns.is('disabled', item.disabled),
        ns.is('clickable', !item.disabled),
        ns.em('item', resolveStatus(item, index)),
      ]"
      @click="handleClick(index, item)"
    >
      <div :class="ns.e('head')">
        <span :class="ns.e('icon')">
          <template v-if="resolveStatus(item, index) === 'finish'">✓</template>
          <template v-else-if="resolveStatus(item, index) === 'error'"
            >!</template
          >
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span v-if="index < items.length - 1" :class="ns.e('line')" />
      </div>
      <div v-if="!simple" :class="ns.e('main')">
        <div :class="ns.e('title')">{{ item.title }}</div>
        <div v-if="item.description" :class="ns.e('description')">
          {{ item.description }}
        </div>
      </div>
      <div v-else :class="ns.e('title')">{{ item.title }}</div>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { stepsEmits, stepsProps } from './steps'
import type { StepItem, StepStatus } from './steps'

defineOptions({ name: 'SSteps' })

const props = defineProps(stepsProps)
const emit = defineEmits(stepsEmits)
const ns = useNamespace('steps')

const resolveStatus = (item: StepItem, index: number): StepStatus => {
  if (item.status) return item.status
  if (index < props.active) return props.finishStatus as StepStatus
  if (index === props.active) return props.processStatus as StepStatus
  return 'wait'
}

const handleClick = (index: number, item: StepItem) => {
  if (!item.disabled) emit('click', index, item)
}
</script>
