---
status: implemented
kind: project-specification
updated_at: 2026-10-20
scope:
  - packages/components/icon
  - docs/icons
  - docs/zh/icons
---

# Icon morph 使用统一几何与颜色内核

- 统一按需加载 `svg-morpheus-ts/core`（当前固定 1.5.2），移除项目内置几何算法。不再提供 engine 配置、旧引擎别名或引擎类型；动画事件只报告 elapsed。
- Vue composable 负责生命周期、配置、减少动态效果、取消与精确目标恢复；DOM adapter 只读取 SVG、变换和绘制属性。几何匹配、颜色与渐变插值及绘制组渲染属于共享 core。
- 同一个原始 path 的复合轮廓必须作为一条路径进入 core，保留孔洞。不得把复合轮廓分别填充。
- 支持多色、四/八位 alpha 十六进制、现代 RGB/HSL、预乘 alpha 插值、线性/径向渐变、继承色标与透明度组。同类型渐变连续插值，异类型或不兼容坐标系使用隔离加法混合交叉过渡，避免中间帧透底。
- `g opacity` 保留合成层级，不乘入子路径。读取中断后的绘制层时保留 isolation 与 plus-lighter，以便从当前显示结果继续。
- SIcon 静态、SSR 与动画结束的原图使用实例稳定的 useId 前缀隔离 SVG IDs，同步更新 url、href 和 ARIA 引用，避免多个图标的渐变冲突。
- 蒙版、滤镜、图案与其他不支持的内容保留静态 SVG。全局 icon.morph 与局部覆盖、SSR、卸载取消及事件时序保持原契约。
- 公开文档先展示最小 morph 用法，再提供展开收起、固定、显示隐藏、多色与渐变等具名场景。单个演示使用带可见标签的示例、时长、效果控件及场景说明，不展示算法回归场景、压测、卸载控件或计时数据。算法与压力验证保留在测试中；Code 与 Playground 源码完整且本地化。

## 验证

- svg-morpheus-ts 43 tests、Node-only types、实际打包 ESM/CJS 消费验证通过；1.5.2 npm publish 退出 0。
- 组件库 7 个测试文件、43 tests 通过；Web 与 Vitest 类型检查通过；文档检查 22 tests 通过；235 页生产构建通过。
- 生产浏览器验证渐变中间帧、正确路径范围、隔离加法混合、父组透明度与 20 次连续切换；中英文 Code 和 Playground 均能加载完整示例，中文预览验证渐变交互。
