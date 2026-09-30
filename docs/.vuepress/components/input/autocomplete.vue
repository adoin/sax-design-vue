<script setup lang="ts">
import { shallowRef } from 'vue'
import type { InputAutocompleteItem } from 'sax-design-vue'

const country = shallowRef('')
const city = shallowRef('')
const countries = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'China',
  'Denmark',
]
const cities: InputAutocompleteItem[] = [
  {
    value: 'Shanghai',
    label: 'Shanghai',
    description: 'China · Asia/Shanghai',
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen',
    description: 'China · Asia/Shanghai',
  },
  {
    value: 'Singapore',
    label: 'Singapore',
    description: 'Singapore · Asia/Singapore',
  },
  {
    value: 'Sydney',
    label: 'Sydney',
    description: 'Australia · Australia/Sydney',
  },
  {
    value: 'Stockholm',
    label: 'Stockholm',
    description: 'Sweden · Europe/Stockholm',
    disabled: true,
  },
]
</script>

<template>
  <div class="autocomplete-demo">
    <div>
      <s-input
        v-model="country"
        :autocomplete="countries"
        label="Country"
        placeholder="Type a country or choose a suggestion"
        block
        allow-clear
      />
      <s-text color="text" size="small">Value: {{ country || '—' }}</s-text>
    </div>
    <div>
      <s-input
        v-model="city"
        :autocomplete="cities"
        :autocomplete-min-length="1"
        label="City"
        placeholder="Try S or China"
        block
        allow-clear
      />
      <s-text color="text" size="small">Value: {{ city || '—' }}</s-text>
    </div>
  </div>
</template>

<style scoped>
.autocomplete-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 24px;
  width: 100%;
}
.autocomplete-demo > div {
  display: grid;
  gap: 12px;
}
</style>
