import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { useZIndex } from '@vuesax-alpha/hooks'
import Notification from '../../notification/src/notification.vue'
import Loading from '../../loading/src/loading.vue'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

const allocator = () => {
  let raise!: () => number
  wrappers.push(
    mount(
      defineComponent({
        setup() {
          raise = useZIndex().nextZIndex
          return () => null
        },
      }),
    ),
  )
  return () => raise()
}

describe('Overlay layer isolation', () => {
  it('does not restyle existing notifications or loading surfaces when unrelated layers open', async () => {
    const raise = allocator()
    const loading = mount(Loading, { props: { type: 'waves' } })
    const notice = mount(Notification, {
      props: { duration: 0, title: 'Saved' },
    })
    wrappers.push(loading, notice)
    await nextTick()
    const loadingLayer = (loading.get('.s-loading').element as HTMLElement)
      .style.zIndex
    const noticeLayer = (notice.get('.s-notification').element as HTMLElement)
      .style.zIndex
    for (let index = 0; index < 50; index++) raise()
    await nextTick()
    expect(
      (loading.get('.s-loading').element as HTMLElement).style.zIndex,
    ).toBe(loadingLayer)
    expect(
      (notice.get('.s-notification').element as HTMLElement).style.zIndex,
    ).toBe(noticeLayer)
    expect(Number(noticeLayer)).toBeGreaterThan(Number(loadingLayer))
  })

  it('only raises the notification explicitly reopened', async () => {
    const first = mount(Notification, {
      props: { duration: 0, title: 'First' },
    })
    const second = mount(Notification, {
      props: { duration: 0, title: 'Second' },
    })
    wrappers.push(first, second)
    await nextTick()
    const layer = (wrapper: ReturnType<typeof mount>) =>
      Number(
        (wrapper.get('.s-notification').element as HTMLElement).style.zIndex,
      )
    const secondLayer = layer(second)
    expect(secondLayer).toBeGreaterThan(layer(first))
    first.vm.open()
    await nextTick()
    expect(layer(first)).toBeGreaterThan(secondLayer)
    expect(layer(second)).toBe(secondLayer)
  })
})
