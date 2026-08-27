---
PROPS:
  - name: underline
    type: Boolean
    values: true | false
    description: 控制悬停或键盘聚焦时是否显示下划线。
    default: true
  - name: underline-effect
    type: String
    values: default | slide | center | double | highlight
    description: 下划线动效；支持左向右、中心展开、双线和标记效果，均兼容跨行文本。
    default: default
  - name: href
    type: String
    values: URL
    description: 链接目标。
    default: null
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: 语义颜色；`status` 为别名。
    default: primary
description: '支持语义状态的文本链接。'
EVENTS:
  - name: click
    type: MouseEvent
    description: 可用链接被激活时触发。
---

# Link 链接

<card><template #example><link-default /></template><template #template>

@[code](../../.vuepress/components/link/default.vue)

</template></card>
