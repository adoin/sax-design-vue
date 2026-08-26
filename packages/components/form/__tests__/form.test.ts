import { defineComponent, h, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Form from '../src/form.vue'
import FormItem from '../src/form-item.vue'
import { formRenderer } from '../src/renderer'
import type { FormItemConfig } from '../src/form'

const TestInput = defineComponent({
  name: 'TestInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    id: String,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue', 'change'],
  template:
    '<input :id="id" :value="modelValue" :disabled="disabled" :readonly="readonly" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" @change="$emit(\'change\', $event.target.value)" />',
})

const mountForm = (
  model: Record<string, unknown>,
  items: FormItemConfig[],
  extraProps: Record<string, unknown> = {},
) =>
  mount(Form, {
    props: { model, items, ...extraProps },
    global: {
      components: { TestInput },
    },
  })

afterEach(() => {
  formRenderer.delete('ActionRenderer')
})

describe('Form schema renderer', () => {
  it('uses a four-character label width and right alignment by default', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm(model, [
      {
        field: 'name',
        title: '联系人姓名',
        required: true,
        itemRender: { name: 'TestInput' },
      },
    ])

    expect(wrapper.classes()).toContain('is-label-align-right')
    expect(wrapper.get('.s-form-item__label').attributes('style')).toContain(
      'width: calc(4em + 24px)',
    )
  })

  it('keeps explicit label width and alignment overrides', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm(
      model,
      [
        {
          field: 'name',
          title: '姓名',
          itemRender: { name: 'TestInput' },
        },
      ],
      { labelWidth: 120, labelAlign: 'left' },
    )

    expect(wrapper.classes()).toContain('is-label-align-left')
    expect(wrapper.get('.s-form-item__label').attributes('style')).toContain(
      'width: 120px',
    )
  })

  it('runs blur-trigger rules only after focus leaves the field', async () => {
    const model = reactive({ name: '' })
    const onValidate = vi.fn()
    const wrapper = mount(Form, {
      props: {
        model,
        rules: {
          name: { required: true, message: '失焦后必填', trigger: 'blur' },
        },
        onValidate,
      },
      slots: {
        default: () =>
          h(
            FormItem,
            { label: '姓名', prop: 'name' },
            {
              default: () =>
                h('input', {
                  value: model.name,
                  onInput: (event: Event) => {
                    model.name = (event.target as HTMLInputElement).value
                  },
                }),
            },
          ),
      },
    })

    expect(wrapper.find('.s-form-item__error').exists()).toBe(false)
    model.name = 'Ada'
    expect(onValidate).not.toHaveBeenCalled()

    model.name = ''
    await wrapper.get('input').trigger('focusout')

    expect(wrapper.get('.s-form-item__error').text()).toBe('失焦后必填')
    expect(onValidate).toHaveBeenCalledOnce()
    expect(onValidate).toHaveBeenLastCalledWith('name', false, '失焦后必填')
  })

  it('runs change-trigger rules for declarative and renderer fields', async () => {
    const declarativeModel = reactive({ name: 'Ada' })
    const declarativeValidate = vi.fn()
    const declarativeWrapper = mount(Form, {
      props: {
        model: declarativeModel,
        rules: {
          name: { required: true, message: '修改后必填', trigger: 'change' },
        },
        onValidate: declarativeValidate,
      },
      slots: {
        default: () =>
          h(
            FormItem,
            { label: '姓名', prop: 'name' },
            { default: () => h('input', { value: declarativeModel.name }) },
          ),
      },
    })

    declarativeModel.name = ''
    await declarativeWrapper.vm.$nextTick()
    expect(declarativeWrapper.get('.s-form-item__error').text()).toBe(
      '修改后必填',
    )
    expect(declarativeValidate).toHaveBeenCalledOnce()

    declarativeModel.name = 'Grace'
    await declarativeWrapper.vm.$nextTick()
    expect(declarativeWrapper.find('.s-form-item__error').exists()).toBe(false)
    expect(declarativeValidate).toHaveBeenCalledTimes(2)
    expect(declarativeValidate).toHaveBeenLastCalledWith('name', true, '')

    const rendererModel = reactive({ name: 'Lin' })
    const rendererValidate = vi.fn()
    const rendererWrapper = mountForm(
      rendererModel,
      [
        {
          field: 'name',
          title: '姓名',
          rules: {
            required: true,
            message: '渲染器修改后必填',
            trigger: 'change',
          },
          itemRender: { name: 'TestInput' },
        },
      ],
      { onValidate: rendererValidate },
    )

    rendererWrapper.getComponent(TestInput).vm.$emit('update:modelValue', '')
    await rendererWrapper.vm.$nextTick()

    expect(rendererWrapper.get('.s-form-item__error').text()).toBe(
      '渲染器修改后必填',
    )
    expect(rendererValidate).toHaveBeenCalledOnce()
  })

  it('renders nested items and writes renderer values to deep model paths', async () => {
    const model = reactive({ profile: { name: '' } })
    const wrapper = mountForm(model, [
      {
        title: '账户信息',
        children: [
          {
            field: 'profile.name',
            title: '姓名',
            span: 12,
            itemRender: {
              name: 'TestInput',
              props: { placeholder: '请输入姓名' },
            },
          },
        ],
      },
    ])

    const input = wrapper.getComponent(TestInput)
    expect(wrapper.find('.s-form-item.is-nested').exists()).toBe(true)
    expect(input.props('placeholder')).toBe('请输入姓名')
    expect(input.props('id')).toBeTruthy()
    expect(wrapper.get('label[for]').attributes('for')).toBe(input.props('id'))

    input.vm.$emit('update:modelValue', 'Ada')
    await wrapper.vm.$nextTick()

    expect(model.profile.name).toBe('Ada')
    expect(input.props('modelValue')).toBe('Ada')
  })

  it('keeps validation message space mounted before and after validation', async () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm(model, [
      {
        field: 'name',
        title: '姓名',
        rules: { required: true, message: '请输入姓名' },
        itemRender: { name: 'TestInput' },
      },
    ])

    const message = wrapper.get('.s-form-item__message')
    expect(message.text()).toBe('')
    expect(await wrapper.vm.validate()).toBe(false)
    expect(message.text()).toBe('请输入姓名')
    expect(message.find('[role="alert"]').exists()).toBe(true)

    wrapper.getComponent(TestInput).vm.$emit('update:modelValue', 'Grace')
    expect(await wrapper.vm.validateField('name')).toBe(true)
    expect(wrapper.get('.s-form-item__message').text()).toBe('')
  })

  it('supports custom global renderers with field-aware params', async () => {
    formRenderer.add('ActionRenderer', {
      renderItem: (_options, params) =>
        h(
          'button',
          {
            type: 'button',
            class: 'action-renderer',
            onClick: () => params.setValue('approved'),
          },
          `当前：${params.value || '待处理'}`,
        ),
    })
    const model = reactive({ status: '' })
    const wrapper = mountForm(model, [
      {
        field: 'status',
        title: '状态',
        itemRender: { name: 'ActionRenderer' },
      },
    ])

    expect(wrapper.get('.action-renderer').text()).toContain('待处理')
    await wrapper.get('.action-renderer').trigger('click')

    expect(model.status).toBe('approved')
    expect(wrapper.get('.action-renderer').text()).toContain('approved')
  })

  it('supports multi-level item trees, responsive spans, and reactive visibility', async () => {
    const model = reactive({ mode: 'simple', details: { city: '' } })
    const wrapper = mountForm(model, [
      {
        title: '基础设置',
        children: [
          {
            field: 'mode',
            title: '模式',
            itemRender: { name: 'TestInput' },
          },
          {
            title: '详细信息',
            children: [
              {
                field: 'details.city',
                title: '城市',
                span: { xs: 24, md: 12, xl: 8 },
                visibleMethod: ({ model: currentModel }) =>
                  currentModel.mode === 'advanced',
                itemRender: { name: 'TestInput' },
              },
            ],
          },
        ],
      },
    ])

    expect(wrapper.findAll('.s-form-item.is-nested')).toHaveLength(2)
    expect(wrapper.find('[data-prop="details.city"]').exists()).toBe(false)

    wrapper.getComponent(TestInput).vm.$emit('update:modelValue', 'advanced')
    await wrapper.vm.$nextTick()

    const cityItem = wrapper.get('[data-prop="details.city"]')
    expect(cityItem.attributes('style')).toContain(
      '--sax-form-item-span-md: 12',
    )
    expect(cityItem.attributes('style')).toContain('--sax-form-item-span-xl: 8')
  })

  it('passes renderer events their form params and component payload', async () => {
    const change = vi.fn()
    const model = reactive({ name: '' })
    const wrapper = mountForm(model, [
      {
        field: 'name',
        itemRender: {
          name: 'TestInput',
          events: { change },
        },
      },
    ])
    const input = wrapper.getComponent(TestInput)

    input.vm.$emit('change', 'Lin')
    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledOnce()
    expect(change.mock.calls[0]?.[0]).toMatchObject({
      field: 'name',
      model,
    })
    expect(change.mock.calls[0]?.[1]).toBe('Lin')
  })

  it('preserves the declarative FormItem API', async () => {
    const model = reactive({ email: '' })
    const wrapper = mount(Form, {
      props: { model, rules: { email: { required: true, message: '必填' } } },
      slots: {
        default: () =>
          h(
            FormItem,
            { label: '邮箱', prop: 'email' },
            { default: () => h('input', { value: model.email }) },
          ),
      },
    })

    expect(await wrapper.vm.validate()).toBe(false)
    expect(wrapper.get('.s-form-item__error').text()).toBe('必填')
  })

  it('restores cloned initial values for mutable nested fields', () => {
    const model = reactive({ settings: { tags: ['design'] } })
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => h(FormItem, { label: '标签', prop: 'settings.tags' }),
      },
    })

    model.settings.tags.push('vue')
    wrapper.vm.resetFields()
    expect(model.settings.tags).toEqual(['design'])

    model.settings.tags.push('typescript')
    wrapper.vm.resetFields()
    expect(model.settings.tags).toEqual(['design'])
  })
})
