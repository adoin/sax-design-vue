<template>
  <div class="center">
    <s-button color="danger" @click="active = !active"> 打开对话框 </s-button>
    <s-dialog v-model="active" prevent-close>
      <template #header>
        <h4 class="not-margin">欢迎使用 <b>Sax Design</b></h4>
      </template>

      <div class="con-form">
        <s-input v-model="input1" block placeholder="邮箱">
          <template #icon> @ </template>
        </s-input>
        <s-input v-model="input2" block type="password" placeholder="密码">
          <template #icon>
            <s-icon name="bxs:lock" />
          </template>
        </s-input>
        <div class="flex">
          <s-checkbox v-model="checkbox1">记住我</s-checkbox>
          <a href="#">忘记密码？</a>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <s-button block> 登录 </s-button>

          <div class="new">还没有账号？ <a href="#">创建账号</a></div>
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
  @return unquote('hsl(var(--sax-#{$color}) / #{$alpha})');
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
