<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SSlider } from '@vuesax-alpha/components/slider'
import { SProgress } from '@vuesax-alpha/components/progress'
import { useLocale } from '@vuesax-alpha/hooks'
import type { ChatInputModel } from './chat-input'
const props = defineProps<{
  model?: string
  models: ChatInputModel[]
  fast: boolean
  reasoning?: string
  disabled: boolean
}>()
const emit = defineEmits<{
  'update:model': [value: string]
  'update:fast': [value: boolean]
  'update:reasoning': [value: string]
}>()
const { t } = useLocale()
const open = shallowRef(false)
const modelListOpen = shallowRef(false)
watch(open, (visible) => {
  if (!visible) modelListOpen.value = false
})
const selected = computed(() =>
  props.models.find((item) => item.value === props.model),
)
const efforts = computed(() => selected.value?.reasoningEfforts ?? [])
const currentReasoning = computed(
  () =>
    efforts.value.find((item) => item.value === props.reasoning)?.value ??
    efforts.value.find(
      (item) => item.value === selected.value?.defaultReasoning,
    )?.value ??
    efforts.value[0]?.value ??
    '',
)
const reasoningLabel = computed(
  () =>
    efforts.value.find((item) => item.value === currentReasoning.value)?.label,
)
const reasoningIndex = computed(() =>
  Math.max(
    0,
    efforts.value.findIndex((item) => item.value === currentReasoning.value),
  ),
)
const reasoningPercent = computed(() =>
  efforts.value.length <= 1
    ? 100
    : (reasoningIndex.value / (efforts.value.length - 1)) * 100,
)
const changeReasoning = (index: number) => {
  const effort = efforts.value[Math.round(index)]
  if (effort && !props.disabled) emit('update:reasoning', effort.value)
}
const updateCapabilities = (model: ChatInputModel) => {
  if (!model.supportsFast && props.fast) emit('update:fast', false)
  const levels = model.reasoningEfforts ?? []
  if (!levels.some((item) => item.value === props.reasoning))
    emit(
      'update:reasoning',
      levels.find((item) => item.value === model.defaultReasoning)?.value ??
        levels[0]?.value ??
        '',
    )
}
watch(
  selected,
  (model) => {
    if (model) updateCapabilities(model)
  },
  { immediate: true },
)
const choose = (model: ChatInputModel) => {
  if (props.disabled || model.disabled) return
  modelListOpen.value = false
  emit('update:model', model.value)
  updateCapabilities(model)
}
const toggleFast = () => {
  if (!props.disabled && selected.value?.supportsFast)
    emit('update:fast', !props.fast)
}
const resetSettings = () => {
  if (props.disabled) return
  emit('update:fast', false)
  const model = selected.value
  const level =
    efforts.value.find((item) => item.value === model?.defaultReasoning) ??
    efforts.value[0]
  emit('update:reasoning', level?.value ?? '')
}
</script>
<template>
  <div class="s-chat-input__model-config">
    <SPopper
      :visible="open"
      trigger="click"
      placement="bottom-end"
      :disabled="disabled"
      :show-arrow="false"
      popper-class="s-chat-input__models-panel"
      @update:visible="open = $event"
    >
      <button
        class="s-agent-control s-chat-input__model-trigger"
        type="button"
        :disabled="disabled"
        :aria-expanded="open"
        aria-haspopup="dialog"
        :aria-label="t('vs.agent.chooseModel')"
      >
        <span class="s-chat-input__model-name">{{
          selected?.label || t('vs.agent.chooseModel')
        }}</span
        ><span v-if="reasoningLabel" class="s-chat-input__reasoning-summary">{{
          reasoningLabel
        }}</span
        ><SIcon name="cb:chevron-down" :size="12" />
      </button>
      <template #content>
        <div role="dialog" :aria-label="t('vs.agent.modelSettings')">
          <div class="s-chat-input__settings-header">
            <button
              v-if="selected?.supportsFast"
              type="button"
              class="s-agent-control s-chat-input__fast-toggle"
              :disabled="disabled"
              :aria-label="t('vs.agent.fastMode')"
              :aria-pressed="fast"
              @click="toggleFast"
            >
              <SIcon :name="fast ? 'cb:flash-filled' : 'cb:flash'" :size="18" />
            </button>
            <span v-else />
            <span
              class="s-chat-input__active-effort"
              :aria-label="t('vs.agent.reasoningEffort')"
              >{{ reasoningLabel }}</span
            >
            <button
              type="button"
              class="s-agent-control s-chat-input__settings-reset"
              :disabled="disabled"
              :aria-label="t('vs.agent.resetModelSettings')"
              :title="t('vs.agent.resetModelSettings')"
              @click="resetSettings"
            >
              <SIcon name="cb:reset" :size="16" />
            </button>
          </div>
          <button
            type="button"
            class="s-agent-control s-chat-input__current-model"
            :disabled="disabled"
            :aria-expanded="modelListOpen"
            :aria-label="t('vs.agent.chooseModel')"
            @click="modelListOpen = !modelListOpen"
          >
            {{ selected?.label || t('vs.agent.chooseModel')
            }}<SIcon
              :name="modelListOpen ? 'cb:chevron-down' : 'cb:chevron-right'"
              :size="12"
            />
          </button>
          <div v-if="modelListOpen" class="s-chat-input__model-list">
            <button
              v-for="option in models"
              :key="option.value"
              type="button"
              class="s-agent-control s-chat-input__model-choice"
              :disabled="disabled || option.disabled"
              :aria-pressed="option.value === model"
              @click="choose(option)"
            >
              <img v-if="option.icon" :src="option.icon" alt="" /><span>{{
                option.label
              }}</span
              ><SIcon
                v-if="option.value === model"
                name="cb:checkmark"
                :size="16"
              />
            </button>
          </div>
          <fieldset
            v-if="efforts.length"
            class="s-chat-input__thinking"
            :aria-label="t('vs.agent.reasoningEffort')"
          >
            <div class="s-chat-input__effort-slider">
              <div class="s-chat-input__effort-progress" aria-hidden="true">
                <SProgress
                  :percent="reasoningPercent"
                  :height="24"
                  texture="bubbles"
                  :texture-opacity="0.85"
                />
              </div>
              <SSlider
                :model-value="reasoningIndex"
                :min="0"
                :max="Math.max(1, efforts.length - 1)"
                :step="1"
                :disabled="disabled || efforts.length === 1"
                shape="rounded"
                :aria-label="t('vs.agent.reasoningEffort')"
                :aria-valuetext="reasoningLabel"
                @update:model-value="changeReasoning"
              />
            </div>
          </fieldset>
        </div>
      </template>
    </SPopper>
    <button
      v-if="selected?.supportsFast"
      type="button"
      class="s-agent-control s-chat-input__fast-toggle"
      :disabled="disabled"
      :aria-label="t('vs.agent.fastMode')"
      :aria-pressed="fast"
      :title="t('vs.agent.fastMode')"
      @click="toggleFast"
    >
      <SIcon :name="fast ? 'cb:flash-filled' : 'cb:flash'" :size="18" />
    </button>
  </div>
</template>
