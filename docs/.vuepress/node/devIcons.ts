import { saxIcons } from 'sax-design-vue-iconify/vite'

/** Batch the documentation's known icons without changing the public plugin. */
export function documentationIconsPlugin(
  options: Parameters<typeof saxIcons>[0],
) {
  const plugin = saxIcons(options)
  const registerId = plugin.resolveId('virtual:sax-icons/register')
  const known = new Set(options.safelist)
  const prefixes = new Set(Object.keys(options.collections))
  let development = false
  return {
    ...plugin,
    configResolved(
      config: Parameters<typeof plugin.configResolved>[0] & { command: string },
    ) {
      development = config.command === 'serve'
      plugin.configResolved(config)
    },
    async load(id: string) {
      const source = await plugin.load(id)
      if (!development || id !== registerId || !source) return source
      let output = source
      // Use the original loader for aliases, geometry and attributes as well.
      // Only the transport changes: one registry rather than one HTTP request per icon.
      for (const match of source.matchAll(
        /import (\w+) from '(virtual:sax-icon\/[^']+)'/g,
      )) {
        const resolved = plugin.resolveId(match[2])
        const data = resolved && (await plugin.load(resolved))
        if (!data?.startsWith('export default '))
          throw new Error(`Cannot batch documentation icon ${match[2]}`)
        output = output.replace(
          match[0],
          `const ${match[1]} = ${data.slice('export default '.length)};`,
        )
      }
      return output
    },
    transform(code: string, id: string) {
      if (development) {
        const names = [
          ...code.matchAll(
            /(['"`])([a-z][a-z0-9-]*):([a-z0-9]+(?:-[a-z0-9]+)*)\1/g,
          ),
        ]
          .filter((match) => prefixes.has(match[2]))
          .map((match) => `${match[2]}:${match[3]}`)
        // New icons introduced during HMR still use the normal extraction path.
        if (names.every((name) => known.has(name))) return
      }
      return plugin.transform(code, id)
    },
  }
}
