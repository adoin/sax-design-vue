import { defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../src/icon.vue'
import { scopeIconData } from '../src/scope-svg'
import { readPaint } from '../src/morph/read-paint'
import type { SaxIconData } from '../src/icon'

const data: SaxIconData = {
  attributes: { viewBox: '0 0 24 24', 'aria-labelledby': 'title' },
  body: '<title id="title">Colored icon</title><defs><linearGradient id="paint"><stop offset="0" stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient><linearGradient id="next" href="#paint"/></defs><path data-id="record" fill="url(#next)" d="M0 0H24V24H0Z"/>',
}
describe('Icon paint integration', () => {
  it('scopes definitions, inherited hrefs and accessible references without changing input', () => {
    const result = scopeIconData(data, 'first')!
    expect(result.body).toContain('id="first-paint"')
    expect(result.body).toContain('href="#first-paint"')
    expect(result.body).toContain('fill="url(#first-next)"')
    expect(result.body).toContain('data-id="record"')
    expect(result.attributes['aria-labelledby']).toBe('first-title')
    expect(data.body).toContain('id="paint"')
  })
  it('uses distinct stable gradient IDs for simultaneously mounted icons', async () => {
    const wrapper = mount(
      defineComponent({
        props: { size: { type: Number, default: 24 } },
        setup: (props) => () =>
          h('div', [
            h(Icon, { iconData: data, size: props.size }),
            h(Icon, { iconData: data }),
          ]),
      }),
    )
    const ids = wrapper.findAll('linearGradient').map((n) => n.attributes('id'))
    expect(new Set(ids).size).toBe(4)
    const first = wrapper.find('linearGradient').attributes('id')
    await wrapper.setProps({ size: 40 })
    expect(wrapper.find('linearGradient').attributes('id')).toBe(first)
    wrapper.unmount()
  })
  it('generates scoped gradients during SSR without executing DOM adapters', async () => {
    const html = await renderToString(
      h(
        defineComponent({
          setup: () => () =>
            h('div', [
              h(Icon, { iconData: data, morph: true }),
              h(Icon, { iconData: data, morph: true }),
            ]),
        }),
      ),
    )
    const ids = [...html.matchAll(/<linearGradient id="([^"]+)"/g)].map(
      (m) => m[1],
    )
    expect(ids).toHaveLength(4)
    expect(new Set(ids).size).toBe(4)
  })
  it('reads real shared opacity and additive isolation groups instead of multiplying alpha', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML =
      '<g style="isolation:isolate"><g opacity=".5" style="opacity:.5;mix-blend-mode:plus-lighter"><path d="M0 0H10V10Z"/></g></g>'
    document.body.append(svg)
    const paint = readPaint(svg.querySelector('path')!, svg, {
      fill: 'red',
      opacity: '1',
    })
    expect(paint.groups!.map((g) => g.opacity)).toEqual([1, 0.5])
    expect(paint.groups![0].isolate).toBe(true)
    expect(paint.groups![1].blend).toBe('plus-lighter')
    svg.remove()
  })
})
