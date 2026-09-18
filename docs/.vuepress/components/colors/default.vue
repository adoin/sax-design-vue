<template>
  <div class="center colors">
    <div class="primary">Primary</div>
    <div class="success">Success</div>
    <div class="danger">Danger</div>
    <div class="warn">Warn</div>
    <div class="dark">Dark</div>
  </div>
</template>

<style scoped lang="scss">
.colors {
  padding-bottom: 50px;
  div {
    color: #fff;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: 10px;
    border-radius: 6px 20px 20px 20px;
    transition: all 0.25s ease;
    cursor: default;
    &.primary {
      box-shadow: 0px 20px 35px -10px
        color-mix(in srgb, var(--sax-css-primary) 50%, transparent);
      background: var(--sax-css-primary);
      &:hover {
        box-shadow: 0px 0px 0px 0px
          color-mix(in srgb, var(--sax-css-primary) 50%, transparent);
      }
    }
    &.success {
      box-shadow: 0px 20px 35px -10px
        color-mix(in srgb, var(--sax-css-success) 50%, transparent);
      background: var(--sax-css-success);
      &:hover {
        box-shadow: 0px 0px 0px 0px
          color-mix(in srgb, var(--sax-css-success) 50%, transparent);
      }
    }
    &.danger {
      box-shadow: 0px 20px 35px -10px
        color-mix(in srgb, var(--sax-css-danger) 50%, transparent);
      background: var(--sax-css-danger);
      &:hover {
        box-shadow: 0px 0px 0px 0px
          color-mix(in srgb, var(--sax-css-danger) 50%, transparent);
      }
    }
    &.warn {
      box-shadow: 0px 20px 35px -10px
        color-mix(in srgb, var(--sax-css-warn) 50%, transparent);
      background: var(--sax-css-warn);
      &:hover {
        box-shadow: 0px 0px 0px 0px
          color-mix(in srgb, var(--sax-css-warn) 50%, transparent);
      }
    }
    &.dark {
      box-shadow: 0px 20px 35px -10px
        color-mix(in srgb, var(--sax-css-dark) 50%, transparent);
      background: var(--sax-css-dark);
      &:hover {
        box-shadow: 0px 0px 0px 0px
          color-mix(in srgb, var(--sax-css-dark) 50%, transparent);
      }
    }
    &:hover {
      transform: translate(0, 5px);
    }
  }
}
</style>
