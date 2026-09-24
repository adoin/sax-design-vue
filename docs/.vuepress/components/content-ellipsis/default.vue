<script lang="ts" setup>
import { shallowRef } from 'vue'

const expanded = shallowRef(false)
</script>

<template>
  <s-content-ellipsis v-model:expanded="expanded" :collapsed-height="132">
    <div class="content-ellipsis-demo">
      <div class="content-ellipsis-demo__heading">
        <s-tag size="small" status="primary">Workspace</s-tag>
        <strong>Release overview</strong>
      </div>
      <p>
        This update brings navigation, shared styles, and content workflows into
        one consistent workspace.
      </p>
      <ul>
        <li>Navigation keeps the current location visible.</li>
        <li>Shared controls use the same size and focus treatment.</li>
        <li>Additional details stay available when they are needed.</li>
      </ul>
    </div>
  </s-content-ellipsis>
</template>

<style scoped>
.content-ellipsis-demo {
  font-size: 14px;
  line-height: 1.65;
}

.content-ellipsis-demo__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.content-ellipsis-demo p {
  margin: 0 0 10px;
}

.content-ellipsis-demo ul {
  margin: 0;
  padding-left: 20px;
}
</style>
