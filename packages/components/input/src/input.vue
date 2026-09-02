<template>
  <div :class="inputKls" :style="inputStyle">
    <div
      :class="[ns.e('wrapper'), ns.is('disabled', disabled)]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <span
        v-if="hasPrefix"
        :class="[
          ns.e('prefix'),
          prefixConfig?.status && ns.is(prefixConfig.status),
        ]"
        @click="(event) => emit('prefix-click', event)"
      >
        <slot name="prefix">
          <s-icon v-if="prefixIconName" :name="prefixIconName" />
          <template v-else>{{ prefixConfig?.content }}</template>
        </slot>
      </span>
      <input
        v-bind="$attrs"
        :id="inputId"
        ref="inputRef"
        :value="model ?? ''"
        :type="inputType"
        :disabled="disabled"
        :readonly="readonly || !editable"
        :name="name"
        :title="title"
        :form="form"
        :autocomplete="autoComplete ?? autocomplete"
        :autofocus="autoFocus"
        :maxlength="nativeMaxLength"
        :minlength="minLength"
        :multiple="multiple"
        :min="min"
        :max="max"
        :step="step"
        :inputmode="inputMode"
        :pattern="pattern"
        :spellcheck="spellcheck"
        :required="required"
        :style="nativeInputStyle"
        :class="[ns.e('original'), ns.is('disabled', disabled)]"
        placeholder=""
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="onChange"
        @keydown="handleKeydownWithActions"
        @keyup="(event) => emit('keyup', event)"
        @click="(event) => emit('click', event)"
        @wheel="(event) => emit('wheel', event)"
      />

      <span
        v-if="hasSuffix"
        :class="[
          ns.e('suffix'),
          countOnly && ns.em('suffix', 'count'),
          suffixConfig?.status && ns.is(suffixConfig.status),
        ]"
        @click="handleSuffixClick"
      >
        <slot name="suffix" :count="wordCount" :limit="countLimit">
          <s-icon v-if="suffixIconName" :name="suffixIconName" />
          <template v-else>{{ suffixConfig?.content }}</template>
          <span v-if="showDefaultCount" :class="ns.e('count')">
            {{ wordCount
            }}<template v-if="countLimit !== undefined">
              / {{ countLimit }}</template
            >
          </span>
        </slot>
      </span>

      <label
        v-if="placeholderText"
        :for="inputId"
        :class="[
          ns.e('placeholder'),
          { [ns.em('placeholder', 'float')]: labelFloat },
          {
            [ns.em('placeholder', 'float-active')]: isPlaceholderFloatActive,
          },
          {
            [ns.em('placeholder', 'hidden')]: hasInputValue,
          },
        ]"
        @mousedown.prevent="NOOP"
      >
        <span :class="ns.e('placeholder-text')">{{ placeholderText }}</span>
      </label>

      <label
        v-if="label && !labelFloat"
        :for="inputId"
        :class="[ns.e('label')]"
        @mousedown.prevent="NOOP"
      >
        {{ label }}
      </label>

      <span
        v-if="$slots.icon"
        :class="[ns.e('icon')]"
        @mousedown.prevent="NOOP"
        @click="clickIcon"
      >
        <slot name="icon" />
      </span>
      <div v-if="loading" :class="ns.e('loading')">
        <icon-loading />
      </div>

      <transition name="clearable-transition">
        <button
          v-if="showClear"
          type="button"
          :class="ns.e('clearable')"
          aria-label="Clear input"
          @click="clear"
          @mousedown.prevent="NOOP"
        >
          <icon-close />
        </button>
      </transition>

      <transition name="clearable-transition">
        <button
          v-if="isShowPassword"
          type="button"
          :class="[ns.e('action'), ns.em('action', 'password')]"
          :aria-label="isVisiblePassword ? 'Hide password' : 'Show password'"
          @click="handleShowPassword"
          @mousedown.prevent="NOOP"
        >
          <s-icon
            :name="isVisiblePassword ? 'cb:view' : 'cb:view-off'"
            @mousedown.prevent="NOOP"
          />
        </button>
      </transition>

      <button
        v-if="showSearchControl"
        type="button"
        :class="[ns.e('action'), ns.em('action', 'search')]"
        aria-label="Search"
        @click="handleSearchClick"
        @mousedown.prevent="NOOP"
      >
        <s-icon name="cb:search" />
      </button>

      <div :class="ns.e('affects')">
        <div :class="ns.em('affects', '1')" />
        <div :class="ns.em('affects', '2')" />
      </div>
    </div>

    <div
      v-if="progress"
      :class="[ns.e('progress'), ns.em('progress', progressState)]"
    >
      <div
        :class="ns.em('progress', 'bar')"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <s-collapse-transition v-for="message in messageType" :key="message">
      <div
        v-if="$slots[`message-${message}`]"
        :class="[ns.e('message'), ns.em('message', message)]"
      >
        <slot :name="`message-${message}`" />
      </div>
    </s-collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, useSlots } from 'vue'
