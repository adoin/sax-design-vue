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
      box-shadow: 0px 20px 35px -10px rgba(var(--sax-primary, 0.5));
      background: rgba(var(--sax-primary));
      &:hover {
        box-shadow: 0px 0px 0px 0px rgba(var(--sax-primary, 0.5));
      }
    }
    &.success {
      box-shadow: 0px 20px 35px -10px rgba(var(--sax-success, 0.5));
      background: rgba(var(--sax-success));
      &:hover {
        box-shadow: 0px 0px 0px 0px rgba(var(--sax-success, 0.5));
      }
    }
    &.danger {
      box-shadow: 0px 20px 35px -10px rgba(var(--sax-danger, 0.5));
      background: rgba(var(--sax-danger));
      &:hover {
        box-shadow: 0px 0px 0px 0px rgba(var(--sax-danger, 0.5));
      }
    }
    &.warn {
      box-shadow: 0px 20px 35px -10px rgba(var(--sax-warn, 0.5));
      background: rgba(var(--sax-warn));
      &:hover {
        box-shadow: 0px 0px 0px 0px rgba(var(--sax-warn, 0.5));
      }
    }
    &.dark {
      box-shadow: 0px 20px 35px -10px rgba(var(--sax-dark, 0.5));
      background: rgba(var(--sax-dark));
      &:hover {
        box-shadow: 0px 0px 0px 0px rgba(var(--sax-dark, 0.5));
      }
    }
    &:hover {
      transform: translate(0, 5px);
    }
  }
}
</style>
