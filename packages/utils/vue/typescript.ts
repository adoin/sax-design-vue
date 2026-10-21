import type { AppContext, Plugin } from 'vue'

/** Reuse the component declaration and attach its installation/static members by reference. */
export type SFCWithInstall<T, Extra = Record<never, never>> = T & Plugin & Extra

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}
