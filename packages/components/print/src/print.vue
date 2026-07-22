<template>
  <div ref="contentRef" :class="ns.b()"><slot /></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { printEmits, printProps } from './print'

defineOptions({ name: 'SPrint' })

const props = defineProps(printProps)
const emit = defineEmits(printEmits)
const ns = useNamespace('print')
const contentRef = ref<HTMLElement>()
const print = () => {
  const content = contentRef.value?.innerHTML
  if (!content) return
  emit('beforePrint')
  const popup = window.open(
    '',
    '_blank',
    'noopener,noreferrer,width=900,height=700',
  )
  if (!popup) {
    emit('error', new Error('Unable to open print window'))
    return
  }
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')]
    .map((element) => element.outerHTML)
    .join('')
  popup.document.write(
    `<!doctype html><html><head><title>${props.title}</title>${styles}<style>${props.printStyle}</style></head><body><main class="s-print__document">${content}</main></body></html>`,
  )
  popup.document.close()
  popup.focus()
  const cleanup = () => {
    emit('afterPrint')
    if (props.autoClose) popup.close()
  }
  popup.addEventListener('afterprint', cleanup, { once: true })
  window.setTimeout(() => popup.print(), 80)
}

defineExpose({ print })
</script>
