---
PROPS:
  - name: title
    type: String
    values: 文档标题
    description: 打印窗口标题。
    default: document title
  - name: print-style
    type: String
    values: CSS 文本
    description: 注入打印窗口的额外 CSS。
    default: "''"
  - name: auto-close
    type: Boolean
    values: true / false
    description: 打印后关闭打印窗口。
    default: 'true'
METHODS:
  - name: print
    description: 打开仅包含默认插槽内容的打印窗口。
EVENTS:
  - name: before-print / after-print / error
    description: 打印生命周期事件。
description: "VXE 风格局部打印容器。"
---

# 打印

<card><template #example><print-default /></template><template #template>

@[code{1-3}](../../.vuepress/components/print/default.vue)

</template></card>
