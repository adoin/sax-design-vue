<script lang="ts" setup>
import { computed, inject } from 'vue'
import FormItem from './form-item.vue'
import FormRenderer from './form-renderer'
import { formContextKey } from './constants'
import type { PropType } from 'vue'
import type { FormItemConfig } from './form'

defineOptions({ name: 'SFormConfigItem' })

const props = defineProps({
  item: {
    type: Object as PropType<FormItemConfig>,
    required: true,
  },
})

const form = inject(formContextKey)
const field = computed(() => props.item.prop ?? props.item.field)
const label = computed(() => props.item.label ?? props.item.title ?? '')
const children = computed(() => props.item.children || [])
const hasChildren = computed(() => children.value.length > 0)
const isVisible = computed(() => {
  if (props.item.visible === false) return false
  return props.item.visibleMethod
    ? props.item.visibleMethod({
        model: form?.model.value || {},
        item: props.item,
      })
    : true
})
const slotParams = computed(() => ({
  model: form?.model.value || {},
  item: props.item,
  field: field.value,
  prop: field.value,
  value: field.value ? form?.getValue(field.value) : undefined,
  disabled:
    typeof props.item.disabled === 'function'
      ? props.item.disabled(form?.model.value || {})
      : (props.item.disabled ?? form?.disabled.value ?? false),
  readonly:
    typeof props.item.readonly === 'function'
      ? props.item.readonly(form?.model.value || {})
      : (props.item.readonly ?? form?.readonly.value ?? false),
  setValue: (value: unknown) => {
    if (field.value) form?.setValue(field.value, value)
  },
}))

const getItemKey = (item: FormItemConfig, index: number) =>
  item.key ?? item.prop ?? item.field ?? index
</script>

<template>
  <FormItem
    v-if="isVisible"
    :class="item.class"
    :style="item.style"
    :label="label"
    :prop="field"
    :description="item.description"
    :rules="item.rules"
    :required="item.required"
    :label-width="item.labelWidth"
    :label-position="item.labelPosition"
    :span="item.span ?? 24"
    :vertical="item.vertical ?? hasChildren"
    :nested="item.nested ?? hasChildren"
    :align="item.align"
    :reserve-error-space="item.reserveErrorSpace"
    :disabled="typeof item.disabled === 'boolean' ? item.disabled : undefined"
    :readonly="typeof item.readonly === 'boolean' ? item.readonly : undefined"
  >
    <template v-if="item.slots?.label" #label="labelParams">
      <slot
        :name="item.slots.label"
        v-bind="{ ...slotParams, ...labelParams }"
      />
    </template>

    <template #default="{ id }">
      <div v-if="hasChildren" class="s-form-item__children">
        <FormConfigItem
          v-for="(child, index) in children"
          :key="getItemKey(child, index)"
          :item="child"
        >
          <template
            v-for="(_, slotName) in $slots"
            #[slotName]="childSlotParams"
          >
            <slot :name="slotName" v-bind="childSlotParams || {}" />
          </template>
        </FormConfigItem>
      </div>
      <slot
        v-else-if="item.slots?.default"
        :name="item.slots.default"
        v-bind="{ ...slotParams, id }"
      />
      <FormRenderer
        v-else-if="item.itemRender"
        :item="item"
        :render="item.itemRender"
        :control-id="id"
      />
    </template>

    <template v-if="item.slots?.error" #error="errorParams">
      <slot
        :name="item.slots.error"
        v-bind="{ ...slotParams, ...errorParams }"
      />
    </template>
  </FormItem>
</template>
