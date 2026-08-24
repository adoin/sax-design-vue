<template>
  <div class="backtop-demo__scroll backtop-demo__scroll--distance">
    <p v-for="index in 18" :key="index">
      The control appears only when this container is close to its end.
    </p>
    <p class="backtop-demo__end">You reached the end of the scroll area.</p>
    <s-backtop
      target=".backtop-demo__scroll--distance"
      :visibility-height="10000"
      :visibility-bottom="72"
      :right="16"
      :bottom="16"
    />
  </div>
</template>

<style scoped>
.backtop-demo__scroll {
  position: relative;
  height: 248px;
  padding: 12px 20px 64px;
  overflow-y: auto;
  border-radius: 14px;
  background: hsl(var(--sax-theme-bg2) / 0.46);
  color: hsl(var(--sax-text-color-secondary));
}

.backtop-demo__end {
  margin-bottom: 0;
  color: hsl(var(--sax-primary));
}
</style>
