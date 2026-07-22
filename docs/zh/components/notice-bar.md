---
PROPS:
  - name: content
    type: String
    values: text
    description: 未传默认插槽时的公告文本。
    default: null
  - name: type
    type: String
    values: info | success | warning | danger
    description: 公告语义色。
    default: info
  - name: scrollable
    type: Boolean
    values: true | false
    description: 启用滚动动画。
    default: true
  - name: closable
    type: Boolean
    values: true | false
    description: 显示关闭按钮。
    default: false
EVENTS:
  - name: close
    description: 关闭时触发。
description: "兼容 VXE 的持续公告栏。"
---

# Notice bar 公告栏

<card><template #example><notice-bar-default /></template><template #template>

@[code{1-3}](../../.vuepress/components/notice-bar/default.vue)

</template></card>
