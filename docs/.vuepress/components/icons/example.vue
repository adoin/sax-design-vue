<template>
  <div class="icon-example">
    <s-icon name="cb:add" size="20" />
    <s-icon name="cb:notification" size="24" color="primary" />
    <s-icon name="bx:book" size="28" color="#7d33ff" />
    <s-icon name="cb:arrow-right" size="28" :rotate="-45" />
    <s-icon
      name="cb:circle-dash"
      size="28"
      color="success"
      rolling
      label="Default rolling speed"
    />
    <s-icon
      name="cb:renew"
      size="28"
      color="primary"
      :rolling="1.8"
      label="Slow rolling speed"
    />
  </div>
</template>

<style scoped>
.icon-example {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 96px;
  color: rgb(var(--sax-text));
}
</style>
