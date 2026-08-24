<script lang="ts" setup>
import { SIcon } from '@vuesax-alpha/components/icon'

import type { MenuOption } from './menu'

defineOptions({ name: 'SMenuPopupPanel' })

defineProps<{
  option: MenuOption
  horizontalRoot: boolean
}>()
</script>

<template>
  <div
    class="s-menu-popup-panel"
    :class="{ 'is-horizontal-root': horizontalRoot }"
  >
    <div
      v-if="horizontalRoot"
      class="s-menu-popup-panel__lead"
      aria-hidden="true"
    >
      <span v-if="option.icon" class="s-menu-popup-panel__lead-icon">
        <SIcon :name="option.icon" />
      </span>
      <span class="s-menu-popup-panel__lead-copy">
        <strong>{{ option.label }}</strong>
        <small v-if="option.description">{{ option.description }}</small>
      </span>
    </div>

    <div class="s-menu-popup-panel__body">
      <slot />
    </div>
  </div>
</template>
