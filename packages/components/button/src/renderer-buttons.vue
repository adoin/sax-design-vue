<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import Button from './button.vue'
import type {
  RendererButtonAction,
  RendererButtonsOptions,
} from './renderer-buttons'

defineOptions({ name: 'SRendererButtons' })

const props = defineProps<{
  options: RendererButtonsOptions
  context: unknown
  disabled?: boolean
}>()
const emit = defineEmits<{
  action: [action: RendererButtonAction, event: MouseEvent]
}>()

const open = shallowRef(false)
const resolveState = (
  state: RendererButtonAction['visible'],
  fallback: boolean,
) => (typeof state === 'function' ? state(props.context) : (state ?? fallback))
const actions = computed(() =>
  props.options.actions.filter((action) => resolveState(action.visible, true)),
)
const inlineCount = computed(() =>
  Math.max(0, props.options.maxVisible ?? actions.value.length),
)
const inlineActions = computed(() => actions.value.slice(0, inlineCount.value))
const overflowActions = computed(() => actions.value.slice(inlineCount.value))
const disabledFor = (action: RendererButtonAction) =>
  props.disabled ||
  action.props?.disabled ||
  resolveState(action.disabled, false)
const loadingFor = (action: RendererButtonAction) =>
  action.props?.loading || resolveState(action.loading, false)
const run = (action: RendererButtonAction, event: MouseEvent) => {
  if (disabledFor(action) || loadingFor(action)) return
  action.onClick?.(props.context, event)
  emit('action', action, event)
  open.value = false
}
</script>

<template>
  <div class="s-renderer-buttons">
    <Button
      v-for="action in inlineActions"
      :key="action.code"
      v-bind="action.props"
      :disabled="disabledFor(action)"
      :loading="loadingFor(action)"
      @click="run(action, $event)"
    >
      <SIcon v-if="action.icon" :name="action.icon" aria-hidden="true" />
      <span v-if="action.text">{{ action.text }}</span>
    </Button>

    <SPopper
      v-if="overflowActions.length"
      v-model:visible="open"
      :trigger="options.trigger ?? 'click'"
      :placement="options.placement ?? 'bottom-end'"
      :show-arrow="false"
      :offset="6"
      :shift="{ padding: 8, crossAxis: true }"
      popper-class="s-renderer-buttons__popper"
    >
      <Button
        type="transparent"
        size="mini"
        icon
        :aria-label="options.moreText ?? 'More actions'"
        :aria-expanded="open"
      >
        <SIcon
          :name="options.moreIcon ?? 'cb:overflow-menu-horizontal'"
          aria-hidden="true"
        />
      </Button>
      <template #content>
        <div class="s-renderer-buttons__menu" role="menu">
          <Button
            v-for="action in overflowActions"
            :key="action.code"
            v-bind="action.props"
            type="transparent"
            size="mini"
            block
            role="menuitem"
            :disabled="disabledFor(action)"
            :loading="loadingFor(action)"
            @click="run(action, $event)"
          >
            <SIcon v-if="action.icon" :name="action.icon" aria-hidden="true" />
            <span>{{ action.text ?? action.code }}</span>
          </Button>
        </div>
      </template>
    </SPopper>
  </div>
</template>
