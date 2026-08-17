---
PROPS:
  - name: auto-start
    type: Boolean
    values: true | false
    description: 挂载后自动开始倒计时。
    default: true
  - name: value
    type: Number
    values: timestamp
    description: 毫秒级目标时间戳。
    default: null
  - name: format
    type: String
    values: DD HH mm ss
    description: 展示格式标记。
    default: HH:mm:ss
EVENTS:
  - name: finish
    description: 归零时触发。
  - name: change
    description: 剩余毫秒变化时触发。
description: "倒计时展示。"
---
# Countdown 倒计时
<card><template #example><countdown-default /></template><template #template>

@[code{1-7}](../../.vuepress/components/countdown/default.vue)

</template></card>
