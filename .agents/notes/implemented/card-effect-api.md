---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-22
modules:
  - packages/components/card
  - packages/theme-chalk/src/card.scss
  - docs/components/card.md
  - docs/zh/components/card.md
supersedes: []
---

# Card 布局、纹理与特效分离

## 用户原始需求

> card增加一个入参effect，同时要对card的type增加一个默认值 default，就是渐渐淡淡title body的那种card，在antdv element+中都很常见的那种。 effect和type是不同的，type 是管布局，effect是特效。

## 已确认的项目规格

- `type="default"` 是新的隐式默认布局，使用克制的标题区、正文区和可选操作区；原有 `classic` 名称与媒体优先布局保持不变。
- 数字兼容值不因新增 `default` 重新编号，仍按 1-5 映射到 `classic`、`overlay`、`split`、`frosted`、`reveal`。
- `type`、`texture`、`effect` 是三条可独立组合的轴：`type` 管布局，`texture` 管底材，`effect` 管交互或边缘装饰。纹理层与特效层使用独立 DOM 层，不得互相覆盖。
- Card 不再提供额外的 `variant` 表面样式轴；先前的六种 `variant` 与对应示例、综合配置控件已按用户决定移除，避免与 `type` 和 `texture` 重叠。
- `orientation="horizontal"` 适用于全部具名 `type`；媒体优先型需把图片与内容并排，同时保留遮罩、磨砂、浮现等可辨识表现，`profile` 保留头像处理。不可禁用横排或让原预设静默忽略横排。图片只继承与外框接触的角，`shape="square"` 在悬停时也维持直角。
- `texture="default"` 不添加材质层，保持常规纯色表面；`effect="default"` 不添加装饰层。
- `texture="liquid-glass"` 必须通过 SVG `feTurbulence`、模糊噪声和 `feDisplacementMap` 对真实背景产生可观察的光学位移，不能用透明度、渐变或普通模糊冒充折射。每个 Card 实例使用 SSR 稳定且唯一的滤镜 ID；不支持 URL backdrop filter 时降级为饱和模糊玻璃。
- 液态镜片在位移层之上保留轻量的饱和、亮度与 3px backdrop blur，文字使用高亮白标题与柔和浅色正文。文档示例的两个背景色球使用不同周期的 transform 动画，并在 reduced-motion 下保持静止。
- 位移滤镜只处理内部背景，平滑边框由未参与 displacement 的 Card 外壳绘制。紧凑卡片使用经过平滑的噪声（`stdDeviation=4`）和 48px 位移幅度，避免边缘出现锯齿状采样断层。
- `texture="liquid-glass-2"` 作为第二套 SVG 光学滤镜对照：使用 component transfer、specular lighting、composite 与 150px displacement，并通过 `filter: url(...)` 处理已经 3px backdrop blur 的纹理层。它必须与 `liquid-glass` 共用标题、正文、尺寸、边框、tint、shine 和动态背景，只允许滤镜图与必要的滤镜应用路径不同。
- `effect="spotlight"` 使用遮罩边框与局部指针坐标；每个 Card 只监听自身指针事件，通过单个 `requestAnimationFrame` 合并同一帧更新，不注册全局监听。
- `effect="gradient-glow"` 使用随指针角度旋转的多色锥形边框、模糊外层光晕和低透明度内部径向微光；它与单色局部 `spotlight` 保持明确区别。
- 特效层不改变 Card 的布局、插槽、内容交互和辅助技术语义；装饰元素始终 `aria-hidden` 且不接收指针事件。
- 液态背景动画和 Spotlight 透明度过渡遵循 `prefers-reduced-motion`。

## 实现与验证

- 组件行为测试覆盖新的默认布局、显式 `classic` 兼容、全部具名类型、纹理/特效与布局组合、纹理与特效同时渲染、Spotlight 局部坐标追踪。
- 主题契约测试覆盖液态背景、遮罩边框与 reduced-motion 降级。
- `CardType`、`CardTexture` 与 `CardEffect` 作为公开别名进入递归 API 类型详情。
- 中英文文档分别提供 type、texture、effect 以及跨轴组合的完整 SFC 示例，Code 与 Playground 保持同步。
- Card 文档正文与其他组件保持一致：每张示例卡只包含一个二级标题、说明、预览和 Code/Playground。侧栏使用中英文 `EXAMPLE_GROUPS` 元数据将类型、纹理和特效归组，不在第一张示例卡里叠加可见的组标题；所有锚点继续使用与英文页一致的规范 slug。
- 文档最后只保留一个综合配置示例，可实时调节 type、texture、effect、orientation、hover-effect、shape、color 与交互状态；不再保留固定的纹理/特效组合示例。
- `SCardGroup` 已从组件、安装导出、主题样式和文档中完整移除。多卡片的分页、滚动或组合展示统一使用 Carousel 承载，不得恢复 Card 专用容器。
- 通过 Card 与主题定向 Vitest、API 元数据测试、Web 类型检查、主题构建、文档示例测试和完整 VuePress 构建；浏览器验证中英文 Code / Playground 以及 Spotlight 实际指针跟随。

## 参考效果的取舍

- Liquid Glass 参考实现依赖 SVG `feTurbulence` / `feDisplacementMap` 与 `backdrop-filter: url(...)`。早期仅使用 CSS 渐变与背景模糊的方案无法产生真实光学变形，已被明确否定；最终实现保留 SVG 位移机制，并通过实例级唯一 ID 和 CSS 能力检测解决多实例冲突与浏览器降级。
- Spotlight Border 的遮罩边框结构适合作为第二种 Card 特效；实现保留边框内挖空的做法，但把原参考的全局指针监听缩小到当前 Card 实例。
- Gradient Spotlight 参考实现的视觉语言适合作为第三种 Card 特效，但原实现会在容器级 `mousemove` 中遍历全部卡片并逐一读取布局。组件实现只读取当前卡片一次，并与 Spotlight 共用单实例 RAF 合帧管线。
