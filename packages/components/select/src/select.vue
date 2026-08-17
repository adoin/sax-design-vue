<template>
  <s-popper
    ref="popperRef"
    v-model:visible="dropMenuVisible"
    trigger="click"
    :placement="popupConfig.placement ?? 'bottom'"
    persistent
    :animation="optionsAnimation"
    :flip="flip"
    :fit="fit"
    :hide-after="hideAfter"
    :show-after="showAfter"
    :loading="loading"
    :disabled="disabled"
    :on-blur="onBlur"
    :on-focus="onFocus"
    :on-click="onClick"
    :on-contextmenu="onContextmenu"
    :on-mouseenter="onMouseenter"
    :on-mouseleave="onMouseleave"
    :on-keydown="onKeydown"
    :teleported="popupConfig.transfer ?? teleported"
    :append-to="popupConfig.appendTo"
    :strategy="strategy"
    :popper-class="[
      ns.e('content'),
      useVuesaxBaseComponent(color),
      popupConfig.className,
    ]"
    :popper-style="[colorCssVar, popupStyle, popupConfig.style]"
    :z-index="popupConfig.zIndex"
    :show-arrow="false"
    :offset="popupConfig.offset ?? 6"
    :process-before-open="processBeforeOpen"
    :process-before-close="processBeforeClose"
    @show="handleMenuShow"
  >
    <div
      ref="selectWrapper"
      v-click-outside:[popperPaneRef]="handleClose"
      :class="selectKls"
      :style="selectStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="toggleMenu"
    >
      <div v-if="multiple" ref="chips" :class="[ns.e('chips')]">
        <span
          v-if="multipleDisplayMode === 'text' && !query && !dropMenuVisible"
          :class="ns.e('selection-text')"
        >
          {{ multipleDisplayText }}
        </span>

        <template v-if="multipleDisplayMode === 'tags'">
          <s-chip
            v-for="(item, cIndex) in showTagList"
            :key="cIndex + 'chip'"
            :shape="shape"
            :disabled="selectDisabled || item.isDisabled"
            :hit="item.hit"
            @close="deleteTag(item.value)"
          >
            {{ getSelectedTagLabel(item) }}
          </s-chip>

          <s-chip
            v-if="hasCollapsedTags"
            :show-close="false"
            :shape="shape"
            :hit="collapseTagList.some((item) => item.hit)"
          >
            + {{ collapsedTagCount }}
          </s-chip>

          <div
            v-if="collapseChips"
            ref="tagMeasure"
            :class="ns.e('tag-measure')"
            aria-hidden="true"
          >
            <s-chip
              v-for="(item, measureIndex) in selectedArray"
              :key="`${measureIndex}-measure`"
              data-select-measure-tag
              :shape="shape"
              :disabled="selectDisabled || item.isDisabled"
            >
              {{ getSelectedTagLabel(item) }}
            </s-chip>
            <s-chip
              data-select-measure-overflow
              :show-close="false"
              :shape="shape"
            >
              + {{ selectedArray.length }}
            </s-chip>
          </div>
        </template>

        <input
          v-if="filterable && !selectDisabled"
          ref="input"
          v-model="query"
          type="text"
          :class="[
            ns.e('input-filter'),
            ns.is('disabled', selectDisabled),
            ns.is(
              'idle',
              !dropMenuVisible && !query && selectedArray.length > 0,
            ),
            ns.be('chips', 'input'),
          ]"
          :placeholder="
            dropMenuVisible
              ? searchPlaceholder
              : selectedArray.length
                ? ''
                : states.currentPlaceholder || ''
          "
          :disabled="selectDisabled"
          @focus="handleFocus"
          @blur="handleBlur"
          @mouseenter="handleTarget('input-filter')"
          @mouseleave="handleTarget(null)"
          @keyup="managePlaceholder"
          @keydown.down.prevent="navigateOptions('next')"
          @keydown.up.prevent="navigateOptions('prev')"
          @keydown.esc="handleKeydownEscape"
          @keydown.enter.stop.prevent="selectOption"
          @keydown.ctrl.p.prevent="toggleHoveredPin"
          @keydown.delete="deletePrevTag"
          @keydown.tab="visible = false"
          @compositionstart="handleComposition"
          @compositionupdate="handleComposition"
          @compositionend="handleComposition"
          @input="debouncedQueryChange"
        />
      </div>
      <input
        :id="inputId"
        ref="reference"
        v-model="states.selectedLabel"
        :class="[ns.e('input'), ns.is('multiple', multiple)]"
        :readonly="readonly"
        :placeholder="
          !multiple && filterable && dropMenuVisible
            ? searchPlaceholder
            : undefined
        "
        @focus="handleFocus"
        @blur="handleBlur"
        @mouseenter="handleTarget('input-filter', !readonly)"
        @mouseleave="handleTarget(null)"
        @input="debouncedOnInputChange"
        @paste="debouncedOnInputChange"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.ctrl.p.prevent="toggleHoveredPin"
        @keydown.esc="handleKeydownEscape"
        @keydown.tab="states.visible = false"
      />

      <label
        v-if="label"
        :for="inputId"
        :class="[
          ns.e('label'),
          ns.is(
            'placeholder',
            labelFloat &&
              !dropMenuVisible &&
              (isEqual(modelValue, notValue) ||
                (!modelValue && modelValue != 0)),
          ),
        ]"
      >
        {{ label }}
      </label>

      <span
        v-if="
          !multiple &&
          !labelFloat &&
          states.currentPlaceholder &&
          !(filterable && dropMenuVisible && searchPlaceholder)
        "
        :class="[ns.e('placeholder'), ns.is('hidden', !!modelValue)]"
      >
        {{ states.currentPlaceholder }}
      </span>

      <icon-loading v-if="loading" class="vs-select__loading" />

      <span :class="ns.e('arrow')" aria-hidden="true">
        <s-icon name="cb:chevron-down" size="14" />
      </span>

      <transition name="v-clearable">
        <span
          v-if="showClose"
          :class="ns.e('clearable')"
          @click="handleClearClick"
        >
          <icon-close hover="less" scale="0.675" />
        </span>
      </transition>

      <s-collapse-transition
        v-for="(messageType, index) in messageTypes"
        :key="index"
      >
        <div
          v-if="$slots[`message-${messageType}`]"
          :class="[ns.e('message'), ns.em('message', messageType)]"
        >
          <slot :name="`message-${messageType}`" />
        </div>
      </s-collapse-transition>
    </div>

    <template #content>
      <div v-if="$slots.header" :class="ns.e('dropdown-header')">
        <slot
          name="header"
          :query="query"
          :selected-count="selectedArray.length"
        />
      </div>

      <div
        v-if="multiple && (selectionTools.length || $slots.tools)"
        :class="ns.e('selection-tools')"
      >
        <slot name="tools" v-bind="selectionSlotProps">
          <button
            v-for="tool in selectionTools"
            :key="tool"
            type="button"
            :class="ns.e('selection-tool')"
            @click.stop="runSelectionTool(tool)"
          >
            {{ getSelectionToolLabel(tool) }}
          </button>
        </slot>
      </div>

      <s-scrollbar
        v-if="!virtualEnabled"
        v-show="states.options.size > 0 && !loading"
        :max-height="popupConfig.maxHeight ?? popupConfig.height ?? 200"
        thickness="3"
        :wrap-class="[
          ns.e('options'),
          ns.is(
            'empty',
            !allowCreate && Boolean(query) && states.filteredOptionsCount === 0,
          ),
        ]"
        :native="nativeScrollbar"
        @mouseleave="hoverIndex = -1"
      >
        <s-option v-if="showNewOption" :value="query" :created="true" />
        <s-option
          v-for="(option, index) in orderedOptions"
          :key="`option-${index}-${getOptionValue(option)}`"
          :value="getOptionValue(option)"
          :label="getOptionLabel(option)"
          :disabled="getOptionDisabled(option)"
          :data="option"
          :option-index="pinningEnabled ? index : -1"
        >
          <span :class="ns.e('option-content')">
            <slot name="option" :option="option">
              <template
                v-for="(part, partIndex) in getHighlightedParts(
                  getOptionLabel(option),
                )"
                :key="partIndex"
              >
                <mark v-if="part.match" :class="ns.e('option-highlight')">{{
                  part.text
                }}</mark>
                <template v-else>{{ part.text }}</template>
              </template>
            </slot>
          </span>
          <s-icon
            v-if="showSelectedMark && isValueSelected(getOptionValue(option))"
            :class="ns.e('option-mark')"
            name="cb:checkmark"
            size="14"
          />
          <span
            v-if="pinningEnabled"
            :class="[
              ns.e('pin'),
              ns.is('pinned', isPinned(getOptionValue(option))),
              ns.is('loading', isPinLoading(getOptionValue(option))),
            ]"
            :title="getPinTitle(getOptionValue(option))"
            :aria-label="getPinTitle(getOptionValue(option))"
            @mousedown.stop.prevent
            @click.stop="togglePin(getOptionValue(option))"
          >
            <s-icon
              :name="
                isPinned(getOptionValue(option)) ? 'cb:pin-filled' : 'cb:pin'
              "
              size="14"
            />
          </span>
        </s-option>
        <s-option-group
          v-for="(group, index) in optionGroups"
          :key="`group-${index}`"
          :label="getGroupLabel(group)"
        >
          <s-option
            v-for="(option, optionIndex) in getGroupOptions(group)"
            :key="`group-option-${optionIndex}-${getOptionValue(option)}`"
            :value="getOptionValue(option)"
            :label="getOptionLabel(option)"
            :disabled="getOptionDisabled(option)"
            :data="option"
          >
            <span :class="ns.e('option-content')">
              <slot name="option" :option="option" :group="group">
                <template
                  v-for="(part, partIndex) in getHighlightedParts(
                    getOptionLabel(option),
                  )"
                  :key="partIndex"
                >
                  <mark v-if="part.match" :class="ns.e('option-highlight')">{{
                    part.text
                  }}</mark>
                  <template v-else>{{ part.text }}</template>
                </template>
              </slot>
            </span>
            <s-icon
              v-if="showSelectedMark && isValueSelected(getOptionValue(option))"
              :class="ns.e('option-mark')"
              name="cb:checkmark"
              size="14"
            />
          </s-option>
        </s-option-group>
        <slot />
      </s-scrollbar>

      <div
        v-else-if="states.options.size > 0 && !loading"
        :class="[
          ns.e('options'),
          ns.is('empty', virtualVisibleOptions.length === 0),
        ]"
        @mouseleave="hoverIndex = -1"
      >
        <s-option v-if="showNewOption" :value="query" :created="true" />
        <s-virtual-list
          v-if="virtualVisibleOptions.length"
          ref="virtualListRef"
          :items="virtualVisibleOptions"
          :height="virtualHeight"
          :estimate-size="virtualConfig.estimateSize ?? 34"
          :overscan="virtualConfig.overscan ?? 6"
          :dynamic="virtualConfig.dynamic ?? true"
          :item-key="getVirtualItemKey"
        >
          <template #default="{ item }">
            <template
              v-for="option in [toVirtualOption(item)]"
              :key="getVirtualItemKey(option)"
            >
              <button
                :class="getVirtualOptionKls(option)"
                :disabled="option.isDisabled || option.groupDisabled"
                @mouseenter="hoverVirtualOption(option)"
                @click="handleOptionSelect(option, true)"
              >
                <span :class="ns.e('option-content')">
                  <slot name="option" :option="option.data">
                    <template
                      v-for="(part, partIndex) in getHighlightedParts(
                        option.currentLabel,
                      )"
                      :key="partIndex"
                    >
                      <mark
                        v-if="part.match"
                        :class="ns.e('option-highlight')"
                        >{{ part.text }}</mark
                      >
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </slot>
                </span>
                <s-icon
                  v-if="showSelectedMark && isValueSelected(option.value)"
                  :class="ns.e('option-mark')"
                  name="cb:checkmark"
                  size="14"
                />
                <span
                  v-if="pinningEnabled"
                  :class="[
                    ns.e('pin'),
                    ns.is('pinned', isPinned(option.value)),
                    ns.is('loading', isPinLoading(option.value)),
                  ]"
                  :title="getPinTitle(option.value)"
                  :aria-label="getPinTitle(option.value)"
                  @mousedown.stop.prevent
                  @click.stop="togglePin(option.value)"
                >
                  <s-icon
                    :name="isPinned(option.value) ? 'cb:pin-filled' : 'cb:pin'"
                    size="14"
                  />
                </span>
              </button>
            </template>
          </template>
        </s-virtual-list>
      </div>

      <template
        v-if="
          emptyText &&
          (!allowCreate ||
            loading ||
            (allowCreate && states.options.size === 0))
        "
      >
        <slot v-if="$slots.empty" name="empty" />
        <p v-else :class="ns.em('options', 'empty')">
          {{ emptyText }}
        </p>
      </template>

      <div v-if="$slots.footer" :class="ns.e('dropdown-footer')">
        <slot name="footer" v-bind="selectionSlotProps" />
      </div>
    </template>
  </s-popper>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  shallowRef,
  toRef,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import { toRefs, unrefElement, useResizeObserver } from '@vueuse/core'
