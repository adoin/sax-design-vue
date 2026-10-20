import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { describe, expect, it } from 'vitest'
import { compileDemoSfc } from '../compile-demo-sfc'

describe('Icon morph example source', () => {
  it.each(['', 'zh/'])(
    'reconstructs a complete localized Code/Playground SFC for %s',
    (locale) => {
      const page = resolve(__dirname, '../../docs', locale, 'icons/README.md')
      const markdown = readFileSync(page, 'utf8')
      const card = markdown.split('<h2 id="morphing">')[1].split('</card>')[0]
      const source = [...card.matchAll(/@\[code\{(\d+)-(\d+)\}\]\(([^)]+)\)/g)]
        .map((match) => {
          const [, start, end, relative] = match
          return readFileSync(resolve(dirname(page), relative), 'utf8')
            .split(/\r?\n/)
            .slice(Number(start) - 1, Number(end))
            .join('\n')
        })
        .join('\n\n')
      const parsed = parse(source)
      expect(parsed.errors).toEqual([])
      expect(parsed.descriptor.scriptSetup).not.toBeNull()
      expect(parsed.descriptor.template).not.toBeNull()
      expect(parsed.descriptor.styles).toHaveLength(1)
      expect(
        parsed.descriptor.template!.content.match(/<s-icon\b/g),
      ).toHaveLength(1)
      expect(source).not.toContain('const engines')
      expect(source).not.toMatch(/stress|setInterval|elapsed|onBeforeUnmount/)
      expect(source).toContain(locale ? '动画时长' : 'Duration')
      expect(source).toContain(locale ? '动画效果' : 'Animation style')
      expect(source).not.toMatch(
        /起点错位|全局配对|Procrustes|cubic subdivision/,
      )
      expect(compileDemoSfc(source, `morph-${locale || 'en'}`).error).toBeNull()
      expect(source).toContain(locale ? '切换图标' : 'Switch icon')
      expect(source).not.toContain(locale ? 'Switch icon' : '切换图标')
    },
  )
})
