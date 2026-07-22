<template>
  <div class="backtop-demo">
    <p v-for="index in 14" :key="index">
      Scroll the documentation page to reveal Backtop.
    </p>
  </div>
  <s-backtop :visibility-height="80" bottom="72" />
</template>

<style scoped>
.backtop-demo {
  color: rgba(var(--sax-text-color-secondary));
}
</style>