import { isEqual } from 'lodash-unified'
import { ClickOutside as vClickOutside } from '@vuesax-alpha/directives'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import SIcon, { IconClose, IconLoading } from '@vuesax-alpha/components/icon'
import SCollapseTransition from '@vuesax-alpha/components/collapse-transition'
import SScrollbar from '@vuesax-alpha/components/scrollbar'
import SVirtualList from '@vuesax-alpha/components/virtual-list'
import SPopper from '@vuesax-alpha/components/popper'
import {
  useColor,
  useLocale,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { escapeStringRegexp, getVsColor, isClient } from '@vuesax-alpha/utils'
import SOption from './option.vue'
import SOptionGroup from './option-group.vue'
import SChip from './chip.vue'
import { selectContextKey, selectRegisterKey } from './tokens'
import { selectEmits, selectProps } from './select'
import { useSelect, useSelectStates } from './useSelect'
import { sortOptionsByPinnedValues, useSelectPinning } from './useSelectPinning'
import { calculateVisibleTagCount } from './tag-overflow'
import type { SelectSelectionTool } from './select'
import type { SelectOptionContext, SelectOptionValue } from './tokens'

defineOptions({
  name: 'SSelect',
  inheritAttrs: false,
})

const messageTypes = ['success', 'warn', 'danger', 'primary', 'dark']

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const ns = useNamespace('select')
const { t } = useLocale()
const slots = useSlots()

const states = useSelectStates(props)

const color = useColor('primary')

const colorCssVar = computed(() =>
  ns.cssVar({
    color: getVsColor(color.value),
  }),
)

const popupConfig = computed(() => props.popupConfig)
const filterable = computed(() => props.filter || props.filterable)
const popupWidth = shallowRef<number>()
const toCssSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value
const popupMatchesTrigger = computed(
  () =>
    popupConfig.value.full ||
    popupConfig.value.width === 'full' ||
    (popupConfig.value.matchTriggerWidth ??
      (popupConfig.value.width === undefined && props.fit)),
)
const popupStyle = computed(() => ({
  width: popupMatchesTrigger.value
    ? toCssSize(popupWidth.value)
    : toCssSize(
        popupConfig.value.width === 'full'
          ? undefined
          : popupConfig.value.width,
      ),
  minWidth: toCssSize(popupConfig.value.minWidth),
  maxWidth: toCssSize(popupConfig.value.maxWidth),
  maxHeight: toCssSize(popupConfig.value.maxHeight ?? popupConfig.value.height),
}))

const getOptionValue = (option: Record<string, unknown>) =>
  option[props.optionProps.value ?? 'value'] ?? ''
const getOptionLabel = (option: Record<string, unknown>) =>
  `${option[props.optionProps.label ?? 'label'] ?? getOptionValue(option)}`
const getOptionDisabled = (option: Record<string, unknown>) =>
  Boolean(option[props.optionProps.disabled ?? 'disabled'])
const getGroupLabel = (group: Record<string, unknown>) =>
  `${group[props.optionGroupProps.label ?? 'label'] ?? ''}`
const getGroupOptions = (group: Record<string, unknown>) => {
  const options = group[props.optionGroupProps.options ?? 'options']
  return Array.isArray(options) ? (options as Record<string, unknown>[]) : []
}

const {
  isPinEnabled,
  pinnedItems,
  pinItemsLoaded,
  isPinned,
  isPinLoading,
  refreshPinnedItems,
  togglePin,
} = useSelectPinning(props, {
  onFetch: (values, loaded) => emit('pin-fetch', values, loaded),
  onChange: (payload) => emit('pin-change', payload),
})

const pinningEnabled = computed(
  () =>
    isPinEnabled.value &&
    props.options.length > 0 &&
    props.optionGroups.length === 0 &&
    !slots.default,
)

const orderedOptions = computed(() =>
  pinningEnabled.value
    ? sortOptionsByPinnedValues(
        props.options,
        pinnedItems.value,
        getOptionValue,
      )
    : props.options,
)

const getPinTitle = (value: SelectOptionValue) =>
  isPinned(value) ? t('vs.select.unpin') : t('vs.select.pin')

const isOptionVisible = (option: SelectOptionContext, searchValue: string) => {
  if (option.created) return true
  if (
    option.data &&
    props.optionVisibleMethod &&
    !props.optionVisibleMethod(option.data)
  ) {
    return false
  }
  if (option.data && props.filterOption) {
    return props.filterOption(searchValue, option.data)
  }
  const regexp = new RegExp(escapeStringRegexp(searchValue), 'i')
  return regexp.test(option.currentLabel)
}

const getHighlightedParts = (label: string) => {
  const searchValue = `${states.query}`
  if (!props.highlightSearch || !searchValue) {
    return [{ text: label, match: false }]
  }

  const regexp = new RegExp(`(${escapeStringRegexp(searchValue)})`, 'ig')
  return label
    .split(regexp)
    .filter(Boolean)
    .map((text) => ({
      text,
      match: text.toLocaleLowerCase() === searchValue.toLocaleLowerCase(),
    }))
}

const virtualEnabled = computed(
  () =>
    props.virtual &&
    props.optionGroups.length === 0 &&
    !slots.default &&
    props.options.length >= (props.virtualConfig.threshold ?? 100),
)
const virtualListRef = ref<InstanceType<typeof SVirtualList>>()
const virtualOptions = ref<SelectOptionContext[]>([])
const virtualVisibleOptions = computed(() =>
  virtualOptions.value.filter((option) => option.visible),
)
const virtualHeight = computed(
  () => popupConfig.value.height ?? popupConfig.value.maxHeight ?? 200,
)
const toVirtualOption = (option: unknown) => option as SelectOptionContext
const getVirtualItemKey = (option: unknown) =>
  toVirtualOption(option).key ?? toVirtualOption(option).index

const reorderVirtualOptions = () => {
  if (!virtualOptions.value.length) return
  const ordered = pinningEnabled.value
    ? sortOptionsByPinnedValues(
        virtualOptions.value,
        pinnedItems.value,
        (option) => option.value,
      )
    : [...virtualOptions.value].sort(
        (left, right) => Number(left.key) - Number(right.key),
      )

  ordered.forEach((option, index) => {
    option.index = index
  })
  virtualOptions.value = ordered
}

const syncVirtualOptions = () => {
  if (!virtualEnabled.value) {
    if (!virtualOptions.value.length) return
    virtualOptions.value = []
    states.options.clear()
    states.disabledOptions.clear()
    states.optionsCount = 0
    states.filteredOptionsCount = 0
    return
  }

  states.options.clear()
  states.disabledOptions.clear()
  states.optionsCount = 0
  states.filteredOptionsCount = 0

  virtualOptions.value = props.options.map((data, index) => {
    const value = getOptionValue(data) as SelectOptionValue
    const context = reactive({
      key: index,
      index,
      el: undefined,
      value,
      data,
      currentLabel: getOptionLabel(data),
      isDisabled: getOptionDisabled(data),
      groupDisabled: false,
      visible: true,
      hit: false,
      hover: false,
      created: false,
    }) as SelectOptionContext
    states.options.set(value, context)
    states.cachedOptions.set(value, context)
    if (context.isDisabled) states.disabledOptions.set(value, context)
    return context
  })
  states.optionsCount = virtualOptions.value.length
  reorderVirtualOptions()
  applyVirtualFilter()
  syncCachedDataOptions()
  setSelected()
}

const applyVirtualFilter = () => {
  if (!virtualEnabled.value) return
  let visibleCount = 0
  virtualOptions.value.forEach((option) => {
    option.visible = isOptionVisible(option, `${states.query}`)
    if (option.visible) visibleCount++
  })
  states.filteredOptionsCount = visibleCount
}

const getVirtualOptionKls = (option: SelectOptionContext) => [
  ns.e('option'),
  ns.is('hover', states.hoverIndex === option.index),
  ns.is(
    'active',
    selectedArray.value.some((selected) =>
      isEqual(selected.value, option.value),
    ),
  ),
  ns.is('disabled', option.isDisabled || option.groupDisabled),
]

const hoverVirtualOption = (option: SelectOptionContext) => {
  states.hoverIndex = optionsArray.value.indexOf(option)
}

watch(
  () => [virtualEnabled.value, props.options] as const,
  () => syncVirtualOptions(),
  { deep: true },
)

watch(
  () => [...pinnedItems.value],
  () => {
    if (virtualEnabled.value) reorderVirtualOptions()
  },
  { deep: true },
)

watch(
  () => states.query,
  () => {
    applyVirtualFilter()
    if (virtualEnabled.value) {
      nextTick(() => virtualListRef.value?.scrollToOffset(0))
    }
  },
)

const optionsAnimation = computed(() => ns.b())

const {
  showNewOption,
  debouncedQueryChange,
  managePlaceholder,
  deletePrevTag,
  deleteTag,
  handleClearClick,
  showClose,
  inputId,
  emptyText,
  readonly,
  input,
  reference,

  chips,
  popperRef,
  selectDisabled,
  selectWrapper,
  handleMouseEnter,
  handleMouseLeave,
  handleTarget,
  selectOption,
  handleComposition,
  navigateOptions: navigateSelectOptions,
  handleKeydownEscape,
  dropMenuVisible,
  debouncedOnInputChange,
  handleFocus,
  handleBlur,
  toggleMenu,
  handleMenuEnter,
  handleResize,
  setSelected,
  handleClose,
  onOptionCreate,
  onOptionDestroy,
  handleOptionSelect,
  focus,
  blur,

  processBeforeOpen,
  processBeforeClose,

  queryChange,

  optionsArray,
  cachedOptionsArray,
  selectedArray,
} = useSelect(props, states, emit)

const scrollVirtualOptionIntoView = (
  option: SelectOptionContext | undefined,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) => {
  if (!virtualEnabled.value || !option) return
  const visibleIndex = virtualVisibleOptions.value.indexOf(option)
  if (visibleIndex >= 0) {
    virtualListRef.value?.scrollToIndex(visibleIndex, align)
  }
}

const handleMenuShow = () => {
  handleMenuEnter()
  syncPopupWidth()
  if (!virtualEnabled.value) return

  nextTick(() => {
    virtualListRef.value?.measure()
    scrollVirtualOptionIntoView(selectedArray.value[0])
  })
}

const navigateOptions = (direction: 'next' | 'prev' = 'next') => {
  const wasVisible = states.visible
  const previousIndex = states.hoverIndex
  navigateSelectOptions(direction)
  if (
    !virtualEnabled.value ||
    !wasVisible ||
    previousIndex === states.hoverIndex
  )
    return

  nextTick(() => {
    scrollVirtualOptionIntoView(optionsArray.value[states.hoverIndex])
  })
}

const toggleHoveredPin = () => {
  if (!pinningEnabled.value) return
  const option = optionsArray.value[states.hoverIndex]
  if (!option || option.created || option.isDisabled || option.groupDisabled)
    return
  togglePin(option.value)
}

watch(
  orderedOptions,
  (_, previousOptions) => {
    if (!pinningEnabled.value || states.hoverIndex < 0) return
    const previousOption = previousOptions[states.hoverIndex]
    if (!previousOption) return
    const hoveredValue = getOptionValue(previousOption)

    nextTick(() => {
      const nextIndex = optionsArray.value.findIndex((option) =>
        isEqual(option.value, hoveredValue),
      )
      if (nextIndex >= 0) states.hoverIndex = nextIndex
    })
  },
  { flush: 'post' },
)

const hasAutoUsedOption = shallowRef(false)

watch(
  () =>
    [
      props.autoUseOption,
      props.multiple,
      props.modelValue,
      pinItemsLoaded.value,
      orderedOptions.value,
    ] as const,
  () => {
    if (!props.autoUseOption || props.multiple || hasAutoUsedOption.value)
      return
    if (props.modelValue !== '' && props.modelValue != null) {
      hasAutoUsedOption.value = true
      return
    }
    if (!pinItemsLoaded.value) return

    const option = orderedOptions.value.find((item) => !getOptionDisabled(item))
    if (!option) return

    const value = getOptionValue(option) as SelectOptionValue
    hasAutoUsedOption.value = true
    emit(UPDATE_MODEL_EVENT, value)
    emit('change', value)
  },
  { immediate: true, deep: true, flush: 'post' },
)

const syncPopupWidth = () => {
  if (!popupMatchesTrigger.value) return

  const width = selectWrapper.value?.getBoundingClientRect().width
  popupWidth.value = width ? Math.ceil(width) : undefined
}

watch(dropMenuVisible, (visible) => {
  if (visible) nextTick(syncPopupWidth)
})

const { visible, hoverIndex, query } = toRefs(states)

const syncCachedDataOptions = () => {
  props.cachedOptions.forEach((data, index) => {
    const value = getOptionValue(data) as SelectOptionValue
    if (states.options.has(value)) return
    states.cachedOptions.set(value, {
      index: -(index + 1),
      el: undefined,
      value,
      data,
      currentLabel: getOptionLabel(data),
      isDisabled: getOptionDisabled(data),
      groupDisabled: false,
      visible: false,
      hit: false,
      hover: false,
      created: false,
    })
  })
}

watch(
  () => props.cachedOptions,
  () => {
    syncCachedDataOptions()
    setSelected()
  },
  { deep: true },
)

const getSelectedTagLabel = (option: SelectOptionContext) =>
  props.getTagLabel?.({
    value: option.value,
    label: option.currentLabel,
    option: option.data,
  }) ?? option.currentLabel

const tagMeasure = useTemplateRef<HTMLElement>('tagMeasure')
const visibleTagCount = shallowRef(Number.MAX_SAFE_INTEGER)
const showTagList = computed(() =>
  props.collapseChips
    ? selectedArray.value.slice(0, visibleTagCount.value)
    : selectedArray.value,
)
const collapseTagList = computed(() =>
  props.collapseChips ? selectedArray.value.slice(visibleTagCount.value) : [],
)
const collapsedTagCount = computed(
  () => selectedArray.value.length - showTagList.value.length,
)
const hasCollapsedTags = computed(
  () => props.collapseChips && collapsedTagCount.value > 0,
)

const getOuterWidth = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)
  return (
    element.getBoundingClientRect().width +
    Number.parseFloat(style.marginLeft || '0') +
    Number.parseFloat(style.marginRight || '0')
  )
}

