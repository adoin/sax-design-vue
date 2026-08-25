import { getPackageDependencies, vsPackage } from '@vuesax-alpha/build-utils'

import type { OutputOptions, RolldownBuild } from 'rolldown'

/**
 * ReferenceError: __name is not defined
 * https://github.com/vuejs/core/issues/8303
 */
const __defProp = Object.defineProperty
const __name = (target: any, value: any) =>
  __defProp(target, 'name', { value, configurable: true })

;(globalThis as any).__name = __name

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(vsPackage)

  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`),
    )
  }
}

export function writeBundles(bundle: RolldownBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string,
) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
