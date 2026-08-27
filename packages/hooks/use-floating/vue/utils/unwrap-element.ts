import { isVNode } from 'vue'
import type { ComponentPublicInstance, VNode } from 'vue'

import type { MaybeElement } from '../types'

function isComponentPublicInstance(
  target: unknown,
): target is ComponentPublicInstance {
  return target != null && Object.prototype.hasOwnProperty.call(target, '$el')
}

function isReferenceElement(target: unknown): target is Element {
  return (
    target != null &&
    typeof (target as Element).getBoundingClientRect === 'function'
  )
}

function findFirstElement(vnode: VNode | undefined): Element | null {
  if (vnode == null) return null

  if (isReferenceElement(vnode.el)) return vnode.el

  const componentElement = findFirstElement(vnode.component?.subTree)
  if (componentElement != null) return componentElement

  if (!Array.isArray(vnode.children)) return null

  for (const child of vnode.children) {
    if (!isVNode(child)) continue

    const childElement = findFirstElement(child)
    if (childElement != null) return childElement
  }

  return null
}

export function unwrapElement<T>(target: MaybeElement<T>) {
  if (isComponentPublicInstance(target)) {
    if (isReferenceElement(target.$el)) {
      return target.$el as Exclude<MaybeElement<T>, ComponentPublicInstance>
    }

    const instance = target as ComponentPublicInstance & {
      $?: { subTree?: VNode }
    }

    return findFirstElement(instance.$?.subTree) as Exclude<
      MaybeElement<T>,
      ComponentPublicInstance
    >
  }

  if (target == null || isReferenceElement(target)) {
    return target as Exclude<MaybeElement<T>, ComponentPublicInstance>
  }

  return null
}