import { IconClose, IconLoading, SIcon } from '@vuesax-alpha/components/icon'
import { SCollapseTransition } from '@vuesax-alpha/components/collapse-transition'
import {
  useColor,
  useDeprecated,
  useId,
  useNamespace,
  useProp,
  useShape,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { NOOP, getVsColor } from '@vuesax-alpha/utils'
import { inputEmits, inputProps } from './input'
import { useInput } from './composables'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SInput',
  inheritAttrs: false,
})

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const slots = useSlots()

useDeprecated(
  {
    from: 'border',
    type: 'Prop',
    version: 'SaxDesignVue',
    scope: 'vs-input',
    ref: 'https://vuesax-alpha.vercel.app/components/input#style',
    replacement: 'inputStyle',
  },
  computed(() => props.border),
)

useDeprecated(
  {
    from: 'shadow',
    type: 'Prop',
    version: 'SaxDesignVue',
    scope: 'vs-input',
    ref: 'https://vuesax-alpha.vercel.app/components/input#style',
    replacement: 'inputStyle',
  },
  computed(() => props.shadow),
)

useDeprecated(
  {
    from: 'transparent',
    type: 'Prop',
    version: 'SaxDesignVue',
    scope: 'vs-input',
    ref: 'https://vuesax-alpha.vercel.app/components/input#style',
    replacement: 'inputStyle',
  },
  computed(() => props.transparent),
)

useDeprecated(
  {
    from: 'labelPlaceholder',
    type: 'Prop',
    version: 'SaxDesignVue',
    scope: 'vs-input',
    ref: 'https://vuesax-alpha.vercel.app/components/input#label',
    replacement: 'labelFloat',
  },
  computed(() => !!props.labelPlaceholder),
)

useDeprecated(
  {
    from: 'square',
    type: 'Prop',
    version: 'SaxDesignVue',
    scope: 'vs-input',
    ref: 'https://vuesax-alpha.vercel.app/components/input#shape',
    replacement: 'shape',
  },
  computed(() => !!props.square),
)

const ns = useNamespace('input')
const shape = useShape(computed(() => (props.square ? 'square' : undefined)))

const inputId = props.id ?? useId()

const messageType = ['success', 'warn', 'danger', 'primary', 'dark']

const {
  model,
  inputType,
  isVisiblePassword,
  isShowPassword,
  focused,
  hovering,
  inputRef,
  blur,
  handleBlur,
  handleKeydown,
  focus,
  handleFocus,
  handleChange,
  select,
  clickIcon,
  handleShowPassword,
  handleMouseLeave,
  handleMouseEnter,
  handleInput,
  handleCompositionStart,
  handleCompositionEnd,
  /** clearable */
  showClear,
  clear,
  commitModelValue,
  countLimit,
  countValue,
  nativeMaxLength,
} = useInput(props, emit)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  model.value = props.trim ? target.value.trim() : target.value
  const value = String(model.value ?? '')
  target.value = value
  commitModelValue(value)
  handleChange(event)
  emit('lazy-change', value)
}

const handleKeydownWithActions = (event: KeyboardEvent) => {
  handleKeydown(event)
  if (
    event.key === 'Escape' &&
    (props.allowClear || props.clearable) &&
    Boolean(String(model.value))
  ) {
    clear()
  }
  if (event.key === 'Enter' && props.type === 'search') {
    emit('search-click', String(model.value ?? ''), event)
  }
}

