---
PROPS:
  - name: model-value/v-model
    type: String
    values: password
    description: 密码值。
    default: "''"
  - name: show-password
    type: Boolean
    values: true / false
    description: 显示可见性切换。
    default: 'true'
  - name: clearable
    type: Boolean
    values: true / false
    description: 显示清空操作。
    default: 'false'
EVENTS:
  - name: change / clear
    description: 值变化和清空事件。
description: "兼容 VXE 的密码输入框。"
---

# Password input 密码输入框

<card><template #example><password-input-default /></template><template #template>

@[code{1-5}](../../.vuepress/components/password-input/default.vue)

</template></card>
