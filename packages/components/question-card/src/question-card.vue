<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SInput } from '@vuesax-alpha/components/input'
import { SIcon } from '@vuesax-alpha/components/icon'
import { questionCardEmits, questionCardProps } from './question-card'
import type {
  AgentAnswer,
  AgentQuestion,
} from '../../ai-editor/src/agent-shared/types'

defineOptions({ name: 'SQuestionCard' })
const props = defineProps(questionCardProps)
const emit = defineEmits(questionCardEmits)
const ns = useNamespace('question-card')
const shape = useShape()
const { t } = useLocale()
const index = computed(() =>
  Math.min(
    Math.max(
      0,
      Number.isFinite(props.activeIndex) ? Math.floor(props.activeIndex) : 0,
    ),
    Math.max(0, props.questions.length - 1),
  ),
)
const question = computed(() => props.questions[index.value])
const answer = computed(() =>
  props.modelValue.find((item) => item.questionId === question.value?.id),
)
const isValid = (item: AgentQuestion) =>
  props.modelValue.some(
    (value) =>
      value.questionId === item.id &&
      (value.custom
        ? item.allowCustom && !!value.value.trim()
        : item.options.some(
            (option) => !option.disabled && option.value === value.value,
          )),
  )
const validAnswer = computed(() => !!question.value && isValid(question.value))
const answered = computed(() => props.questions.filter(isValid).length)
const canComplete = computed(() =>
  props.questions.every((item) => item.optional || isValid(item)),
)
const update = (value: string, custom = false) => {
  if (props.disabled || !question.value) return
  const next: AgentAnswer = { questionId: question.value.id, value, custom }
  emit('update:modelValue', [
    ...props.modelValue.filter((item) => item.questionId !== next.questionId),
    next,
  ])
}
const next = () => {
  if (props.disabled || !question.value || !validAnswer.value) return
  if (index.value < props.questions.length - 1)
    emit('update:activeIndex', index.value + 1)
  else if (canComplete.value) emit('submit', props.modelValue.slice())
}
const skip = () => {
  if (props.disabled || !question.value?.optional) return
  emit('skip', question.value)
  if (index.value < props.questions.length - 1)
    emit('update:activeIndex', index.value + 1)
  else if (canComplete.value) emit('submit', props.modelValue.slice())
}
const keydown = (event: KeyboardEvent) => {
  if (
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.isComposing &&
    !(
      event.target instanceof HTMLElement &&
      event.target.closest('input, textarea, [contenteditable="true"]')
    )
  ) {
    const option =
      question.value?.options[event.key.toUpperCase().charCodeAt(0) - 65]
    if (event.key.length === 1 && option && !option.disabled) {
      event.preventDefault()
      update(option.value)
    }
  }
  if (
    event.key === 'Enter' &&
    (event.ctrlKey || event.metaKey) &&
    !event.isComposing
  ) {
    event.preventDefault()
    next()
  }
}
</script>

<template>
  <section
    :class="[ns.b(), 's-agent-surface', `is-${shape}`]"
    @keydown="keydown"
  >
    <div class="s-agent-heading">
      <span class="s-agent-card-heading-icon"
        ><SIcon name="cb:chat" aria-hidden="true"
      /></span>
      <h3 class="s-agent-grow">{{ title || t('vs.agent.questions') }}</h3>
      <span class="s-agent-muted"
        >{{ t('vs.agent.answered') }} {{ answered }}/{{
          questions.length
        }}</span
      >
    </div>
    <Transition name="s-agent-reveal" mode="out-in">
      <div v-if="question" :key="question.id" class="s-agent-question">
        <h4>{{ question.title }}</h4>
        <p v-if="question.description" class="s-agent-muted">
          {{ question.description }}
        </p>
        <div class="s-agent-options" role="group" :aria-label="question.title">
          <button
            v-for="(option, optionIndex) in question.options"
            :key="option.value"
            type="button"
            class="s-agent-option s-agent-control"
            :class="{
              'is-active': !answer?.custom && answer?.value === option.value,
            }"
            :aria-pressed="!answer?.custom && answer?.value === option.value"
            :disabled="disabled || option.disabled"
            @click="update(option.value)"
          >
            <kbd class="s-agent-option-key" aria-hidden="true">{{
              String.fromCharCode(65 + optionIndex)
            }}</kbd
            ><span>{{ option.label }}</span
            ><small v-if="option.description" class="s-agent-muted">{{
              option.description
            }}</small>
          </button>
        </div>
        <div v-if="question.allowCustom" class="s-agent-custom-option">
          <kbd class="s-agent-option-key" aria-hidden="true">{{
            String.fromCharCode(65 + question.options.length)
          }}</kbd
          ><SInput
            :model-value="answer?.custom ? answer.value : ''"
            :aria-label="t('vs.agent.customAnswer')"
            :placeholder="t('vs.agent.customAnswer')"
            :disabled="disabled"
            :shape="shape"
            @update:model-value="update(String($event ?? ''), true)"
          />
        </div>
        <slot
          name="question"
          :question="question"
          :answer="answer"
          :update="update"
        />
      </div>
    </Transition>
    <div class="s-agent-actions">
      <SButton
        v-if="index > 0"
        type="flat"
        :shape="shape"
        :disabled="disabled"
        @click="emit('update:activeIndex', index - 1)"
        >{{ t('vs.agent.previous') }}</SButton
      ><SButton
        v-if="question?.optional"
        type="flat"
        :shape="shape"
        :disabled="disabled"
        @click="skip"
        >{{ t('vs.agent.skip') }}</SButton
      ><SButton
        :shape="shape"
        :disabled="disabled || !validAnswer"
        @click="next"
        >{{
          t(
            index === questions.length - 1
              ? 'vs.agent.submit'
              : 'vs.agent.next',
          )
        }}</SButton
      >
    </div>
  </section>
</template>
