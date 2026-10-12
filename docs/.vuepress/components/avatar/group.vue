<script setup lang="ts">
import { shallowRef } from 'vue'
const max = shallowRef(6)
const members = [
  'Alex',
  'Morgan',
  'Sam',
  'Taylor',
  'Jordan',
  'Casey',
  'Robin',
  'Jamie',
].map((name, index) => ({ name, src: `/avatars/avatar-${index + 1}.png` }))
</script>

<template>
  <div class="avatar-group-demo">
    <s-avatar-group
      :max="max"
      :size="48"
      :overlap="12"
      aria-label="Project members"
    >
      <s-avatar v-for="member in members" :key="member.name" shape="circle">
        <img :src="member.src" :alt="member.name" />
      </s-avatar>
    </s-avatar-group>
    <s-button @click="max = max === 6 ? 8 : 6">{{
      max === 6 ? 'Show all members' : 'Show six members'
    }}</s-button>
    <s-avatar-group float :max="4" :size="36" aria-label="Side-by-side avatars">
      <s-avatar v-for="member in members" :key="member.name" shape="circle">
        <img :src="member.src" :alt="member.name" />
      </s-avatar>
    </s-avatar-group>
  </div>
</template>

<style scoped>
.avatar-group-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
