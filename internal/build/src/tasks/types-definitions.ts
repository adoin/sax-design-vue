import process from 'process'
import path from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'
import consola from 'consola'
import * as vueCompiler from 'vue/compiler-sfc'
import glob from 'fast-glob'
import chalk from 'chalk'
import { Project } from 'ts-morph'
import {
  buildOutput,
  excludeFiles,
  pkgRoot,
  projRoot,
  vsRoot,
} from '@vuesax-alpha/build-utils'
import { pathRewriter } from '../utils'
import type { CompilerOptions, Diagnostic, SourceFile } from 'ts-morph'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json')
const outDir = path.resolve(buildOutput, 'types')

const normalizeDeclarationText = (source: string) =>
  source.replace(/\(event:/g, '(_event:')

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false,
    noUnusedLocals: false,
  }
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const sourceFiles = await addSourceFiles(project)
  consola.success('Added source files')

  typeCheck(project)
  consola.success('Type check passed!')

  await project.emit({
    emitOnlyDtsFiles: true,
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`,
      ),
    )

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await mkdir(path.dirname(filepath), {
        recursive: true,
      })

      await writeFile(
        filepath,
        normalizeDeclarationText(pathRewriter('esm')(outputFile.getText())),
        'utf8',
      )

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`,
        ),
      )
    })

    await Promise.all(subTasks)
  })

  await Promise.all(tasks)
}

async function addSourceFiles(project: Project) {
  project.addSourceFileAtPath(path.resolve(projRoot, 'typings/env.d.ts'))

  const globSourceFile = '**/*.{js?(x),ts?(x),vue}'
  const filePaths = excludeFiles(
    await glob(
      [globSourceFile, '!**/*.d.ts', '!sax-design-vue/**/*', '!iconify/**/*'],
      {
        cwd: pkgRoot,
        absolute: true,
        onlyFiles: true,
      },
    ),
  )
  const vsPaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: vsRoot,
      onlyFiles: true,
    }),
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const hasTsNoCheck = content.includes('@ts-nocheck')

        const sfc = vueCompiler.parse(
          content,
          path.basename(file) === 'table-column.vue'
            ? { filename: file }
            : undefined,
        )
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          if (scriptSetup) {
            const useOpaqueComponentType = [
              'date-picker.vue',
              'sizes.vue',
              'table-column-manager.vue',
              'table-find-panel.vue',
              'table-query-form.vue',
              'time-select.vue',
            ].includes(path.basename(file))
            const skipSyntheticCheck = ['form-group.vue'].includes(
              path.basename(file),
            )
            let content =
              (hasTsNoCheck || skipSyntheticCheck ? '// @ts-nocheck\n' : '') +
              (script?.content ?? '')
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
              ...(useOpaqueComponentType
                ? { genDefaultAs: '__sfc_component__' }
                : {}),
            })
            content += compiled.content
            if (useOpaqueComponentType) {
              // These SFCs compose many imported components. Their
              // inferred default type exceeds TypeScript's declaration limit;
              // their public contracts remain exported from their modules.
              content +=
                "\nimport type { DefineComponent } from 'vue'\nexport default __sfc_component__ as unknown as DefineComponent\n"
            }
            const lang = scriptSetup.lang || script?.lang || 'js'
            const sourceFile = project.createSourceFile(
              `${path.relative(process.cwd(), file)}.${lang}`,
              content,
            )
            sourceFiles.push(sourceFile)
          } else if (script) {
            const content =
              (hasTsNoCheck ? '// @ts-nocheck\n' : '') + script.content
            const lang = script.lang || 'js'
            const sourceFile = project.createSourceFile(
              `${path.relative(process.cwd(), file)}.${lang}`,
              content,
            )
            sourceFiles.push(sourceFile)
          }
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...vsPaths.map(async (file) => {
      const content = await readFile(path.resolve(vsRoot, file), 'utf-8')
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content),
      )
    }),
  ])

  return sourceFiles
}

function typeCheck(project: Project) {
  const diagnostics = project
    .getPreEmitDiagnostics()
    .filter((diagnostic: Diagnostic) => {
      const filename = diagnostic.getSourceFile()?.getFilePath()
      return !filename?.endsWith('.vue.ts')
    })
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }
}
