import { defineComponent, inject } from 'vue'
import { formContextKey } from './constants'
import { renderFormItemRenderer } from './renderer'
import type { PropType } from 'vue'
import type { FormItemConfig } from './form'
import type { FormItemRenderOptions, FormRendererParams } from './renderer'

export default defineComponent({
  name: 'SFormRenderer',
  props: {
    item: {
      type: Object as PropType<FormItemConfig>,
      required: true,
    },
    render: {
      type: Object as PropType<FormItemRenderOptions>,
      required: true,
    },
    controlId: String,
  },
  setup(props) {
    const form = inject(formContextKey)

    return () => {
      const field = props.item.prop ?? props.item.field
      const params: FormRendererParams = {
        model: form?.model.value || {},
        field,
        prop: field,
        value: field ? form?.getValue(field) : undefined,
        item: props.item,
        disabled:
          typeof props.item.disabled === 'function'
            ? props.item.disabled(form?.model.value || {})
            : (props.item.disabled ?? form?.disabled.value ?? false),
        readonly:
          typeof props.item.readonly === 'function'
            ? props.item.readonly(form?.model.value || {})
            : (props.item.readonly ?? form?.readonly.value ?? false),
        controlId: props.controlId,
        setValue: (value) => {
          if (field) form?.setValue(field, value)
        },
        validate: (trigger) =>
          field
            ? (form?.validateField(field, trigger) ?? Promise.resolve(true))
            : Promise.resolve(true),
      }
      return renderFormItemRenderer(props.render, params)
    }
  },
})