const updateVisibleTagCount = () => {
  if (!isClient) return
  if (
    !props.collapseChips ||
    props.multipleDisplayMode !== 'tags' ||
    !chips.value ||
    !tagMeasure.value
  ) {
    visibleTagCount.value = selectedArray.value.length
    return
  }

  const chipsStyle = window.getComputedStyle(chips.value)
  const availableWidth =
    chips.value.clientWidth -
    Number.parseFloat(chipsStyle.paddingLeft || '0') -
    Number.parseFloat(chipsStyle.paddingRight || '0')
  const tagWidths = Array.from(
    tagMeasure.value.querySelectorAll<HTMLElement>('[data-select-measure-tag]'),
    getOuterWidth,
  )
  const overflowElement = tagMeasure.value.querySelector<HTMLElement>(
    '[data-select-measure-overflow]',
  )
  const filterStyle = input.value ? window.getComputedStyle(input.value) : null
  const filterReservedWidth =
    filterable.value && input.value && filterStyle
      ? Number.parseFloat(filterStyle.minWidth || '0') +
        Number.parseFloat(filterStyle.marginLeft || '0') +
        Number.parseFloat(filterStyle.marginRight || '0')
      : 0

  visibleTagCount.value = calculateVisibleTagCount({
    availableWidth,
    tagWidths,
    overflowWidth: overflowElement ? getOuterWidth(overflowElement) : 0,
    reservedWidth: filterReservedWidth,
    maxVisible: props.maxCollapseChips,
  })
}

