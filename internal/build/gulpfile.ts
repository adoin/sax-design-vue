import path from 'path'
import { copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import fg from 'fast-glob'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  projRoot,
  vsOutput,
  vsPackage,
} from '@vuesax-alpha/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'
import type { TaskFunction } from 'gulp'
import type { Module } from './src'

type DependencySection = Record<string, string> | undefined

const normalizeWorkspaceDependencies = async () => {
  const manifest = JSON.parse(await readFile(vsPackage, 'utf8'))
  const workspaceManifests = await fg('packages/*/package.json', {
    cwd: projRoot,
    absolute: true,
    onlyFiles: true,
  })
  const versions = new Map<string, string>()

  for (const filename of workspaceManifests) {
    const workspaceManifest = JSON.parse(await readFile(filename, 'utf8'))
    if (workspaceManifest.name && workspaceManifest.version) {
      versions.set(workspaceManifest.name, workspaceManifest.version)
    }
  }

  const normalizeSection = (dependencies: DependencySection) => {
    if (!dependencies) return
    for (const [name, range] of Object.entries(dependencies)) {
      if (!range.startsWith('workspace:')) continue
      const version = versions.get(name)
      if (!version) {
        throw new Error(`Cannot resolve workspace dependency ${name}`)
      }
      const workspaceRange = range.slice('workspace:'.length)
      dependencies[name] =
        workspaceRange === '^'
          ? `^${version}`
          : workspaceRange === '~'
            ? `~${version}`
            : version
    }
  }

  normalizeSection(manifest.dependencies)
  normalizeSection(manifest.optionalDependencies)
  normalizeSection(manifest.peerDependencies)

  await writeFile(
    path.join(vsOutput, 'package.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
}

export const copyFiles = () =>
  Promise.all([
    normalizeWorkspaceDependencies(),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(vsOutput, 'README.md'),
    ),
    copyFile(
      path.resolve(projRoot, 'global.d.ts'),
      path.resolve(vsOutput, 'global.d.ts'),
    ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true }),
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(vsOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(vsOutput, 'theme-chalk/index.css'),
    path.resolve(vsOutput, 'dist/index.css'),
  )
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(vsOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    runTask('buildHelper'),
    runTask('buildExtensionHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build'),
      ),
      copyFullStyle,
    ),
  ),

  parallel(copyTypesDefinitions, copyFiles),
) as any

export * from './src'
