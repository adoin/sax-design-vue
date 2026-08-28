import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

type SourceSlot = 'template' | 'script' | 'style'

interface SfcBlockRange {
  slot: SourceSlot
  start: number
  end: number
}

const projectRoot = resolve(import.meta.dirname, '..')
const docsRoots = [
  resolve(projectRoot, 'docs/components'),
  resolve(projectRoot, 'docs/zh/components'),
]
const shouldWrite = process.argv.includes('--write')
const sourceSlotPattern =
  /\n?<template #(template|script|style)>\s*[\s\S]*?\s*<\/template>\s*/g
const codeIncludePattern = /@\[code(?:\{\d+-\d+\})?[^\]]*\]\(([^)]+)\)/g

const findSfcBlockRanges = (source: string): SfcBlockRange[] => {
  const blockPattern = /^<(template|script|style)(?:\s[^>]*)?>[\s\S]*?^<\/\1>/gm

  return Array.from(source.matchAll(blockPattern)).map((match) => {
    const start = source.slice(0, match.index).split(/\r?\n/).length
    const end = start + match[0].split(/\r?\n/).length - 1
    return { slot: match[1] as SourceSlot, start, end }
  })
}

const normalizeCard = (
  markdownPath: string,
  card: string,
): { card: string; changed: boolean; skipped?: string } => {
  if (!card.includes('<template #example>')) {
    return { card, changed: false }
  }

  const sourceSlots = Array.from(card.matchAll(sourceSlotPattern))
  if (!sourceSlots.length) {
    return { card, changed: false, skipped: 'missing source slots' }
  }

  const includePaths = sourceSlots.flatMap((slot) =>
    Array.from(slot[0].matchAll(codeIncludePattern), (match) => match[1]),
  )
  const uniquePaths = [...new Set(includePaths)]
  if (uniquePaths.length !== 1 || !uniquePaths[0].endsWith('.vue')) {
    return {
      card,
      changed: false,
      skipped: `expected one Vue source, found ${uniquePaths.length}`,
    }
  }

  const relativePath = uniquePaths[0]
  const sourcePath = resolve(dirname(markdownPath), relativePath)
  const source = readFileSync(sourcePath, 'utf8')
  const ranges = findSfcBlockRanges(source)
  if (!ranges.some((range) => range.slot === 'template')) {
    return { card, changed: false, skipped: 'source has no template block' }
  }

  const generatedSlots = (['template', 'script', 'style'] as const)
    .map((slot) => {
      const blocks = ranges.filter((range) => range.slot === slot)
      if (!blocks.length) return ''

      const includes = blocks
        .map((block) => `@[code{${block.start}-${block.end}}](${relativePath})`)
        .join('\n')
      return `<template #${slot}>\n\n${includes}\n\n</template>`
    })
    .filter(Boolean)
    .join('\n\n')

  const firstSourceSlot = sourceSlots[0]
  const sourceStart = firstSourceSlot.index!
  const withoutSourceSlots = card.replace(sourceSlotPattern, '\n')
  const insertionPoint = Math.min(sourceStart, withoutSourceSlots.length)
  const normalized = `${withoutSourceSlots.slice(0, insertionPoint).trimEnd()}\n\n${generatedSlots}\n\n${withoutSourceSlots.slice(insertionPoint).trimStart()}`

  return { card: normalized, changed: normalized !== card }
}

let pageCount = 0
let changedPageCount = 0
let changedExampleCount = 0
const skipped: string[] = []

for (const docsRoot of docsRoots) {
  for (const fileName of readdirSync(docsRoot).filter((file) =>
    file.endsWith('.md'),
  )) {
    pageCount += 1
    const markdownPath = resolve(docsRoot, fileName)
    const markdown = readFileSync(markdownPath, 'utf8')
    let pageChanged = false
    const normalized = markdown.replace(
      /<card[^>]*>[\s\S]*?<\/card>/g,
      (card) => {
        const result = normalizeCard(markdownPath, card)
        if (result.skipped) {
          const heading =
            card.match(/^#{2,3}\s+(.+)$/m)?.[1] || 'unnamed example'
          skipped.push(`${markdownPath} | ${heading} | ${result.skipped}`)
        }
        if (result.changed) {
          pageChanged = true
          changedExampleCount += 1
        }
        return result.card
      },
    )

    if (pageChanged) {
      changedPageCount += 1
      if (shouldWrite) writeFileSync(markdownPath, normalized)
    }
  }
}

console.log(
  JSON.stringify(
    {
      mode: shouldWrite ? 'write' : 'dry-run',
      pages: pageCount,
      changedPages: changedPageCount,
      changedExamples: changedExampleCount,
      skippedExamples: skipped.length,
    },
    null,
    2,
  ),
)
if (skipped.length) {
  console.log('\nSKIPPED')
  skipped.forEach((item) => console.log(item))
}
