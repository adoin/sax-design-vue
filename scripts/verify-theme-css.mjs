import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const css = await readFile('dist/sax-design-vue/theme-chalk/index.css', 'utf8')
assert.match(css, /html\.dark\s*\{/, 'Default CSS must include dark variables')
assert.match(css, /@container\s+table-query\s*\(max-width:\s*560px\)/, 'Compressed CSS must preserve the query layout container rule')
assert.match(css, /@container\s+sax-form\s*\(min-width:\s*480px\)/, 'Compressed CSS must preserve Form container breakpoints')
assert.match(css, /container:\s*sax-form\s*\/\s*inline-size/, 'Form rows must establish their own size container')
console.log('Verified default dark variables and responsive container queries')
