<template>
  <div class="backtop-demo__scroll backtop-demo__scroll--default">
    <p v-for="index in 18" :key="index">
      Scroll inside this panel, then use Backtop to return to the first item.
    </p>
    <p class="backtop-demo__end">You reached the end of the scroll area.</p>
    <s-backtop
      target=".backtop-demo__scroll--default"
      :visibility-height="96"
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
  background: rgba(var(--sax-theme-bg2), 0.46);
  color: rgba(var(--sax-text-color-secondary));
}

.backtop-demo__end {
  margin-bottom: 0;
  color: rgb(var(--sax-primary));
}
</style>
