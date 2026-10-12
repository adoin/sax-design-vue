import { readFile, writeFile } from 'node:fs/promises'

const [tag, output] = process.argv.slice(2)
if (!tag || !output)
  throw new Error('Usage: node scripts/release-notes.mjs <tag> <output>')
const version = tag.replace(/^v/, '')
if (!/^\d+\.\d+\.\d+$/.test(version))
  throw new Error(`Invalid release version: ${tag}`)
const changelog = await readFile('CHANGELOG.md', 'utf8')
const lines = changelog.split(/\r?\n/)
const start = lines.findIndex(
  (line) => line.startsWith(`### ${version} `) || line === `### ${version}`,
)
if (start < 0) throw new Error(`No changelog entry for ${version}`)
const next = lines.findIndex(
  (line, index) => index > start && line.startsWith('### '),
)
const notes = lines
  .slice(start + 1, next < 0 ? undefined : next)
  .join('\n')
  .trim()
if (!notes) throw new Error(`Empty changelog entry for ${version}`)
await writeFile(output, `${notes}\n`)
console.log(`Release notes ready for ${version}`)