watch(
  () => [
    props.collapseChips,
    props.maxCollapseChips,
    props.multipleDisplayMode,
    dropMenuVisible.value,
    selectedArray.value.map((option) => getSelectedTagLabel(option)),
  ],
  () => nextTick(updateVisibleTagCount),
  { deep: true, flush: 'post' },
)

const multipleDisplayText = computed(() => {
  const labels = selectedArray.value.map(getSelectedTagLabel)
  return props.getDisplayValue
    ? props.getDisplayValue({
        value: props.modelValue,
        labels,
        options: selectedArray.value.map((option) => option.data),
      })
    : labels.join(', ')
})

const isValueSelected = (value: SelectOptionValue) =>
  selectedArray.value.some((option) => isEqual(option.value, value))

const visibleSelectableOptions = computed(() =>
  optionsArray.value.filter(
    (option) => option.visible && !option.isDisabled && !option.groupDisabled,
  ),
)

const updateMultipleValue = (nextValue: SelectOptionValue[]) => {
  if (isEqual(props.modelValue, nextValue)) return
  emit(UPDATE_MODEL_EVENT, nextValue)
  emit('change', nextValue)
}

const selectAllVisible = () => {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  for (const option of visibleSelectableOptions.value) {
    if (current.some((value) => isEqual(value, option.value))) continue
    if (props.multipleLimit > 0 && current.length >= props.multipleLimit) break
    current.push(option.value)
  }
  updateMultipleValue(current)
}

