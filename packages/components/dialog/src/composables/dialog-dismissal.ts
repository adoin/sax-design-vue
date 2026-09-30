import type { DialogProps } from '../dialog'

/** Guarded mask closing requires local intent, never a resolved default. */
export const resolveDialogMaskClosable = (
  props: Pick<DialogProps, 'beforeClose' | 'maskClosable'>,
  declared: Record<string, unknown> | null | undefined,
) => {
  if (!props.beforeClose) return props.maskClosable
  const key = Object.prototype.hasOwnProperty.call(
    declared ?? {},
    'maskClosable',
  )
    ? 'maskClosable'
    : 'mask-closable'
  const value = declared?.[key]
  // A bare Boolean attribute is Vue's explicit true form.
  return value === true || value === ''
}
