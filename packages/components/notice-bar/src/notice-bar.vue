<template>
  <transition name="s-notice-bar-fade">
    <div
      v-if="visible"
      :class="[ns.b(), ns.m(type)]"
      role="status"
      @click="$emit('click', $event)"
    >
      <div :class="ns.e('viewport')">
        <span
          :class="[ns.e('content'), ns.is('scrollable', scrollable)]"
          :style="scrollStyle"
          ><slot>{{ content }}</slot></span
        >
      </div>
      <button
        v-if="closable"
        type="button"
        :class="ns.e('close')"
        aria-label="Close"
        @click.stop="close"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { noticeBarEmits, noticeBarProps } from './notice-bar'

defineOptions({ name: 'SNoticeBar' })
const props = defineProps(noticeBarProps)
const emit = defineEmits(noticeBarEmits)
const ns = useNamespace('notice-bar')
const visible = ref(true)
const scrollStyle = computed(() => ({
  animationDuration: `${props.duration}s`,
}))
const close = () => {
  visible.value = false
  emit('close')
}
</script>