const clearVisible = () => {
  const visibleValues = visibleSelectableOptions.value.map(
    (option) => option.value,
  )
  const current = Array.isArray(props.modelValue) ? props.modelValue : []
  updateMultipleValue(
    current.filter(
      (value) =>
        !visibleValues.some((visibleValue) => isEqual(value, visibleValue)),
    ),
  )
}

const invertVisible = () => {
  const visibleValues = visibleSelectableOptions.value.map(
    (option) => option.value,
  )
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const nextValue = current.filter(
    (value) =>
      !visibleValues.some((visibleValue) => isEqual(value, visibleValue)),
  )
  for (const value of visibleValues) {
    if (current.some((currentValue) => isEqual(currentValue, value))) continue
    if (props.multipleLimit > 0 && nextValue.length >= props.multipleLimit)
      break
    nextValue.push(value)
  }
  updateMultipleValue(nextValue)
}

const selectionActions = {
  selectAll: selectAllVisible,
  invert: invertVisible,
  clear: clearVisible,
}

const runSelectionTool = (tool: SelectSelectionTool) => {
  if (tool === 'all') selectAllVisible()
  if (tool === 'invert') invertVisible()
  if (tool === 'clear') clearVisible()
}

const getSelectionToolLabel = (tool: SelectSelectionTool) =>
  props.selectionToolLabels[tool] ??
  {
    all: t('vs.select.selectAll'),
    invert: t('vs.select.invert'),
    clear: t('vs.select.clear'),
  }[tool]

