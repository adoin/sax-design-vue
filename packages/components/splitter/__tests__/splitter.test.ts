import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SplitterItem from '../src/splitter-item.vue'
import Splitter from '../src/splitter.vue'
import {
  normalizeSplitterGap,
  normalizeSplitterGroup,
  quantizeSplitterSizes,
  resolveSplitterSizes,
  updateSplitterPair,
} from '../src/splitter'

import type { SplitterModelValue } from '../src/splitter'

const nestedModel = (): SplitterModelValue => ({
  type: 'vertical',
  size: [
    {
      type: 'horizontal',
      size: [0.3, 0.4, 'rest'],
    },
    'rest',
  ],
})

const mountNestedSplitter = () =>
  mount(Splitter, {
    props: { modelValue: nestedModel() },
    slots: {
      default: () => [
        h(
          SplitterItem,
          {},
          {
            default: () => [
              h(SplitterItem, {}, () => 'Explorer'),
              h(SplitterItem, {}, () => 'Editor'),
              h(SplitterItem, { useRest: true }, () => 'Preview'),
            ],
          },
        ),
        h(SplitterItem, { useRest: true }, () => 'Console'),
      ],
    },
  })

describe('Splitter model', () => {
  it('normalizes one-value and grid-style row/column gaps', () => {
    expect(normalizeSplitterGap(8)).toEqual({
      rowGap: '8px',
      columnGap: '8px',
    })
    expect(normalizeSplitterGap([6, 0])).toEqual({
      rowGap: '6px',
      columnGap: '0px',
    })
  })

  it('shares remaining space and normalizes explicit ratios', () => {
    const sizes = resolveSplitterSizes([0.3, 0.4, 'rest'], 3)
    expect(sizes[0]).toBeCloseTo(0.3)
    expect(sizes[1]).toBeCloseTo(0.4)
    expect(sizes[2]).toBeCloseTo(0.3)
    expect(resolveSplitterSizes([2, 1], 2)).toEqual([2 / 3, 1 / 3])
    expect(resolveSplitterSizes([], 4)).toEqual([0.25, 0.25, 0.25, 0.25])
  })

  it('updates only the selected nested pair without mutating input', () => {
    const model = nestedModel()
    const updated = updateSplitterPair(model, [0], 0, 0.35, 0.35)

    expect(updated).not.toBe(model)
    expect(updated.size[0]).not.toBe(model.size[0])
    expect((updated.size[0] as SplitterModelValue).size).toEqual([
      0.35,
      0.35,
      'rest',
    ])
    expect((model.size[0] as SplitterModelValue).size).toEqual([
      0.3,
      0.4,
      'rest',
    ])
  })

  it('stores a nested group parent ratio in its value field', () => {
    const model = nestedModel()
    const updated = updateSplitterPair(model, [], 0, 0.6, 0.4)

    expect((updated.size[0] as SplitterModelValue).value).toBe(0.6)
    expect(updated.size[1]).toBe(0.4)
  })

  it('recalculates mismatched item counts as quantized equal ratios', () => {
    const model: SplitterModelValue = {
      type: 'horizontal',
      size: [0.7, 'rest'],
    }
    const updated = normalizeSplitterGroup(model, [], 3, -1, 2)

    expect(updated.size).toEqual([0.33, 0.33, 0.34])
    expect(quantizeSplitterSizes([1, 1, 1], 2)).toEqual([0.33, 0.33, 0.34])
  })

  it('keeps only the item marked useRest as a permanent rest value', () => {
    const model: SplitterModelValue = {
      type: 'horizontal',
      size: ['rest', 'rest', 'rest'],
    }
    const updated = normalizeSplitterGroup(model, [], 3, 1, 2)

    expect(updated.size).toEqual([0.33, 'rest', 0.34])
    const resized = updateSplitterPair(updated, [], 0, 0.38, 0.28, 1)
    expect(resized.size).toEqual([0.38, 'rest', 0.34])
  })
})

describe('Splitter composition', () => {
  it('keeps a draggable separator while a directional gap is zero', async () => {
    const wrapper = mount(Splitter, {
      props: {
        modelValue: { type: 'horizontal', size: [0.5, 0.5] },
        gap: [6, 0],
      },
      slots: {
        default: () => [
          h(SplitterItem, {}, () => 'One'),
          h(SplitterItem, {}, () => 'Two'),
        ],
      },
    })

    await nextTick()

    expect(wrapper.attributes('style')).toContain('--s-splitter-row-gap: 6px')
    expect(wrapper.attributes('style')).toContain(
      '--s-splitter-column-gap: 0px',
    )
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
  })

  it('synchronizes equal numeric ratios when data and items do not match', async () => {
    const wrapper = mount(Splitter, {
      props: {
        modelValue: { type: 'horizontal', size: [0.8] },
      },
      slots: {
        default: () => [
          h(SplitterItem, {}, () => 'One'),
          h(SplitterItem, {}, () => 'Two'),
          h(SplitterItem, {}, () => 'Three'),
        ],
      },
    })

    await nextTick()
    await nextTick()

    const updates = wrapper.emitted('update:modelValue') ?? []
    const update = updates.at(-1)?.[0] as SplitterModelValue
    expect(update.size).toEqual([0.33, 0.33, 0.34])
  })

  it('renders arbitrary nested regions and one separator per adjacent pair', async () => {
    const wrapper = mountNestedSplitter()
    await nextTick()

    expect(wrapper.findAll('.s-splitter__panel')).toHaveLength(5)
    expect(wrapper.findAll('[role="separator"]')).toHaveLength(3)
    expect(wrapper.find('.s-splitter__group--vertical').exists()).toBe(true)
    expect(wrapper.find('.s-splitter__group--horizontal').exists()).toBe(true)
  })

  it('updates the full model tree with the keyboard', async () => {
    const wrapper = mountNestedSplitter()
    await nextTick()
    const firstNestedSeparator = wrapper.findAll('[role="separator"]')[0]

    await firstNestedSeparator.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    const updates = wrapper.emitted('update:modelValue') ?? []
    const update = updates.at(-1)?.[0] as SplitterModelValue | undefined
    const change = wrapper.emitted('change')?.[0]?.[0]

    expect(update).toBeDefined()
    expect((update?.size[0] as SplitterModelValue).size[0]).toBeCloseTo(0.31)
    expect((update?.size[0] as SplitterModelValue).size[1]).toBeCloseTo(0.39)
    expect(change).toEqual(update)
  })
})
