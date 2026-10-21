<script setup lang="ts">
import { SButton } from '@vuesax-alpha/components/button'
import { SInput } from '@vuesax-alpha/components/input'
import FileGlyph from './file-glyph.vue'
import type { FileManagerState } from './use-file-manager'
const props = defineProps<{ state: FileManagerState }>()
const { search, setSearch, view, toggleView, icons, label } = props.state
</script>
<template>
  <SInput
    :model-value="search"
    class="s-file-manager__search"
    :placeholder="label('search')"
    :aria-label="label('search')"
    clearable
    block
    @update:model-value="setSearch(String($event ?? ''))"
  />
  <SButton
    :debounce="false"
    icon
    type="transparent"
    :aria-label="label(view === 'grid' ? 'list' : 'grid')"
    :title="label(view === 'grid' ? 'list' : 'grid')"
    class="s-file-manager__view-toggle"
    @click="toggleView"
    ><FileGlyph :kind="view" :graphic="icons[view]"
  /></SButton>
</template>
