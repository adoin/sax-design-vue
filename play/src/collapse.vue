<template>
  <div class="play-container demo">
    <vs-collapse accordion>
      <vs-collapse-item open>
        <template #header>Section 1</template>
        Collapse content for section 1.
      </vs-collapse-item>
      <vs-collapse-item>
        <template #header>Section 2</template>
        Collapse content for section 2.
      </vs-collapse-item>
    </vs-collapse>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  width: min(520px, 90vw);
}
</style>
