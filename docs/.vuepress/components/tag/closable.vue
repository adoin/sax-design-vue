<template>
  <div class="center tag-demo">
    <s-button v-if="tags.length === 0" type="filled" @click="reset">
      Reset Tags
    </s-button>
    <s-tag v-for="tag in tags" :key="tag" closable @close="remove(tag)">
      {{ tag }}
    </s-tag>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const defaultTags = ['Dribbble', 'GitHub', 'Behance', 'Vuejs', 'Sax Design']
const tags = ref([...defaultTags])

const reset = () => {
  tags.value = [...defaultTags]
}

const remove = (item: string) => {
  tags.value = tags.value.filter((c) => c !== item)
}
</script>

<style scoped lang="scss">
.tag-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
</style>
