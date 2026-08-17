import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from '../src/card.vue'

describe('Card content', () => {
  it('renders title and text props with card content classes', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Trendy clothing',
        text: 'A concise card description.',
      },
    })

    expect(wrapper.get('.s-card__title-text').text()).toBe('Trendy clothing')
    expect(wrapper.get('.s-card__description').text()).toBe(
      'A concise card description.',
    )
  })

  it('renders a title prop without requiring body text', () => {
    const wrapper = mount(Card, { props: { title: 'Title only' } })

    expect(wrapper.get('.s-card__text').exists()).toBe(true)
    expect(wrapper.get('.s-card__title-text').text()).toBe('Title only')
  })

  it('gives named slots precedence over content props', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Prop title',
        text: 'Prop text',
      },
      slots: {
        title: '<h2 class="slot-title">Slot title</h2>',
        text: '<p class="slot-text">Slot text</p>',
      },
    })

    expect(wrapper.get('.slot-title').text()).toBe('Slot title')
    expect(wrapper.get('.slot-text').text()).toBe('Slot text')
    expect(wrapper.find('.s-card__title-text').exists()).toBe(false)
    expect(wrapper.find('.s-card__description').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Prop title')
    expect(wrapper.text()).not.toContain('Prop text')
  })
})
