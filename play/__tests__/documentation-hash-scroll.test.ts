// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createDocumentationHashScrollBehavior,
  documentationRouterHashOffset,
  waitForDocumentationHashTarget,
} from '../../docs/.vuepress/theme/shared/documentationHashScroll'
import type { RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'

const appended: HTMLElement[] = []
const heading = (id: string) => {
  const element = document.createElement('h3')
  element.id = id
  document.body.append(element)
  appended.push(element)
  return element
}
const route = (hash: string) =>
  ({ hash, fullPath: `/guide${hash}` }) as RouteLocationNormalized

afterEach(() => {
  appended.splice(0).forEach((element) => element.remove())
  vi.restoreAllMocks()
})

describe('documentation hash scroll', () => {
  it('returns a mounted target immediately and waits for a delayed heading', async () => {
    const mounted = heading('already-mounted')
    expect(
      waitForDocumentationHashTarget('#already-mounted', () => true),
    ).toEqual({
      el: mounted,
      top: documentationRouterHashOffset,
    })
    const pending = waitForDocumentationHashTarget(
      '#finding-in-generated-data',
      () => true,
      1000,
      10,
    )
    const delayed = heading('finding-in-generated-data')
    expect(await pending).toEqual({
      el: delayed,
      top: documentationRouterHashOffset,
    })
  })

  it('avoids a missing selector and cancels a stale navigation', async () => {
    expect(
      await waitForDocumentationHashTarget(
        '#missing-heading',
        () => true,
        10,
        1,
      ),
    ).toEqual({ top: 0 })
    let current = true
    const pending = waitForDocumentationHashTarget(
      '#stale-heading',
      () => current,
      1000,
      10,
    )
    current = false
    heading('unrelated-heading')
    expect(await pending).toBe(false)
  })

  it('preserves native saved-position and non-hash behavior', async () => {
    const original = vi.fn(() => ({ top: 12 })) as RouterScrollBehavior
    const behavior = createDocumentationHashScrollBehavior(original, () => true)
    expect(behavior(route(''), route(''), null)).toEqual({ top: 12 })
    expect(behavior(route('#missing'), route(''), { top: 34 })).toEqual({
      top: 12,
    })
    window.history.replaceState(null, '', '#deferred-heading')
    const pending = behavior(route('#deferred-heading'), route(''), null)
    const target = heading('deferred-heading')
    expect(await pending).toEqual({
      el: target,
      top: documentationRouterHashOffset,
    })
    window.history.replaceState(null, '', '#')
  })
})
