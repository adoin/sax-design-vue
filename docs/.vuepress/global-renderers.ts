import { h } from 'vue'
import { SInput } from '@vuesax-alpha/components/input'
import { renderer } from '@vuesax-alpha/components/form'

/** Documentation-site renderer registered once from the application entry. */
renderer.add('$uppercaseInput', {
  renderFormItem: (options, params) =>
    h(SInput, {
      ...options.props,
      modelValue: params.value,
      'onUpdate:modelValue': (value: string | number) =>
        params.setValue(String(value).toUpperCase()),
    }),
})
