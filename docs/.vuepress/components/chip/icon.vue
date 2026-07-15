<template>
  <div class="center chip-demo">
    <s-chip>
      <s-avatar>
        <i class="material-icons notranslate">person</i>
      </s-avatar>
      Icon Default
    </s-chip>
    <s-chip color="primary">
      <s-avatar>
        <i class="material-icons notranslate">send</i>
      </s-avatar>
      Icon send
    </s-chip>
    <s-chip color="success">
      <s-avatar>
        <i class="material-icons notranslate">markunread</i>
      </s-avatar>
      Icon markunread
    </s-chip>
    <s-chip color="danger">
      <s-avatar>
        <i class="material-icons notranslate">link_off</i>
      </s-avatar>
      Icon link_off
    </s-chip>
    <s-chip color="warning">
      <s-avatar>
        <i class="material-icons notranslate">battery_alert</i>
      </s-avatar>
      Icon battery_alert
    </s-chip>
    <s-chip color="dark">
      <s-avatar>
        <i class="material-icons notranslate">edit</i>
      </s-avatar>
      Icon edit
    </s-chip>
  </div>
</template>

<style scoped lang="scss">
.chip-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
