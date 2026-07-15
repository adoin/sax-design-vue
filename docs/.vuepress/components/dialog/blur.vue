<template>
  <div class="center">
    <s-button dark @click="active = !active"> Open Dialog </s-button>
    <s-dialog v-model="active" overlay-blur>
      <template #header>
        <h4 class="not-margin">Welcome to <b>Vuesax</b></h4>
      </template>

      <div class="con-form">
        <s-input v-model="input1" placeholder="Email">
          <template #icon> @ </template>
        </s-input>
        <s-input v-model="input2" type="password" placeholder="Password">
          <template #icon>
            <i class="bx bxs-lock" />
          </template>
        </s-input>
        <div class="flex">
          <s-checkbox v-model="checkbox1">Remember me</s-checkbox>
          <a href="#">Forgot Password?</a>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <s-button block> Sign In </s-button>

          <div class="new">New Here? <a href="#">Create New Account</a></div>
        </div>
      </template>
    </s-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(false)
const input1 = ref('')
const input2 = ref('')
const checkbox1 = ref(false)
</script>

<style lang="scss" scoped>
@function -color($color, $alpha: 1) {
  @return unquote('rgba(var(--s-#{$color}), #{$alpha})');
}
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}
.con-form {
  width: 100%;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      font-size: 0.8rem;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
  .s-checkbox__label {
    font-size: 0.8rem;
  }
  .s-input {
    margin: 10px 0px;
    width: calc(100%);
    .s-input__original {
      width: 100%;
    }
  }
}
.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
  .new {
    margin: 0px;
    margin-top: 20px;
    padding: 0px;
    font-size: 0.7rem;
    a {
      color: -color('primary') !important;
      margin-left: 6px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .s-button {
    margin: 0px;
  }
}
</style>
