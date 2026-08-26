<script lang="ts" setup>
import {
  computed,
  nextTick,
  shallowReactive,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { IconLoading } from '@vuesax-alpha/components/icon'
import { STab, STabs } from '@vuesax-alpha/components/tabs'
import { useNamespace } from '@vuesax-alpha/hooks'
import Form from './form.vue'
import { formGroupProps } from './form-group'
import { createFormValidator } from './form-validator'
import type { ComponentPublicInstance } from 'vue'
import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'
import type { FormInstance, FormModel } from './form'
import type {
  FormGroupErrors,
  FormGroupFormSetting,
  FormGroupItem,
  FormGroupItemContext,
} from './form-group'

defineOptions({ name: 'SFormGroup' })

const props = defineProps(formGroupProps)
const emit = defineEmits<{
  add: [item: FormGroupItem, index: number]
  remove: [item: FormGroupItem, index: number]
  change: [activeKey: number, index: number, item: FormGroupItem]
  tabContextmenu: [context: FormGroupItemContext, event: MouseEvent]
  contextMenuSelect: [menuItem: ContextMenuItem, context: FormGroupItemContext]
  validate: [index: number, valid: boolean]
  fieldValidate: [index: number, field: string, valid: boolean, message: string]
  addError: [error: unknown]
}>()

const model = defineModel<FormGroupItem[]>({ default: () => [] })
const ns = useNamespace('form-group')
const slots = useSlots()
const activeKey = shallowRef(0)
const errorIndexes = shallowRef<number[]>([])
const validationErrors = shallowRef<Record<number, Record<string, string>>>({})
const adding = shallowRef(false)
const formRefs = shallowReactive(new Map<number, FormInstance>())
let nextStableIndex = 0

const reservedSlots = new Set([
  'default',
  'empty',
  'extra',
  'loading',
  'tab-label',
])
const formSlotNames = Object.keys(slots).filter(
  (slotName) => !reservedSlots.has(slotName),
)

const isStableIndex = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

const allocateIndex = () => nextStableIndex++

const normalizeItemIndexes = () => {
  const validIndexes = model.value
    .map((item) => item.__index)
    .filter(isStableIndex)
  nextStableIndex = Math.max(
    nextStableIndex,
    ...validIndexes.map((key) => key + 1),
    0,
  )

  const seen = new Set<number>()
  let changed = false
  const normalized = model.value.map((item) => {
    const current = item.__index
    if (isStableIndex(current) && !seen.has(current)) {
      seen.add(current)
      return item
    }

    const __index = allocateIndex()
    seen.add(__index)
    changed = true
    return { ...item, __index }
  })

  if (changed) model.value = normalized
}

const syncState = () => {
  normalizeItemIndexes()
  const alive = model.value.map((item) => item.__index).filter(isStableIndex)
  errorIndexes.value = errorIndexes.value.filter((key) => alive.includes(key))
  validationErrors.value = Object.keys(validationErrors.value).reduce<
    Record<number, Record<string, string>>
  >((errors, key) => {
    const index = Number(key)
    if (alive.includes(index)) errors[index] = validationErrors.value[index]
    return errors
  }, {})

  for (const key of formRefs.keys()) {
    if (!alive.includes(key)) formRefs.delete(key)
  }

  if (!alive.length) activeKey.value = 0
  else if (!alive.includes(activeKey.value)) activeKey.value = alive[0]
}

watch(() => model.value.map((item) => item.__index), syncState, {
  immediate: true,
})

const entries = computed(() =>
  model.value.map((item, index) => {
    const key = item.__index as number
    const context: FormGroupItemContext = {
      item,
      index,
      key,
      list: model.value,
    }
    const label =
      props.getTabLabel?.(item, index) ??
      `${props.tabLabel} ${props.keepSerial ? index + 1 : key + 1}`
    return {
      item,
      index,
      key,
      label,
      context,
      contextMenuItems: props.getContextMenuItems?.(context) ?? [],
      setting: props.getFormSetting(item, index) as FormGroupFormSetting,
    }
  }),
)

const isLazy = computed(
  () => !props.forceRender && entries.value.length > props.renderThreshold,
)

const canAdd = computed(
  () => props.showAdd && !props.loading && model.value.length < props.max,
)
const isEditable = computed(() => props.editable || props.editAble)

const setFormRef = (
  key: number,
  instance: Element | ComponentPublicInstance | null,
) => {
  if (instance) formRefs.set(key, instance as FormInstance)
  else formRefs.delete(key)
}

const setErrorState = (key: number, invalid: boolean) => {
  const next = new Set(errorIndexes.value)
  if (invalid) next.add(key)
  else next.delete(key)
  errorIndexes.value = [...next]
}

const setValidationErrors = (key: number, errors: Record<string, string>) => {
  const next = { ...validationErrors.value }
  if (Object.keys(errors).length) next[key] = errors
  else delete next[key]
  validationErrors.value = next
}

const getForm = (index: number) => formRefs.get(index)
function getErrors(): FormGroupErrors
function getErrors(index: number): Record<string, string>
function getErrors(index?: number) {
  return index === undefined
    ? validationErrors.value
    : (validationErrors.value[index] ?? {})
}

const setActiveKey = (key: number) => {
  if (model.value.some((item) => item.__index === key)) activeKey.value = key
}

const addItem = async () => {
  if (!canAdd.value || adding.value) return undefined
  adding.value = true
  try {
    const created = props.createItem
      ? await props.createItem({ list: model.value })
      : ({} as FormGroupItem)
    const index = model.value.length
    const item = { ...created, __index: allocateIndex() }
    model.value = [...model.value, item]
    activeKey.value = item.__index
    emit('add', item, index)
    return item
  } catch (error) {
    emit('addError', error)
    return undefined
  } finally {
    adding.value = false
  }
}

const removeItem = (key: number) => {
  const index = model.value.findIndex((item) => item.__index === key)
  if (index < 0) return undefined
  const removed = model.value[index]
  model.value = model.value.filter((item) => item.__index !== key)
  setErrorState(key, false)
  setValidationErrors(key, {})
  emit('remove', removed, index)
  return removed
}

const handleRemove = (key: string | number) => {
  if (typeof key === 'number') removeItem(key)
}

const validate = async (key: number, ignoreTabError = false) => {
  const entry = entries.value.find((item) => item.key === key)
  if (!entry) return false
  const form = getForm(key)
  const result = form
    ? { valid: await form.validate(), errors: form.getErrors() }
    : await createFormValidator(entry.item as FormModel, {
        rules: entry.setting.rules,
        items: entry.setting.items,
      }).validate()
  const { valid, errors } = result
  setValidationErrors(key, errors)
  if (!ignoreTabError) setErrorState(key, !valid)
  emit('validate', key, valid)
  return valid
}

const validateFields = async (
  key: number,
  fields: string[],
  ignoreTabError = false,
) => {
  const entry = entries.value.find((item) => item.key === key)
  if (!entry) return false
  const form = getForm(key)
  const result = form
    ? await (async () => {
        const results = await Promise.all(
          fields.map((field) => form.validateField(field)),
        )
        return { valid: results.every(Boolean), errors: form.getErrors() }
      })()
    : await createFormValidator(entry.item as FormModel, {
        rules: entry.setting.rules,
        items: entry.setting.items,
      }).validate(fields)
  const { valid, errors } = result
  setValidationErrors(key, errors)
  if (!ignoreTabError) setErrorState(key, !valid)
  emit('validate', key, valid)
  return valid
}

const validateMountedForm = async (key: number) => {
  let form = getForm(key)
  for (let attempt = 0; !form && attempt < 3; attempt++) {
    await nextTick()
    form = getForm(key)
  }
  if (!form) return

  const valid = await form.validate()
  setValidationErrors(key, form.getErrors())
  setErrorState(key, !valid)
}

const validateAll = async () => {
  const results = await Promise.all(
    entries.value.map(({ key }) => validate(key)),
  )
  const firstInvalid = results.findIndex((valid) => !valid)
  if (firstInvalid >= 0 && !props.lazyErrorMark) {
    const key = entries.value[firstInvalid].key
    activeKey.value = key
    await validateMountedForm(key)
  }
  return firstInvalid < 0
}

const clearValidate = (key?: number, fields?: string | string[]) => {
  const selected = fields
    ? Array.isArray(fields)
      ? fields
      : [fields]
    : undefined
  const clearStoredErrors = (targetKey: number) => {
    if (!selected) {
      setValidationErrors(targetKey, {})
      setErrorState(targetKey, false)
      return
    }
    const errors = { ...getErrors(targetKey) }
    selected.forEach((field) => delete errors[field])
    setValidationErrors(targetKey, errors)
    setErrorState(targetKey, !!Object.keys(errors).length)
  }

  if (key !== undefined) {
    getForm(key)?.clearValidate(fields)
    clearStoredErrors(key)
    return
  }
  formRefs.forEach((form) => form.clearValidate(fields))
  entries.value.forEach((entry) => clearStoredErrors(entry.key))
}

const resetFields = (key?: number) => {
  if (key !== undefined) {
    getForm(key)?.resetFields()
    setErrorState(key, false)
    setValidationErrors(key, {})
    return
  }
  formRefs.forEach((form) => form.resetFields())
  errorIndexes.value = []
  validationErrors.value = {}
}

const handleTabChange = async (key: string | number) => {
  if (typeof key !== 'number') return
  const index = model.value.findIndex((item) => item.__index === key)
  const item = model.value[index]
  if (item) emit('change', key, index, item)
  if (Object.keys(getErrors(key)).length) await validateMountedForm(key)
}

const handleTabContextmenu = (key: string | number, event: MouseEvent) => {
  if (typeof key !== 'number') return
  const entry = entries.value.find((item) => item.key === key)
  if (entry) emit('tabContextmenu', entry.context, event)
}

const handleContextMenuSelect = (
  menuItem: ContextMenuItem,
  context: FormGroupItemContext,
) => emit('contextMenuSelect', menuItem, context)

const handleFieldValidate = async (
  key: number,
  field: string,
  valid: boolean,
  message: string,
) => {
  await nextTick()
  const hasErrors = Object.keys(getForm(key)?.getErrors() ?? {}).length > 0
  setValidationErrors(key, getForm(key)?.getErrors() ?? {})
  setErrorState(key, hasErrors)
  emit('fieldValidate', key, field, valid, message)
}

defineExpose({
  activeKey: computed(() => activeKey.value),
  errorIndexes: computed(() => errorIndexes.value),
  setActiveKey,
  addItem,
  removeItem,
  validateAll,
  validate,
  validateFields,
  clearValidate,
  resetFields,
  getForm,
  getErrors,
})
</script>

<template>
  <section :class="ns.b()" :aria-busy="loading || adding ? 'true' : undefined">
    <header v-if="title || description" :class="ns.e('header')">
      <h3 v-if="title" :class="ns.e('title')">{{ title }}</h3>
      <p v-if="description" :class="ns.e('description')">
        {{ description }}
      </p>
    </header>

    <div v-if="loading" :class="ns.e('loading')" role="status">
      <IconLoading aria-hidden="true" />
      <slot name="loading">{{ loadingText }}</slot>
    </div>

    <STabs
      v-else-if="entries.length"
      v-model="activeKey"
      :type="tabsType"
      :editable="isEditable || showAdd"
      :lazy="isLazy"
      :aria-label="ariaLabel || title || undefined"
      :hide-add="!canAdd || adding"
      @add="addItem"
      @change="handleTabChange"
      @remove="handleRemove"
      @tab-contextmenu="handleTabContextmenu"
    >
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>

      <STab
        v-for="entry in entries"
        :key="entry.key"
        :name="entry.key"
        :label="entry.label"
        :closable="isEditable"
        :force-render="forceRender"
      >
        <template #label>
          <SContextMenu
            v-if="entry.contextMenuItems.length"
            :items="entry.contextMenuItems"
            @select="handleContextMenuSelect($event, entry.context)"
          >
            <slot
              name="tab-label"
              :item="entry.item"
              :index="entry.index"
              :label="entry.label"
              :invalid="errorIndexes.includes(entry.key)"
            >
              <span
                :class="[
                  ns.e('tab-label'),
                  ns.is('error', errorIndexes.includes(entry.key)),
                ]"
              >
                {{ entry.label }}
                <span
                  v-if="errorIndexes.includes(entry.key)"
                  :class="ns.e('error-mark')"
                  role="img"
                  :aria-label="errorLabel"
                  >!</span
                >
              </span>
            </slot>
          </SContextMenu>

          <slot
            v-else
            name="tab-label"
            :item="entry.item"
            :index="entry.index"
            :label="entry.label"
            :invalid="errorIndexes.includes(entry.key)"
          >
            <span
              :class="[
                ns.e('tab-label'),
                ns.is('error', errorIndexes.includes(entry.key)),
              ]"
            >
              {{ entry.label }}
              <span
                v-if="errorIndexes.includes(entry.key)"
                :class="ns.e('error-mark')"
                role="img"
                :aria-label="errorLabel"
                >!</span
              >
            </span>
          </slot>
        </template>

        <Form
          :ref="(instance) => setFormRef(entry.key, instance)"
          v-bind="entry.setting"
          :model="entry.item as FormModel"
          @validate="
            (field, valid, message) =>
              handleFieldValidate(entry.key, field, valid, message)
          "
        >
          <template v-for="slotName in formSlotNames" #[slotName]="slotProps">
            <slot
              :name="slotName"
              v-bind="slotProps || {}"
              :group="entry.item"
              :group-index="entry.index"
            />
          </template>
        </Form>
      </STab>
    </STabs>

    <div v-else :class="ns.e('empty')">
      <slot name="empty">{{ emptyText }}</slot>
      <SButton
        v-if="showAdd"
        :class="ns.e('empty-add')"
        type="border"
        size="small"
        :debounce="false"
        :disabled="!canAdd || adding"
        :loading="adding"
        @click="addItem"
      >
        +
        <span>{{ tabLabel }}</span>
      </SButton>
    </div>
  </section>
</template>
