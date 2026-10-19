import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const css = await readFile('dist/sax-design-vue/theme-chalk/index.css', 'utf8')
assert.match(css, /html\.dark\s*\{/, 'Default CSS must include dark variables')
assert.match(css, /@container\s+table-query\s*\(max-width:\s*560px\)/, 'Compressed CSS must preserve the query layout container rule')
assert.match(css, /@container\s+sax-form\s*\(min-width:\s*480px\)/, 'Compressed CSS must preserve Form container breakpoints')
assert.match(css, /container:\s*sax-form\s*\/\s*inline-size/, 'Form rows must establish their own size container')
assert.match(css, /\.s-input-number:hover[^{}]*\{[^}]*background:var\(--sax-css-input-number-background/, 'Input Number hover must preserve its configured surface color')
const windowCss = await readFile('dist/sax-design-vue/theme-chalk/vs-window.css', 'utf8')
assert.doesNotMatch(windowCss, /getColor\(/i, 'Window Sass color functions must compile to CSS values')
assert.match(windowCss, /background:var\(--sax-css-background/, 'Window must have a themed opaque surface')
assert.match(windowCss, /box-shadow:[^}]*var\(--sax-css-text/, 'Window must retain its themed shadow')
console.log('Verified default dark variables, Window surfaces and responsive container queries')
