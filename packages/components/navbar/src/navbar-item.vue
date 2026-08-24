<template>
  <button
    :class="[ns.b(), ns.is('active', active || isActive)]"
    type="button"
    :disabled="disabled"
    :aria-current="active || isActive ? 'page' : undefined"
    @click="handleClickItem"
  >
    <span v-if="icon || $slots.icon" :class="ns.e('icon')" aria-hidden="true">
      <slot name="icon">
        <s-icon :name="icon" />
      </slot>
    </span>
    <span :class="ns.e('label')"
      ><slot>{{ link?.text }}</slot></span
    >
    <span v-if="badge !== undefined" :class="ns.e('badge')">{{ badge }}</span>
  </button>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, onBeforeUnmount } from 'vue'
import { throwError } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import {
  navbarGroupRegisterContextKey,
  navbarRegisterContextKey,
} from '@vuesax-alpha/tokens/navbar'
import { navbarItemProps } from './navbar-item'
import type { Router } from 'vue-router'

defineOptions({
  name: 'SNavbarItem',
})

const props = defineProps(navbarItemProps)

const navbarRegister = inject(navbarRegisterContextKey, undefined)
const navbarGroupRegister = inject(navbarGroupRegisterContextKey, undefined)

if (!navbarRegister) {
  throwError('navbar-item', 'need to call inside navbar component')
}

const { unregister, onClick, isActive } = navbarRegister(props.id)

const navbarGroup = navbarGroupRegister?.(props.id)

const ns = useNamespace('navbar-item')
const router = getCurrentInstance()?.appContext.config.globalProperties
  .$router as Router | undefined

const handleClickItem = () => {
  if (props.disabled) return

  onClick()

  if (props.to) {
    router?.push(props.to)
  } else {
    if (props.link) {
      window.open(props.link.path, props.link.target)
    }
  }
}

onBeforeUnmount(() => {
  unregister()
  navbarGroup?.unregister()
})
</script>
