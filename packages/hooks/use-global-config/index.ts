// @ts-nocheck
import {
  computed,
  getCurrentInstance,
  inject,
  isRef,
  provide,
  ref,
  unref,
} from 'vue'
import { debugWarn, keysOf } from '@vuesax-alpha/utils'
import { configProviderContextKey } from '@vuesax-alpha/tokens'

import { localeContextKey, useLocale } from '../use-locale'
import {
  defaultNamespace,
  namespaceContextKey,
  useNamespace,
} from '../use-namespace'
import {
  defaultInitialZIndex,
  useZIndex,
  zIndexContextKey,
} from '../use-z-index'
import type { MaybeRef } from '@vuesax-alpha/utils'
import type { App, Ref } from 'vue'
import type { ConfigProviderContext } from '@vuesax-alpha/tokens'

// this is meant to fix global methods like `SNotification(opts)`
const globalConfig = ref<ConfigProviderContext>()

export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K],
>(
  key: K,
  defaultValue?: D,
): Ref<Exclude<ConfigProviderContext[K], undefined> | D>
export function useGlobalConfig(): Ref<ConfigProviderContext>
export function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultValue = undefined,
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue)
  } else {
    return config
  }
}

const hyphenate = (value: string) =>
  value.replace(/\B([A-Z])/g, '-$1').toLowerCase()

const isMergeableRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  !isRef(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value))

const mergeConfigRecords = (
  previous: Record<string, unknown>,
  next: Record<string, unknown>,
): Record<string, unknown> => {
  if (previous === next) return previous
  const merged = { ...previous }
  for (const [key, value] of Object.entries(next)) {
    const inherited = merged[key]
    merged[key] =
      isMergeableRecord(inherited) && isMergeableRecord(value)
        ? mergeConfigRecords(inherited, value)
        : (value ?? inherited)
  }
  return merged
}

/**
 * Resolve one component's reusable defaults without hiding local intent.
 *
 * Omitted props inherit the configured value. Explicit scalar props replace it;
 * object props shallow-merge over object defaults; `true` enables a Boolean-or-
 * object feature while retaining its configured options; and `false` disables it.
 */
export const useGlobalComponentProps = <
  T extends Record<string, unknown>,
  K extends keyof ConfigProviderContext,
>(
  key: K,
  props: T,
): T => {
  const instance = getCurrentInstance()
  const defaults = useGlobalConfig(key)

  return new Proxy(props, {
    get(target, property, receiver) {
      const localValue = Reflect.get(target, property, receiver)
      if (typeof property !== 'string') return localValue

      const configured = defaults.value
      if (!isMergeableRecord(configured)) return localValue
      const configuredValue = configured[property]
      if (configuredValue === undefined) return localValue

      const vnodeProps = instance?.vnode.props
      const isExplicit = Boolean(
        vnodeProps &&
        (Object.prototype.hasOwnProperty.call(vnodeProps, property) ||
          Object.prototype.hasOwnProperty.call(
            vnodeProps,
            hyphenate(property),
          )),
      )
      if (!isExplicit) return configuredValue
      if (localValue === false || localValue === null) return localValue

      if (isMergeableRecord(configuredValue)) {
        if (localValue === true) return { ...configuredValue }
        if (isMergeableRecord(localValue))
          return { ...configuredValue, ...localValue }
      }
      return localValue
    },
  })
}

/** Resolve options for imperative services, where there is no component vnode. */
export const resolveGlobalComponentOptions = <
  T extends Record<string, unknown>,
  K extends keyof ConfigProviderContext,
>(
  key: K,
  options: T,
): T => {
  const configured = useGlobalConfig(key).value
  return (
    isMergeableRecord(configured) ? { ...configured, ...options } : options
  ) as T
}

// for components like `SNotification`.
export const useGlobalComponentSettings = (block: string) => {
  const config = useGlobalConfig()

  const ns = useNamespace(
    block,
    computed(() => config.value?.namespace || defaultNamespace),
  )

  const locale = useLocale(computed(() => config.value?.locale))
  const zIndex = useZIndex(
    computed(() => config.value?.zIndex || defaultInitialZIndex),
  )

  return {
    ns,
    locale,
    zIndex,
  }
}

export const provideGlobalConfig = (
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false,
) => {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)
  if (!provideFn) {
    debugWarn(
      'provideGlobalConfig',
      'provideGlobalConfig() can only be used inside setup().',
    )
    return
  }

  const context = computed(() => {
    const cfg = unref(config)
    if (!oldConfig?.value) return cfg
    return mergeConfig(oldConfig.value, cfg)
  })

  provideFn(configProviderContextKey, context)
  provideFn(
    localeContextKey,
    computed(() => context.value.locale),
  )
  provideFn(
    namespaceContextKey,
    computed(() => context.value.namespace),
  )
  provideFn(
    zIndexContextKey,
    computed(() => context.value.zIndex),
  )

  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }
  return context
}

const mergeConfig = (
  a: ConfigProviderContext,
  b: ConfigProviderContext,
): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
  const obj: Record<string, any> = {}
  for (const key of keys) {
    const previous = a[key]
    const next = b[key]
    obj[key] =
      isMergeableRecord(previous) && isMergeableRecord(next)
        ? mergeConfigRecords(previous, next)
        : (next ?? previous)
  }
  return obj
}
