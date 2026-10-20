import assert from 'node:assert/strict'
import {
  mkdtemp,
  mkdir,
  readdir,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const packageRoot = path.resolve(process.argv[2] || 'dist/sax-design-vue')
const fixture = await mkdtemp(path.join(repoRoot, 'dist', 'consumer-smoke-'))
await mkdir(path.join(fixture, 'node_modules'))
await symlink(
  packageRoot,
  path.join(fixture, 'node_modules/sax-design-vue'),
  process.platform === 'win32' ? 'junction' : 'dir',
)
for (const [format, extension] of [
  ['es', 'mjs'],
  ['lib', 'js'],
]) {
  const names = await readdir(path.join(packageRoot, format, 'components'))
  const imports = []
  for (const name of names) {
    const entry = `${format}/components/${name}/style/css.${extension}`
    if (
      await stat(path.join(packageRoot, entry)).then(
        (x) => x.isFile(),
        () => false,
      )
    )
      imports.push(
        format === 'lib'
          ? `require('sax-design-vue/${entry}');`
          : `import 'sax-design-vue/${entry}';`,
      )
  }
  assert.ok(imports.length > 0)
  const entry = path.join(
    fixture,
    `${format}.${format === 'lib' ? 'cjs' : 'js'}`,
  )
  await writeFile(entry, imports.join('\n'))
  const result = await build({
    root: fixture,
    configFile: false,
    logLevel: 'error',
    resolve: { preserveSymlinks: true },
    build: {
      write: false,
      minify: false,
      lib: { entry, formats: ['es'], fileName: 'styles' },
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(
    (x) => x.output,
  )
  const css = outputs
    .filter((x) => x.type === 'asset' && x.fileName.endsWith('.css'))
    .map((x) => x.source.toString())
    .join('\n')
  assert.ok(
    css.includes('.s-drawer'),
    `${format} consumer is missing Drawer CSS`,
  )
  assert.ok(
    css.includes('.s-verification-code'),
    `${format} consumer is missing Verification Code CSS`,
  )
  console.log(
    `Packed ${format} consumer: ${imports.length} on-demand entries built, ${css.length} CSS characters`,
  )
}
// Use the production Iconify plugin and the built SIcon together. Source-only
// plugin tests cannot detect a split registry in the consumer's final bundle.
const { saxIcons } = await import(
  pathToFileURL(path.join(repoRoot, 'packages/iconify/dist/vite.mjs')).href
)
await writeFile(
  path.join(fixture, 'cjs-icon.cjs'),
  "exports.SIcon = require('sax-design-vue/lib/components/icon/index.js').SIcon",
)
for (const format of ['es', 'cjs']) {
  const runtimeEntry = path.join(fixture, `runtime-${format}.js`)
  await writeFile(
    runtimeEntry,
    `
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { SIcon } from '${format === 'es' ? 'sax-design-vue' : './cjs-icon.cjs'}'
import 'virtual:sax-icons/register'
export function renderIcons() {
  return renderToString(createSSRApp({ render: () => h('div',
    ['cb:accessibility', 'bx:home', 'cb:add', 'sax:close'].map(name => h(SIcon, { name }))) }))
}
`,
  )
  const runtime = await build({
    root: fixture,
    configFile: false,
    logLevel: 'error',
    plugins: [
      saxIcons({
        collections: { cb: 'carbon', bx: 'bx' },
        safelist: ['cb:accessibility', 'bx:home'],
      }),
    ],
    resolve: { dedupe: ['vue', 'sax-design-vue-iconify'] },
    build: {
      minify: true,
      write: false,
      lib: { entry: runtimeEntry, formats: ['es'], fileName: 'runtime' },
      rolldownOptions: {
        external: ['vue', '@vue/server-renderer'],
        output: {
          banner:
            format === 'cjs'
              ? "import {createRequire} from 'node:module'; const require = createRequire(import.meta.url);"
              : '',
        },
      },
    },
  })
  const runtimeChunks = (Array.isArray(runtime) ? runtime : [runtime])
    .flatMap((output) => output.output)
    .filter((item) => item.type === 'chunk')
  const entries = runtimeChunks.filter((chunk) => chunk.isEntry)
  assert.equal(entries.length, 1, 'Icon smoke fixture must have one entry')
  const runtimeDirectory = path.join(fixture, `output-${format}`)
  await mkdir(runtimeDirectory)
  const filenames = new Set(runtimeChunks.map((chunk) => chunk.fileName))
  for (const chunk of runtimeChunks) {
    for (const dynamic of chunk.dynamicImports)
      assert.ok(filenames.has(dynamic), `Missing lazy consumer chunk: ${dynamic}`)
    const output = path.resolve(runtimeDirectory, chunk.fileName)
    assert.ok(output.startsWith(runtimeDirectory + path.sep))
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, chunk.code)
  }
  const runtimeFile = path.join(runtimeDirectory, entries[0].fileName)
  const { renderIcons } = await import(pathToFileURL(runtimeFile).href)
  const html = await renderIcons()
  assert.equal(
    (html.match(/<svg\b/g) || []).length,
    4,
    'Static/built-in, registered external, and close icons must all render after minification',
  )
  console.log(
    `Production ${format} SIcon consumer: 4 SVGs rendered; ${runtimeChunks.length} complete minified chunks`,
  )
}
console.log(`Consumer fixture: ${fixture}`)
