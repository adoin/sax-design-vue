---
PROPS:
  - name: model-value / v-model
    type: Number
    values: 轮播项下标
    description: 当前激活项下标。
    default: '0'
  - name: items
    type: CarouselItem[]
    values: '{ name?, label?, src?, alt?, title?, description?, disabled?, ...customData }[]'
    description: 轮播数据；额外业务字段会原样传给 item 插槽。
    default: '[]'
  - name: height
    type: Number | String
    values: CSS 高度
    description: 轮播高度。
    default: '260'
  - name: radius
    type: Boolean | Number | String
    values: true / false / CSS 长度
    description: 统一控制 viewport 与所有轮播项的圆角；false 表示直角。
    default: 'true'
  - name: effect
    type: String
    values: slide / fade / deck / orbit / prism
    description: 切换形态；deck、orbit 与 prism 使用 CSS 3D 透视。
    default: slide
  - name: direction
    type: String
    values: horizontal / vertical
    description: 轮播与控制器方向。
    default: horizontal
  - name: autoplay
    type: Boolean
    values: true / false
    description: 是否自动切换。
    default: 'true'
  - name: interval
    type: Number
    values: 毫秒
    description: 自动切换间隔。
    default: '4000'
  - name: loop
    type: Boolean
    values: true / false
    description: 是否首尾循环。
    default: 'true'
  - name: pause-on-hover
    type: Boolean
    values: true / false
    description: 指针悬停时暂停自动播放。
    default: 'true'
  - name: arrow
    type: String
    values: always / hover / never
    description: 箭头展示时机。
    default: hover
  - name: indicator-position
    type: String
    values: inside / outside / top / bottom / left / right / none
    description: 指示器位置。
    default: inside
  - name: indicator-type
    type: String
    values: dot / line / number
    description: 指示器形态。
    default: line
  - name: trigger
    type: String
    values: click / hover
    description: 指示器触发方式；为保证可访问性，点击始终可用。
    default: click
  - name: transition-duration
    type: Number
    values: 毫秒
    description: 所有效果共用的切换时长。
    default: '480'
  - name: easing
    type: String
    values: CSS timing function
    description: 切换插值函数。
    default: cubic-bezier(.22, .72, 0, 1)
  - name: deck-scale
    type: Number
    values: 0 - 1
    description: deck 模式中第一层非激活卡片的缩放比例。
    default: '0.86'
  - name: deck-visible
    type: Number
    values: 1 - 4
    description: deck 模式中每侧最多展示的非激活卡片层数。
    default: '2'
  - name: deck-blur
    type: Boolean
    values: true / false
    description: deck 模式中是否按距离虚化非激活卡片。
    default: 'false'
  - name: perspective / depth
    type: Number / Number
    values: 像素
    description: 3D 相机透视距离和 Z 轴层级距离。
    default: '1200 / 150'
  - name: orbit-angle
    type: Number
    values: 0 / 12 - 120
    description: orbit 模式中相邻卡片的角度间隔；0 自动按渲染项数均分整圆。
    default: '0'
  - name: orbit-max-visible
    type: Number
    values: 整数，≥ 4
    description: 环形轨道的基础可见卡片数；自动均分为偶数且仍有数据时会额外取 1 张真实卡，更大数据集使用带前后隐藏缓冲项的虚拟窗口。
    default: '10'
  - name: motion-blur
    type: Boolean
    values: true / false
    description: 切换期间增加短暂动态模糊。
    default: 'false'
  - name: draggable / touchable
    type: Boolean / Boolean
    values: true / false
    description: 开启鼠标拖动和触摸滑动。
    default: 'false / true'
  - name: keyboard
    type: Boolean
    values: true / false
    description: 开启方向键、Home 和 End 键盘导航。
    default: 'true'
EVENTS:
  - name: before-change
    description: 状态改变前触发，返回下一个和上一个下标。
  - name: change
    description: 状态改变时触发，返回当前和上一个下标。
  - name: after-change
    description: 配置的切换动画结束后触发。
EXPOSES:
  - name: activeIndex
    description: 只读的当前轮播项下标 ref。
  - name: setActiveItem(index | name)
    description: 按下标或 item name 切换轮播项。
  - name: prev / next
    description: 切换到上一个或下一个可用轮播项。
  - name: play / pause
    description: 命令式恢复或暂停自动播放。
SLOTS:
  - name: item
    description: 自定义轮播内容，接收 item、index、active 和相对 offset。
  - name: prev / next
    description: 自定义箭头内容，接收 disabled。
  - name: indicator
    description: 自定义指示器，接收 item、index 和 active。
description: '支持受控状态、层叠卡组、空间 3D 和无障碍导航的轮播组件。'
---

# Carousel（轮播图）

## 默认

受控下标、自动播放、箭头和线形指示器均提供稳定默认值。

<card><template #example><carousel-default /></template><template #template>

@[code](../../.vuepress/components/carousel/default.vue)

</template></card>

## 卡片层叠

`deck` 统一承载中央卡片与左右后层卡片。通过 `deck-visible` 控制露出层数，通过 `deck-blur` 控制是否虚化；不再为相近视觉维护多套效果类型。

<card><template #example><carousel-deck /></template><template #template>

@[code](../../.vuepress/components/carousel/deck.vue)

</template></card>

## 环形轨道

`orbit` 使用连续相位让下层小卡片绕 Y 轴平滑排列，上层独立渲染更大的 active 卡，并用短促、GPU 友好的交叉消隐完成切换。`orbit-max-visible` 默认是 10；数据更多且基础窗口为偶数时，会额外取 1 张真实卡组成奇数闭环。所有循环轨道都会在窗口两端各保留一张隐藏克隆缓冲卡：离场卡移入背面并淡出，同内容缓冲卡从另一侧淡入，因此首尾不会瞬移。只有真实数据已经全部进入轨道、偶数问题仍无法通过多取 1 张解决时，才渲染一张内部透明、带轮廓的装饰占位卡作为背面穿越位置。少于 4 项时自动克隆填充轨道。设置非零 `orbit-angle` 可覆盖自动间隔。

<card><template #example><carousel-orbit /></template><template #template>

@[code](../../.vuepress/components/carousel/orbit.vue)

</template></card>

## 镜面棱柱

`prism` 让三张卡片围绕同一旋转轴组成棱柱。每个面保持连续旋转相位，侧面会像同一个刚体自然转动，不再单独翻牌。`radius` 同时作用于 viewport 和每张卡片；传 `false` 可使用直角棱面。

<card><template #example><carousel-prism /></template><template #template>

@[code](../../.vuepress/components/carousel/prism.vue)

</template></card>

## 淡入淡出

`fade` 只负责透明度切换；`motion-blur` 可增加短暂动态虚化，同一例子直接比较两种参数状态。

<card><template #example><carousel-fade /></template><template #template>

@[code](../../.vuepress/components/carousel/fade.vue)

</template></card>

## 外部控制

暴露方法支持按名称跳转和显式播放控制。禁用项会被箭头、自动播放、键盘和拖动导航统一跳过。

<card><template #example><carousel-controls /></template><template #template>

@[code](../../.vuepress/components/carousel/controls.vue)

</template></card>
