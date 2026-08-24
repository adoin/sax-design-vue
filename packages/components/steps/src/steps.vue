<script lang="ts" setup>
import { computed, useId, useTemplateRef } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { stepsEmits, stepsProps } from './steps'

import type {
  StepItem,
  StepSlotProps,
  StepStatus,
  StepsDirection,
} from './steps'

defineOptions({ name: 'SSteps' })

const props = defineProps(stepsProps)
const emit = defineEmits(stepsEmits)
const slots = defineSlots<{
  item?(props: StepSlotProps): unknown
  icon?(props: StepSlotProps): unknown
  title?(props: StepSlotProps): unknown
  description?(props: StepSlotProps): unknown
  meta?(props: StepSlotProps): unknown
  content?(props: StepSlotProps): unknown
  actions?(props: StepSlotProps): unknown
}>()

const ns = useNamespace('steps')
const { t } = useLocale()
const stepsId = useId()
const triggerRefs = useTemplateRef<HTMLElement[]>('triggers')

const resolvedDirection = computed<StepsDirection>(() =>
  props.direction
    ? (props.direction as StepsDirection)
    : props.variant === 'timeline'
      ? 'vertical'
      : 'horizontal',
)

const defaultStatusIcons: Partial<Record<StepStatus, string>> = {
  finish: 'cb:checkmark',
  success: 'cb:checkmark',
  error: 'cb:warning-alt',
  loading: 'cb:renew',
  disabled: 'cb:locked',
}

const resolveStatus = (item: StepItem, index: number): StepStatus => {
  if (item.status) return item.status
  if (item.disabled) return 'disabled'
  if (index < props.active) return props.finishStatus as StepStatus
  if (index === props.active) return props.processStatus as StepStatus
  return 'wait'
}

const resolveStatusLabel = (item: StepItem, status: StepStatus) =>
  item.statusLabel ||
  props.statusLabels[status] ||
  t(`vs.steps.status.${status}`)

const resolveIcon = (item: StepItem, status: StepStatus) =>
  defaultStatusIcons[status] || item.icon

const isDisabled = (item: StepItem, index: number) =>
  item.disabled || resolveStatus(item, index) === 'disabled'

const isPotentiallyClickable = (item: StepItem) =>
  props.clickable && item.clickable !== false

const isInteractive = (item: StepItem, index: number) =>
  isPotentiallyClickable(item) && !isDisabled(item, index)

const isFinished = (status: StepStatus) =>
  status === 'finish' || status === 'success'

const createSlotProps = (item: StepItem, index: number): StepSlotProps => {
  const status = resolveStatus(item, index)
  return {
    item,
    index,
    status,
    statusLabel: resolveStatusLabel(item, status),
    icon: resolveIcon(item, status),
    active: index === props.active,
    disabled: isDisabled(item, index),
    interactive: isInteractive(item, index),
  }
}

const tabStopIndex = computed(() => {
  if (
    props.items[props.active] &&
    isInteractive(props.items[props.active], props.active)
  ) {
    return props.active
  }
  return props.items.findIndex((item, index) => isInteractive(item, index))
})

const focusStep = (currentIndex: number, offset: number) => {
  if (!props.items.length) return
  let nextIndex = currentIndex
  for (let attempt = 0; attempt < props.items.length; attempt += 1) {
    nextIndex = (nextIndex + offset + props.items.length) % props.items.length
    if (isInteractive(props.items[nextIndex], nextIndex)) {
      triggerRefs.value?.[nextIndex]?.focus()
      return
    }
  }
}