const selectionSlotProps = computed(() => ({
  query: query.value,
  selectedCount: selectedArray.value.length,
  filteredCount: states.filteredOptionsCount,
  totalCount: states.optionsCount,
  actions: selectionActions,
}))

// @ts-ignore - directive: v-click-outside element
const popperPaneRef = computed(() => {
  return unrefElement(popperRef.value?.contentRef)
})

if (props.multiple && !Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, [])
}

if (!props.multiple && Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, '')
}

const selectKls = computed(() => [
  ns.is('block', props.block),

  ns.b(),
  ns.em('state', props.state),
  ns.is('open', dropMenuVisible.value),
  ns.is('hovering', states.mouseEnter),
  ns.is('focus', states.softFocus),
  ns.is('disabled', selectDisabled.value),
  ns.is('clearable', props.clearable),
  ns.is('multiple', props.multiple),
  ns.is('loading', props.loading),
  ns.is(popperRef.value?.popperPlacement ?? 'bottom'),
  { [ns.m('has-label')]: props.label || props.labelFloat },
])

const selectStyle = computed(() => [colorCssVar.value])

onMounted(() => {
  syncVirtualOptions()
  syncCachedDataOptions()
  states.cachedPlaceHolder = states.currentPlaceholder = props.placeholder
  if (
    props.multiple &&
    Array.isArray(props.modelValue) &&
    props.modelValue.length > 0
  ) {
    states.currentPlaceholder = ''
  }
  useResizeObserver(selectWrapper, () => {
    handleResize()
    syncPopupWidth()
    nextTick(updateVisibleTagCount)
  })

  setSelected()
  nextTick(updateVisibleTagCount)
})

