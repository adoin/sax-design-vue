<template>
  <div class="play-container demo">
    <vs-collapse>
      <vs-collapse-item icon-arrow="label">
        <template #header>Collapse item</template>
        Content with label icon.
      </vs-collapse-item>
      <vs-collapse-item icon-arrow="grade">
        <template #header>Collapse item 2</template>
        Content with grade (star) icon.
      </vs-collapse-item>
      <vs-collapse-item disabled icon-arrow="arrow_downward">
        <template #header>Collapse item 3 - Disabled</template>
        Disabled panel content.
      </vs-collapse-item>
      <vs-collapse-item icon-arrow="arrow_drop_down">
        <template #header>Collapse item 4</template>
        Content with arrow_drop_down icon.
      </vs-collapse-item>
    </vs-collapse>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  width: min(520px, 90vw);
}
</style>
