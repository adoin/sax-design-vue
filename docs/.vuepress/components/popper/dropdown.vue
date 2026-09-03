<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const selected = ref('None')
const actions = ['Create a project', 'Duplicate project', 'Archive project']

function selectAction(action: string) {
  selected.value = action
  visible.value = false
}
</script>

<template>
  <div class="popper-dropdown-example">
    <s-popper
      v-model:visible="visible"
      trigger="click"
      placement="bottom-start"
      :show-arrow="false"
    >
      <s-button>Project actions</s-button>
      <template #content>
        <div class="popper-actions">
          <s-button
            v-for="action in actions"
            :key="action"
            block
            type="transparent"
            @click="selectAction(action)"
          >
            <span class="popper-action-label">{{ action }}</span>
          </s-button>
        </div>
      </template>
    </s-popper>
    <span aria-live="polite">Selected: {{ selected }}</span>
  </div>
</template>

<style scoped>
.popper-dropdown-example {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.popper-dropdown-example > span {
  color: hsl(var(--sax-text) / 0.7);
  font-size: 0.875rem;
}
.popper-actions {
  display: grid;
  gap: 4px;
  width: 184px;
}
.popper-actions .s-button {
  min-height: 40px;
  color: hsl(var(--sax-text));
  margin: 0;
}
.popper-action-label {
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
}
</style>
