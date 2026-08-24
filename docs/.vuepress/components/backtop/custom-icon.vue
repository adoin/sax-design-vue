<template>
  <div class="backtop-demo__scroll backtop-demo__scroll--custom">
    <p v-for="index in 18" :key="index">
      Replace the default arrow with any icon or custom slot content.
    </p>
    <p class="backtop-demo__end">You reached the end of the scroll area.</p>
    <s-backtop
      target=".backtop-demo__scroll--custom"
      :visibility-height="96"
      :right="16"
      :bottom="16"
    >
      <s-icon-expand class="backtop-demo__icon" />
    </s-backtop>
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

.backtop-demo__icon {
  width: 18px;
  height: 18px;
}

.backtop-demo__end {
  margin-bottom: 0;
  color: hsl(var(--sax-primary));
}
</style>
