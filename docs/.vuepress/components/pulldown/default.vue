<template>
  <s-pulldown
    ><s-button>Actions</s-button
    ><template #dropdown="{ hide }"
      ><button v-for="item in items" :key="item" class="action" @click="hide">
        {{ item }}
      </button></template
    ></s-pulldown
  >
</template>
<script lang="ts" setup>
const items = ['Create', 'Duplicate', 'Archive']
</script>
<style scoped>
.action {
  display: block;
  width: 100%;
  padding: 9px 14px;
  border: 0;
  background: transparent;
  color: #42526e;
  text-align: left;
  cursor: pointer;
}
.action:hover {
  background: #eef3ff;
  color: #2463eb;
}
</style>
