import { computed, getCurrentInstance, ref, unref } from 'vue'
import { buildProp, isValidComponentColor } from '@vuesax-alpha/utils'
import {
  componentShapes,
  componentSizes,
  vuesaxColors,
} from '@vuesax-alpha/constants'
import { useProp } from '../use-prop'
import { useGlobalConfig } from '../use-global-config'
import type { MaybeRef } from '@vuesax-alpha/utils'
import type {
  Color,
  ComponentShape,
  ComponentSize,
} from '@vuesax-alpha/constants'

export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
} as const)

export const useShapeProp = buildProp({
  type: String,
  values: componentShapes,
  default: 'rounded',
} as const)

export const useShape = <T extends string = ComponentShape>(
  fallback?: MaybeRef<T | ComponentShape | undefined>,
) => {
  const instance = getCurrentInstance()
  const shape = useProp<T>('shape')
  const globalShape = useGlobalConfig('shape')
  const hasExplicitShape = computed(() => instance?.vnode.props?.shape != null)

  return computed(
    (): T | ComponentShape =>
      (hasExplicitShape.value ? shape.value : undefined) ||
      unref(fallback) ||
      globalShape.value ||
      shape.value ||
      'rounded',
  )
}

export const useSize = (
  fallback?: MaybeRef<ComponentSize | undefined>,
  ignore: Partial<Record<'prop', boolean>> = {},
) => {
  const emptyRef = ref(undefined)

  const size = ignore.prop ? emptyRef : useProp<ComponentSize>('size')

  return computed((): ComponentSize => size.value || unref(fallback) || '')
}

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = useProp<boolean>('disabled')
  return computed(() => disabled.value || unref(fallback) || false)
}

export const useColorProp = buildProp({
  type: String,
  values: vuesaxColors,
  validator: isValidComponentColor,
} as const)

export const useColor = (fallback?: MaybeRef<Color | undefined>) => {
  const color = useProp<Color>('color')
  return computed(() => color.value || unref(fallback))
}
