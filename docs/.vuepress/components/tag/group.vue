<template>
  <div class="center tags-demo">
    <s-tag-group
      v-model="tags"
      label-key="name"
      value-key="id"
      placeholder="Tag name"
      :create-item="createTag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TagItem {
  id: number
  name: string
}

let nextId = 4
const tags = ref<TagItem[]>([
  { id: 1, name: 'Vuejs' },
  { id: 2, name: 'Node' },
  { id: 3, name: 'Sax Design' },
])

const createTag = (name: string): TagItem => ({ id: nextId++, name })
</script>

<style scoped lang="scss">
.tags-demo {
  width: 100%;
  max-width: 520px;
}
</style>
