import { describe, expect, it } from 'vitest'
import { SLayout } from '@vuesax-alpha/components/layout'
import Components from '../component'

describe('full component installer', () => {
  it('includes the standard Layout application shell', () => {
    expect(Components).toContain(SLayout)
  })
})
