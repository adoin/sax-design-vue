type DismissMenu = () => void

// Context menus share one active session per document, including sibling apps.
// Keep DOM ownership out of SSR and release instance callbacks on teardown.
const activeMenus = new WeakMap<Document, DismissMenu>()

export const claimContextMenu = (document: Document, dismiss: DismissMenu) => {
  const previous = activeMenus.get(document)
  if (previous === dismiss) return
  activeMenus.set(document, dismiss)
  previous?.()
}

export const releaseContextMenu = (
  document: Document,
  dismiss: DismissMenu,
) => {
  if (activeMenus.get(document) === dismiss) activeMenus.delete(document)
}
