import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const archive = path.resolve(process.argv[2] || '')
assert.ok(process.argv[2], 'Pass the npm tarball path; run from its complete staging directory')
const root = process.cwd()
const files = []
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.npmignore'].includes(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await collect(absolute)
    else if (entry.isFile() && !entry.name.endsWith('.tgz')) {
      files.push(path.relative(root, absolute).replaceAll('\\', '/'))
    } else if (entry.isSymbolicLink()) throw new Error(`Staging contains a symbolic link: ${absolute}`)
  }
}
await collect(root)
const entries = new Set(execFileSync('tar', ['-tf', archive], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim().split(/\r?\n/))
const missing = files.filter(file => !entries.has(`package/${file}`))
assert.equal(missing.length, 0, `Archive is incomplete (${missing.length} missing files): ${missing.slice(0, 12).join(', ')}`)
assert.equal(entries.size, files.length, 'Archive and staging must contain the same file set')
const verbose = execFileSync('tar', ['-tvf', archive], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
assert.doesNotMatch(verbose, /^[hl]| link to /m, 'Archive must contain ordinary files, not links')
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
for (const entry of [manifest.main, manifest.module, manifest.types]) {
  assert.ok(entries.has(`package/${entry.replace(/^\.\//, '')}`), `Missing public entry: ${entry}`)
}
console.log(`Verified ${files.length} packed files, ESM/CJS/type entries, and no links for ${manifest.name}@${manifest.version}`)
