<template>
  <div class="center tag-demo">
    <s-tag>
      <s-avatar>
        <s-icon name="cb:user" />
      </s-avatar>
      Icon Default
    </s-tag>
    <s-tag color="primary">
      <s-avatar>
        <s-icon name="cb:send" />
      </s-avatar>
      Icon send
    </s-tag>
    <s-tag color="success">
      <s-avatar>
        <s-icon name="cb:email" />
      </s-avatar>
      Icon markunread
    </s-tag>
    <s-tag color="danger">
      <s-avatar>
        <s-icon name="cb:unlink" />
      </s-avatar>
      Icon link_off
    </s-tag>
    <s-tag color="warning">
      <s-avatar>
        <s-icon name="cb:battery-low" />
      </s-avatar>
      Icon battery_alert
    </s-tag>
    <s-tag color="dark">
      <s-avatar>
        <s-icon name="cb:edit" />
      </s-avatar>
      Icon edit
    </s-tag>
  </div>
</template>

<style scoped lang="scss">
.tag-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