provide(
  selectContextKey,
  reactive({
    multiple: toRef(props, 'multiple'),
    multipleLimit: toRef(props, 'multipleLimit'),
    states,
    queryChange,
    hoverIndex,
    selectWrapper,
    selectedArray,
    optionsArray,
    cachedOptionsArray,
    isOptionVisible,
    handleTarget,
    setSelected,
    handleOptionSelect,
  }),
)

provide(selectRegisterKey, (option: SelectOptionContext) => {
  if (option.index < 0) option.index = states.optionsCount

  onOptionCreate(option.value, option)

  return {
    updateOption: (newOption: SelectOptionContext) => {
      onOptionDestroy(option.value, option)
      onOptionCreate(newOption.value, newOption)
    },
    unregister: () => {
      const doesSelected = selectedArray.value.some(
        (e) => e.value == option.value,
      )
      // if option is not selected, remove it from cache
      nextTick(() => {
        if (
          states.cachedOptions.get(option.value) === option &&
          !doesSelected
        ) {
          states.cachedOptions.delete(option.value)
        }
      })
      onOptionDestroy(option.value, option)
    },
  }
})

defineExpose({
  /** focus to select */
  focus,

  /** blur select */
  blur,

  /** Return the current pinned values in their display order. */
  getPinnedItems: () => [...pinnedItems.value],

  /** Reload pinned values when remote persistence is used. */
  refreshPinnedItems,

  /** Pin or unpin a value using the configured persistence mode. */
  togglePin,
})
</script>
