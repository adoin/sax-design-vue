import process from 'node:process'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import consola from 'consola'
import glob from 'fast-glob'
import { buildOutput, projRoot } from '@vuesax-alpha/build-utils'
import {
  declarationOutputPath,
  normalizeDeclaration,
} from '../utils/declarations'

const require = createRequire(import.meta.url)
const outDir = path.resolve(buildOutput, 'types')
const rawDir = path.resolve(buildOutput, 'types-raw')

/** Use Vue's public SFC contract (props, emits, slots and exposes), never setup internals. */
export const generateTypesDefinitions = async () => {
  for (const directory of [rawDir, outDir]) {
    if (
      !path
        .resolve(directory)
        .startsWith(`${path.resolve(buildOutput)}${path.sep}`)
    )
      throw new Error('Unsafe declaration output directory')
    await rm(directory, { recursive: true, force: true })
  }
  const cli = require.resolve('vue-tsc/bin/vue-tsc.js', { paths: [projRoot] })
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        cli,
        '--project',
        path.resolve(projRoot, 'tsconfig.declarations.json'),
        '--outDir',
        rawDir,
      ],
      {
        cwd: projRoot,
        stdio: 'inherit',
        windowsHide: true,
      },
    )
    child.once('error', reject)
    child.once('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Vue declaration generation failed: ${code}`)),
    )
  })
  const packages = path.join(rawDir, 'packages')
  const files = await glob('**/*.d.ts', { cwd: packages, onlyFiles: true })
  const targets = new Set<string>()
  let bytes = 0
  await Promise.all(
    files.map(async (relative) => {
      const output = declarationOutputPath(relative)
      if (targets.has(output))
        throw new Error(`Duplicate declaration output: ${output}`)
      targets.add(output)
      const destination = path.resolve(outDir, 'packages', output)
      const source = normalizeDeclaration(
        await readFile(path.join(packages, relative), 'utf8'),
      )
      bytes += Buffer.byteLength(source)
      await mkdir(path.dirname(destination), { recursive: true })
      await writeFile(destination, source)
    }),
  )
  consola.success(
    `Generated ${files.length} public declarations (${bytes} bytes)`,
  )
}
