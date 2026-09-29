let dock: HTMLElement | undefined
let users = 0
export const acquireDialogDock = (className: string) => {
  if (!dock) {
    dock = document.createElement('div')
    dock.className = className
    document.body.appendChild(dock)
  }
  users++
  return dock
}
export const releaseDialogDock = () => {
  users = Math.max(0, users - 1)
  if (!users) {
    dock?.remove()
    dock = undefined
  }
}
