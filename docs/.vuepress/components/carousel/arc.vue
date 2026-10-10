<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
const explored = ref('')
const items = [
  {
    name: 'lake',
    title: 'Nankumba Peninsula',
    description: 'Lake Malawi, Malawi',
    src: 'https://kobra.systems/images/carousel/2.webp',
    alt: 'Turquoise water and a rocky shoreline',
  },
  {
    name: 'fjord',
    title: 'Tufi Fjords',
    description: 'Oro Province, Papua New Guinea',
    src: 'https://kobra.systems/images/carousel/1.webp',
    alt: 'Green coast and open water',
  },
  {
    name: 'island',
    title: 'Utula‘aina Lookout',
    description: 'Vava‘u, Tonga',
    src: 'https://kobra.systems/images/carousel/3.webp',
    alt: 'An island overlooking the sea',
  },
  {
    name: 'valley',
    title: 'Orkhon Valley',
    description: 'Arkhangai Province, Mongolia',
    src: 'https://kobra.systems/images/carousel/4.webp',
    alt: 'A broad green valley',
  },
  {
    name: 'villa',
    title: 'Villa Eilenroc',
    description: 'Cap d’Antibes, France',
    src: 'https://kobra.systems/images/carousel/5.webp',
    alt: 'Mediterranean coastal architecture',
  },
]
</script>

<template>
  <div class="arc-demo">
    <s-carousel
      v-model="active"
      :items="items"
      effect="arc"
      height="360"
      :autoplay="false"
      draggable
      arrow="always"
      indicator-position="none"
    >
      <template #caption="{ item }">
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        <s-button size="small" color="dark" @click="explored = item.title"
          >Explore</s-button
        >
      </template>
    </s-carousel>
    <p v-if="explored" aria-live="polite">
      Selected destination: {{ explored }}
    </p>
  </div>
</template>

<style scoped>
.arc-demo {
  width: 100%;
}
.arc-demo p {
  margin: 12px 0 0;
  color: var(--sax-css-primary);
  text-align: center;
  font-size: 13px;
}
</style>
