<template>
  <div class="prompt-demo">
    <p class="modelx">{{ val || 'null' }}</p>
    <vs-button type="border" @click="activePrompt = true">Run prompt</vs-button>

    <p class="modelx">{{ valMultiple.value1 }} {{ valMultiple.value2 }}</p>
    <vs-button type="border" @click="activePrompt2 = true">
      Run prompt inputs
    </vs-button>

    <vs-prompt
      v-model="activePrompt"
      title="Dialog"
      @cancel="val = ''"
      @accept="activePrompt = false"
      @close="activePrompt = false"
    >
      <div class="con-exemple-prompt">
        Enter the security code
        <vs-input v-model="val" placeholder="Code" />
        <vs-select v-model="select1" label="Figuras" class="select-example">
          <vs-select-item
            v-for="(item, index) in options1"
            :key="index"
            :value="item.value"
            :text="item.text"
          />
        </vs-select>
      </div>
    </vs-prompt>

    <vs-prompt
      v-model="activePrompt2"
      color="danger"
      title="Dialog"
      :is-valid="validName"
      @cancel="
        () => {
          valMultiple.value1 = ''
          valMultiple.value2 = ''
        }
      "
      @accept="activePrompt2 = false"
      @close="activePrompt2 = false"
    >
      <div class="con-exemple-prompt">
        Enter your first and last name to <b>continue</b>.
        <vs-input v-model="valMultiple.value1" placeholder="Name" />
        <vs-input v-model="valMultiple.value2" placeholder="Last Name" />
        <vs-alert :active="!validName" color="danger" icon="new_releases">
          Fields can not be empty please enter the data
        </vs-alert>
      </div>
    </vs-prompt>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const activePrompt = ref(false)
const activePrompt2 = ref(false)
const val = ref('')
const valMultiple = reactive({ value1: '', value2: '' })
const select1 = ref(2)
const options1 = [
  { text: 'IT', value: 0 },
  { text: 'Blade Runner', value: 2 },
  { text: 'Thor Ragnarok', value: 3 },
]

const validName = computed(
  () => valMultiple.value1.length > 0 && valMultiple.value2.length > 0
)
</script>

<style scoped lang="scss">
.prompt-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modelx {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.65);
}

.con-exemple-prompt {
  padding: 10px 10px 0;

  :deep(.vs-input) {
    width: 100%;
    margin-top: 10px;
  }

  .select-example {
    width: 100%;
    margin-top: 10px;
  }

  :deep(.vs-alert) {
    margin-top: 10px;
  }
}
</style>