const handleSearchClick = (event: MouseEvent) => {
  emit('search-click', String(model.value ?? ''), event)
  focus()
}

const vsBaseClasses = useVuesaxBaseComponent(useColor())
const prefixIconName = computed(
  () => props.prefixIcon || props.prefixConfig?.icon,
)
const suffixIconName = computed(
  () => props.suffixIcon || props.suffixConfig?.icon,
)
const hasPrefix = computed(
  () =>
    !!slots.prefix || !!prefixIconName.value || !!props.prefixConfig?.content,
)
const hasSuffixContent = computed(
  () =>
    !!slots.suffix || !!suffixIconName.value || !!props.suffixConfig?.content,
)
const showDefaultCount = computed(() => props.showWordCount && !slots.suffix)
const hasSuffix = computed(
  () => hasSuffixContent.value || showDefaultCount.value,
)
const countOnly = computed(
  () => showDefaultCount.value && !hasSuffixContent.value,
)
const hasPrefixIconOnly = computed(
  () => !!prefixIconName.value && !slots.prefix,
)
const hasSuffixIconOnly = computed(
  () => !!suffixIconName.value && !slots.suffix && !showDefaultCount.value,
)
const handleSuffixClick = (event: MouseEvent) => {
  if (hasSuffixContent.value) emit('suffix-click', event)
}
const showSearchControl = computed(
  () => props.type === 'search' && props.controls && !props.disabled,
)
const hasEndAction = computed(
  () =>
    props.showPassword ||
    (props.type === 'password' && props.controls) ||
    (props.type === 'search' && props.controls),
)
const placeholderText = computed(() =>
  props.labelFloat ? props.label || props.placeholder : props.placeholder,
)
const hasInputValue = computed(() => !!model.value || model.value === 0)
const isPlaceholderFloatActive = computed(
  () => props.labelFloat && (focused.value || hasInputValue.value),
)
const inputKls = computed(() => [
  vsBaseClasses,
  ns.b(),
  props.className,
  props.wrapClasses,
  props.size && ns.m(props.size),
  { [ns.is(props.inputStyle)]: !!props.inputStyle },
  ns.is('block', props.block),
  ns.is('focus', focused.value),
  ns.is('hovering', hovering.value),
  ns.is(shape.value),
  ns.is('text-white', props.textWhite),

  { [ns.m(`state-${props.state}`)]: !!props.state },
  { [ns.m('has-label')]: props.label || props.labelFloat },
  { [ns.m('has-color')]: props.color },

  { [ns.m('has-icon')]: slots.icon },
  { [ns.m('icon-after')]: props.iconAfter },
  { [ns.m('icon-eye')]: hasEndAction.value },
  { [ns.m('icon-search')]: showSearchControl.value },
  { [ns.m('icon-clearable')]: showClear.value },
  { [ns.m('has-prefix')]: hasPrefix.value },
  { [ns.m('has-prefix-icon')]: hasPrefixIconOnly.value },
  { [ns.m('has-suffix')]: hasSuffix.value },
  { [ns.m('has-suffix-icon')]: hasSuffixIconOnly.value },
  { [ns.m('has-count')]: showDefaultCount.value },
])

const inputStyle = computed(() => [
  ns.cssVar({
    color: getVsColor(props.color),
  }),
  props.wrapStyles,
])

const nativeInputStyle = computed<CSSProperties>(() => ({
  textAlign: props.align as CSSProperties['textAlign'],
}))
const wordCount = computed(() => {
  const value = String(model.value ?? '')
  return countValue(value)
})

const progressState = computed(() => {
  const progress = useProp<typeof props.progress>('progress')

  if (!progress.value || progress.value <= 33) return 'danger'
  if (progress.value <= 66) return 'warn'
  return 'success'
})

onMounted(() => {
  if (props.autoFocus) focus()
})

defineExpose({
  /** @description HTML input element native method */
  focus,
  /** @description HTML input element native method */
  blur,
  /** @description HTML input element native method */
  select,
  /** @description clear input value */
  clear,
  /** @description HTML input element ref */
  inputRef,
})
</script>