const focusBoundary = (fromEnd = false) => {
  const indices = props.items.map((_, index) => index)
  const orderedIndices = fromEnd ? indices.reverse() : indices
  const target = orderedIndices.find((index) =>
    isInteractive(props.items[index], index),
  )
  if (target !== undefined) triggerRefs.value?.[target]?.focus()
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const horizontal = resolvedDirection.value === 'horizontal'
  if (
    (horizontal && event.key === 'ArrowRight') ||
    (!horizontal && event.key === 'ArrowDown')
  ) {
    event.preventDefault()
    focusStep(index, 1)
  } else if (
    (horizontal && event.key === 'ArrowLeft') ||
    (!horizontal && event.key === 'ArrowUp')
  ) {
    event.preventDefault()
    focusStep(index, -1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusBoundary()
  } else if (event.key === 'End') {
    event.preventDefault()
    focusBoundary(true)
  }
}

const handleActivate = (index: number, item: StepItem) => {
  if (!isInteractive(item, index)) return
  emit('click', index, item)
  if (index === props.active) return
  emit('update:active', index)
  emit('change', index, item)
}

const statusRole = (status: StepStatus) => {
  if (status === 'error') return 'alert'
  if (status === 'loading') return 'status'
  return undefined
}

const contextId = (index: number) => `${stepsId}-context-${index}`
</script>

<template>
  <ol
    :class="[
      ns.b(),
      ns.m(resolvedDirection),
      ns.m(variant),
      ns.m(size),
      ns.is('simple', simple),
      ns.is('responsive', responsive),
      ns.is('custom-item', !!slots.item),
    ]"
    :aria-label="ariaLabel || t('vs.steps.label')"
    :aria-orientation="resolvedDirection"
  >
    <li
      v-for="(item, index) in items"
      :key="item.key ?? `${item.title}-${index}`"
      :class="[
        ns.e('item'),
        ns.is('active', index === active),
        ns.is('disabled', isDisabled(item, index)),
        ns.is('clickable', isInteractive(item, index)),
        ns.em('item', resolveStatus(item, index)),
      ]"
    >
      <span
        v-if="showProgress && index < items.length - 1 && !simple"
        :class="[
          ns.e('line'),
          ns.is('complete', isFinished(resolveStatus(item, index))),
        ]"
        aria-hidden="true"
      />

      <div :class="ns.e('frame')">
        <component
          :is="isPotentiallyClickable(item) ? 'button' : 'div'"
          ref="triggers"
          :class="ns.e('trigger')"
          :type="isPotentiallyClickable(item) ? 'button' : undefined"
          :disabled="isPotentiallyClickable(item) && isDisabled(item, index)"
          :tabindex="
            isInteractive(item, index)
              ? index === tabStopIndex
                ? 0
                : -1
              : undefined
          "
          :aria-current="index === active ? 'step' : undefined"
          :aria-disabled="isDisabled(item, index) || undefined"
          :aria-controls="
            variant === 'timeline' &&
            index === active &&
            (slots.content || slots.actions)
              ? contextId(index)
              : undefined
          "
          :aria-label="`${item.title}, ${resolveStatusLabel(item, resolveStatus(item, index)) || resolveStatus(item, index)}, ${index + 1}/${items.length}`"
          @click="handleActivate(index, item)"
          @keydown="handleKeydown($event, index)"
        >
          <slot name="item" v-bind="createSlotProps(item, index)">
            <span :class="ns.e('marker-track')" aria-hidden="true">
              <span :class="ns.e('marker')">
                <slot name="icon" v-bind="createSlotProps(item, index)">
                  <SIcon
                    v-if="resolveIcon(item, resolveStatus(item, index))"
                    :name="resolveIcon(item, resolveStatus(item, index))"
                    :rolling="
                      resolveStatus(item, index) === 'loading' ? 1.1 : false
                    "
                  />
                  <span v-else :class="ns.e('number')">{{ index + 1 }}</span>
                </slot>
              </span>
            </span>

            <span :class="ns.e('main')">
              <span :class="ns.e('title')">
                <slot name="title" v-bind="createSlotProps(item, index)">
                  {{ item.title }}
                </slot>
              </span>
              <span
                v-if="
                  resolveStatusLabel(item, resolveStatus(item, index)) ||
                  (showStepIndex && index === active)
                "
                :class="ns.e('status')"
                :role="statusRole(resolveStatus(item, index))"
              >
                <span
                  v-if="resolveStatusLabel(item, resolveStatus(item, index))"
                >
                  {{ resolveStatusLabel(item, resolveStatus(item, index)) }}
                </span>
                <span
                  v-if="showStepIndex && index === active"
                  :class="ns.e('step-index')"
                >
                  <span
                    v-if="resolveStatusLabel(item, resolveStatus(item, index))"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                  {{ index + 1 }} / {{ items.length }}
                </span>
              </span>
              <span v-if="item.description" :class="ns.e('description')">
                <slot name="description" v-bind="createSlotProps(item, index)">
                  {{ item.description }}
                </slot>
              </span>
              <span v-if="item.meta" :class="ns.e('meta')">
                <slot name="meta" v-bind="createSlotProps(item, index)">
                  {{ item.meta }}
                </slot>
              </span>
            </span>
          </slot>
        </component>

        <div
          v-if="
            variant === 'timeline' &&
            index === active &&
            (slots.content || slots.actions)
          "
          :id="contextId(index)"
          :class="ns.e('context')"
        >
          <div v-if="slots.content" :class="ns.e('context-content')">
            <slot name="content" v-bind="createSlotProps(item, index)" />
          </div>
          <div v-if="slots.actions" :class="ns.e('actions')">
            <slot name="actions" v-bind="createSlotProps(item, index)" />
          </div>
        </div>
      </div>
    </li>
  </ol>
</template>
