<template>
  <div class="center chip-demo">
    <vs-chip>
      <vs-avatar>
        <i class="material-icons notranslate">person</i>
      </vs-avatar>
      Icon Default
    </vs-chip>
    <vs-chip color="primary">
      <vs-avatar>
        <i class="material-icons notranslate">send</i>
      </vs-avatar>
      Icon send
    </vs-chip>
    <vs-chip color="success">
      <vs-avatar>
        <i class="material-icons notranslate">markunread</i>
      </vs-avatar>
      Icon markunread
    </vs-chip>
    <vs-chip color="danger">
      <vs-avatar>
        <i class="material-icons notranslate">link_off</i>
      </vs-avatar>
      Icon link_off
    </vs-chip>
    <vs-chip color="warning">
      <vs-avatar>
        <i class="material-icons notranslate">battery_alert</i>
      </vs-avatar>
      Icon battery_alert
    </vs-chip>
    <vs-chip color="dark">
      <vs-avatar>
        <i class="material-icons notranslate">edit</i>
      </vs-avatar>
      Icon edit
    </vs-chip>
  </div>
</template>

<style scoped lang="scss">
.chip-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
