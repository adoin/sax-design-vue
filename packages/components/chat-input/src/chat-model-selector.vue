<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SSlider } from '@vuesax-alpha/components/slider'
import { SProgress } from '@vuesax-alpha/components/progress'
import { useId, useLocale } from '@vuesax-alpha/hooks'
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
const pickerClass = `s-chat-input__model-picker-${useId().value}`
const open = shallowRef(false)
const modelListOpen = shallowRef(false)
watch(open, (visible) => {
  if (!visible) modelListOpen.value = false
})
const selected = computed(() =>
  props.models.find((item) => item.value === props.model),
)
const capabilities = (model?: ChatInputModel) =>
  model?.capabilities ?? {
    fast: model?.supportsFast ?? false,
    reasoning: model?.reasoningEfforts?.length
      ? { options: model.reasoningEfforts, default: model.defaultReasoning }
      : undefined,
  }
const supportsFast = computed(() => capabilities(selected.value).fast === true)
const efforts = computed(
  () => capabilities(selected.value).reasoning?.options ?? [],
)
const defaultReasoning = computed(
  () => capabilities(selected.value).reasoning?.default,
)
const modelGroups = computed(() => {
  const groups = new Map<
    string,
    { label?: string; description?: string; models: ChatInputModel[] }
  >()
  for (const model of props.models) {
    const key = model.group?.value ?? ''
    if (!groups.has(key))
      groups.set(key, {
        label: model.group?.label,
        description: model.group?.description,
        models: [],
      })
    groups.get(key)!.models.push(model)
  }
  return [...groups.entries()].map(([value, group]) => ({ value, ...group }))
})
const currentReasoning = computed(
  () =>
    efforts.value.find((item) => item.value === props.reasoning)?.value ??
    efforts.value.find((item) => item.value === defaultReasoning.value)
      ?.value ??
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
  if (!capabilities(model).fast && props.fast) emit('update:fast', false)
  const levels = capabilities(model).reasoning?.options ?? []
  if (!levels.some((item) => item.value === props.reasoning))
    emit(
      'update:reasoning',
      levels.find(
        (item) => item.value === capabilities(model).reasoning?.default,
      )?.value ??
        levels[0]?.value ??
        '',
    )
}
watch(
  selected,
  (model) => {
    if (model) updateCapabilities(model)
  },
  { immediate: true, deep: true },
)
const choose = (model: ChatInputModel) => {
  if (props.disabled || model.disabled) return
  modelListOpen.value = false
  emit('update:model', model.value)
  updateCapabilities(model)
}
const toggleFast = () => {
  if (!props.disabled && supportsFast.value) emit('update:fast', !props.fast)
}
const resetSettings = () => {
  if (props.disabled) return
  emit('update:fast', false)
  const level =
    efforts.value.find((item) => item.value === defaultReasoning.value) ??
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
      :outside-click-ignore="[`.${pickerClass}`]"
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
          <SPopper
            :visible="modelListOpen"
            trigger="click"
            placement="right-start"
            :disabled="disabled"
            :show-arrow="false"
            :popper-class="`s-chat-input__model-picker ${pickerClass}`"
            @update:visible="modelListOpen = $event"
          >
            <button
              type="button"
              class="s-agent-control s-chat-input__current-model"
              :disabled="disabled"
              :aria-expanded="modelListOpen"
              aria-haspopup="dialog"
              :aria-label="t('vs.agent.chooseModel')"
            >
              {{ selected?.label || t('vs.agent.chooseModel')
              }}<SIcon name="cb:chevron-right" :size="12" />
            </button>
            <template #content>
              <div role="dialog" :aria-label="t('vs.agent.chooseModel')">
                <div class="s-chat-input__picker-title">
                  {{ t('vs.agent.chooseModel') }}
                </div>
                <div
                  v-for="group in modelGroups"
                  :key="group.value"
                  class="s-chat-input__model-group"
                >
                  <div v-if="group.label" class="s-chat-input__group-title">
                    {{ group.label }}
                  </div>
                  <div
                    v-if="group.description"
                    class="s-chat-input__group-description"
                  >
                    {{ group.description }}
                  </div>
                  <div class="s-chat-input__model-list">
                    <button
                      v-for="option in group.models"
                      :key="option.value"
                      type="button"
                      class="s-agent-control s-chat-input__model-choice"
                      :disabled="disabled || option.disabled"
                      :aria-pressed="option.value === model"
                      @click="choose(option)"
                    >
                      <img
                        v-if="option.icon"
                        :src="option.icon"
                        alt=""
                      /><span>{{ option.label }}</span
                      ><SIcon
                        v-if="option.value === model"
                        name="cb:checkmark"
                        :size="16"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </SPopper>
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
