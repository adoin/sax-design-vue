import { spawn } from 'node:child_process'
import path from 'node:path'
import { readDevScope } from '../docs/.vuepress/node/devScope'

const project = path.resolve(import.meta.dirname, '..')
const docs = path.join(project, 'docs')
const args = process.argv.slice(2).filter((arg) => arg !== '--')
const env = { ...process.env }
const forwarded: string[] = []
for (let index = 0; index < args.length; index++) {
  const option = args[index]
  const match = /^(--component|--locale)(?:=(.*))?$/.exec(option)
  if (match) {
    const value = match[2] ?? args[++index]
    if (!value || value.startsWith('--'))
      throw new Error(`Missing value for ${match[1]}`)
    env[
      match[1] === '--component'
        ? 'SAX_DOCS_DEV_COMPONENT'
        : 'SAX_DOCS_DEV_LOCALE'
    ] = value
  } else forwarded.push(option)
}
const scope = readDevScope(docs, env)
env.SAX_DOCS_DEV_STARTED = String(Date.now())
console.log(
  `[docs-dev] ${scope.component || 'all components'} / ${scope.locale}`,
)
const child = spawn(
  process.execPath,
  [
    path.join(docs, 'node_modules/vuepress/bin/vuepress.js'),
    'dev',
    ...forwarded,
  ],
  { cwd: docs, env, stdio: 'inherit', windowsHide: true },
)
child.on('error', (error) => {
  console.error(error)
  process.exitCode = 1
})
child.on('exit', (code) => {
  process.exitCode = code ?? 0
})
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => child.kill(signal))
