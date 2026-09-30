import { inject, nextTick, onBeforeUnmount, provide } from 'vue'
import type { InjectionKey } from 'vue'

interface LoadingCompletion {
  stopping: () => boolean
  restored: () => Promise<void>
}
interface LoadingCompletionScope {
  add: (participant: LoadingCompletion) => () => void
}
const loadingCompletionKey: InjectionKey<LoadingCompletionScope> = Symbol.for(
  'sax-design-vue.loading-completion',
)

/** Await already-ending loaders in this subtree without stopping unrelated work. */
export const provideLoadingCompletion = () => {
  const participants = new Set<LoadingCompletion>()
  provide(loadingCompletionKey, {
    add: (participant) => {
      participants.add(participant)
      return () => {
        participants.delete(participant)
      }
    },
  })
  return async () => {
    await nextTick()
    await Promise.all(
      [...participants]
        .filter((participant) => participant.stopping())
        .map((participant) => participant.restored()),
    )
    await nextTick()
  }
}

export const registerLoadingCompletion = (participant: LoadingCompletion) => {
  const remove = inject(loadingCompletionKey, undefined)?.add(participant)
  onBeforeUnmount(() => remove?.())
}
