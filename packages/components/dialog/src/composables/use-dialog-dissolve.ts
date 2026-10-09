import { useSurfaceDissolve } from '@vuesax-alpha/hooks'

/** Own one mutable filter/timeline for this surface, including retained globals. */
export const useDialogDissolve = (duration: () => number = () => 180) =>
  useSurfaceDissolve(duration, 'sax-dialog-dissolve')
