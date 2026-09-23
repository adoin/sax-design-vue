import { describe, expect, it } from 'vitest'
import { planBreadcrumbOverflow } from '../src/breadcrumb-overflow'

describe('Breadcrumb overflow layout', () => {
  it('keeps every level when it fits or cannot collapse a middle level', () => {
    expect(planBreadcrumbOverflow([70, 80, 90], 300, 38)).toEqual({
      collapsed: false,
      prefixCount: 3,
      suffixCount: 0,
    })
    expect(planBreadcrumbOverflow([170, 190], 220, 38)).toEqual({
      collapsed: false,
      prefixCount: 2,
      suffixCount: 0,
    })
  })

  it('preserves the first and last levels in a very narrow container', () => {
    expect(planBreadcrumbOverflow([120, 130, 140, 150], 180, 42)).toEqual({
      collapsed: true,
      prefixCount: 1,
      suffixCount: 1,
    })
  })

  it('uses spare width for levels next to the tail and head', () => {
    expect(planBreadcrumbOverflow([80, 90, 90, 90, 90, 100], 410, 40)).toEqual({
      collapsed: true,
      prefixCount: 2,
      suffixCount: 2,
    })
  })

  it('recalculates when a title becomes wider', () => {
    const short = planBreadcrumbOverflow([70, 70, 70, 80], 300, 38)
    const long = planBreadcrumbOverflow([70, 210, 70, 80], 300, 38)

    expect(short.collapsed).toBe(false)
    expect(long).toEqual({
      collapsed: true,
      prefixCount: 1,
      suffixCount: 2,
    })
  })
})
