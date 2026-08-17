<template>
  <div class="center chip-demo">
    <s-chip>
      <s-avatar>
        <s-icon name="cb:user" />
      </s-avatar>
      Icon Default
    </s-chip>
    <s-chip color="primary">
      <s-avatar>
        <s-icon name="cb:send" />
      </s-avatar>
      Icon send
    </s-chip>
    <s-chip color="success">
      <s-avatar>
        <s-icon name="cb:email" />
      </s-avatar>
      Icon markunread
    </s-chip>
    <s-chip color="danger">
      <s-avatar>
        <s-icon name="cb:unlink" />
      </s-avatar>
      Icon link_off
    </s-chip>
    <s-chip color="warning">
      <s-avatar>
        <s-icon name="cb:battery-low" />
      </s-avatar>
      Icon battery_alert
    </s-chip>
    <s-chip color="dark">
      <s-avatar>
        <s-icon name="cb:edit" />
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
