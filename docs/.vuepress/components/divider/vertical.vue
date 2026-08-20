<template>
  <div class="divider-vertical-demo">
    <div class="divider-vertical-demo__row">
      <span>Overview</span>
      <s-divider direction="vertical" />
      <span>Activity</span>
      <s-divider direction="vertical" />
      <span>Settings</span>
    </div>

    <div class="divider-vertical-demo__row">
      <s-link :underline="false">Edit</s-link>
      <s-divider direction="vertical" color="primary" />
      <s-link type="danger" :underline="false">Delete</s-link>
    </div>

    <div class="divider-vertical-demo__row divider-vertical-demo__row--large">
      <span>18 px text</span>
      <s-divider direction="vertical" border-style="dashed" />
      <span>Height follows font size</span>
    </div>
  </div>
</template>

<style scoped>
.divider-vertical-demo {
  display: grid;
  gap: 18px;
}

.divider-vertical-demo__row {
  display: flex;
  align-items: center;
  color: var(--sax-text-color-regular);
}

.divider-vertical-demo__row--large {
  font-size: 18px;
}
</style>
