---
description: 'Table 的表格式交互功能、配置方式与可运行示例。'
---

# 表格式交互指南

<card class="table-doc-section-start">

## 表格式交互

这里介绍接近电子表格的操作，包括键盘导航、区域选择、剪贴板、查找、菜单和行拖拽。

### 键盘导航

显式开启 `keyboard-config` 后，未编辑时方向键按可见列顺序移动，Tab / Shift + Tab 跨行移动；到达当前页首尾时保留浏览器原生 Tab 行为。编辑时，Tab / Shift + Tab 会先提交当前单元格，再按从左到右、从上到下的顺序切换到下一个或上一个可编辑单元格；会跳过无编辑器、被禁用、只读或被 `editableMethod` 排除的单元格。提交校验未通过时保持当前编辑状态。固定列参与相同导航顺序，隐藏列会被跳过。不会自动翻页。

`v-model:active-cell` 保存 `{ rowKey, columnKey }`，与 `v-model:highlight` 行选择独立。普通列使用 `key`、`field`，未命名列使用 `@原始索引`；需要持久保存地址时请提供稳定键。排序、重排列后跟随同一行键和列键；筛选、折叠、翻页或隐藏列使目标不可见时请求清空。受控模型需接受更新。

<template #example><table-zh-keyboard /></template>

<template #template>

@[code{18-57}](../../../.vuepress/components/table-zh/keyboard.vue)

</template>

<template #script>

@[code{1-16}](../../../.vuepress/components/table-zh/keyboard.vue)

</template>

<template #style>

@[code{59-66}](../../../.vuepress/components/table-zh/keyboard.vue)

</template>

</card>

<card>

### 跨虚拟窗口导航

生成源地址的 `columnKey` 是列源索引的字符串。通过 `keyboardConfig.rowIndexOf(key)` 将行键映射到绝对源行索引，便于受控模型定位或数据重排后跟随行键；组件不会扫描生成数据寻找行。未提供解析器时，只能跟随本次导航已知且仍匹配的行位置。

本例按需生成 100 万行、10 万列。点击末格后可用方向键跨越虚拟窗口、进入右固定列；单元格定位只挂载当前窗口。`setActiveCell` 对生成源使用绝对源索引；目标不在当前页、列被隐藏、模型拒绝或定位取消时返回 false。

<template #example><table-zh-keyboard-source /></template>

<template #template>

@[code{26-45}](../../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

<template #script>

@[code{1-24}](../../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

<template #style>

@[code{47-60}](../../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

</card>

<card>

### 单元格区域选择

设置 `range-config` 后，拖动单元格建立矩形选区；Shift + 点击或 Shift + 方向键扩展选区，Ctrl / Command + A 选择当前视图，Escape 清空。拖动至可见区域边缘会自动滚动，Escape 可取消拖动并恢复原选区。选区与行高亮、活动单元格分别管理。

`v-model:cell-range` 保存稳定的 `{ anchor, focus }` 地址，合并单元格会完整纳入范围。排序或列重排后跟随行列键，隐藏端点、折叠分组或翻页使端点不可见时请求清空。受控模型需接受更新。

<template #example><table-zh-range /></template>

<template #template>

@[code{21-66}](../../../.vuepress/components/table-zh/range.vue)

</template>

<template #script>

@[code{1-19}](../../../.vuepress/components/table-zh/range.vue)

</template>

<template #style>

@[code{68-75}](../../../.vuepress/components/table-zh/range.vue)

</template>

</card>

<card>

### 巨量数据的区域选择

此例按需生成 100 万行、10 万列，固定列与中心列共用逻辑坐标。全表选区只记录端点与边界，不读取全部单元格；渲染仍限于当前窗口。通过 `range-config.rowIndexOf` 将稳定行键映射到绝对源索引，支持视口外的程序选区。

边缘滚动使用内容逻辑像素，在压缩滚动轨道下保持一致速度。合并规则应返回与查询矩形相交的完整区域；极大选区的代价取决于相交合并区域数量，计算可被新手势或上下文变化取消。

<template #example><table-zh-range-source /></template>

<template #template>

@[code{41-81}](../../../.vuepress/components/table-zh/range-source.vue)

</template>

<template #script>

@[code{1-39}](../../../.vuepress/components/table-zh/range-source.vue)

</template>

<template #style>

@[code{83-96}](../../../.vuepress/components/table-zh/range-source.vue)

</template>

</card>

<card>

### 复制、剪切与粘贴

开启 `clipboard-config` 后，使用 Ctrl / Command + C、X、V 操作当前区域；未选区域时使用活动单元格。输入框内部保留原生文本操作。复制只需剪贴板配置；剪切和粘贴还需 `edit-config`、列 `editor` 及 `change-config`，普通数组使用 `v-model:data` 接受变更。

复制同时生成独立二维值和 TSV 文本。粘贴从单个活动格开始时按输入尺寸展开；已有矩形选区必须是输入行列数的整数倍，可用单值填充。只读格保持原位置，不会把后续值左移。合并区域只在起点复制内容，其余位置为空；目标必须覆盖完整合并格，冲突内容会拒绝。`bounds` 使用当前视图可见数据行与视觉列的半开索引，不包括组标题，也不自动翻页。

<template #example><table-zh-clipboard /></template>

<template #template>

@[code{70-124}](../../../.vuepress/components/table-zh/clipboard.vue)

</template>

<template #script>

@[code{1-69}](../../../.vuepress/components/table-zh/clipboard.vue)

</template>

<template #style>

@[code{125-139}](../../../.vuepress/components/table-zh/clipboard.vue)

</template>

</card>

<card>

### 巨量数据的剪贴板

生成源通过 `change-config.indexOf` 定位稳定行键，通过 `apply` 接受字段补丁；本例只保存修改过的值。末端合并区域跨越右固定列，可复制、粘贴和撤销。选择全表后复制会先返回超限结果，避免枚举百万行十万列。区域读取、候选行生成和校验按批让出执行；未加载的远程页或树节点不会被自动读取。

<template #example><table-zh-clipboard-source /></template>

<template #template>

@[code{120-170}](../../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

<template #script>

@[code{1-119}](../../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

<template #style>

@[code{171-185}](../../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

</card>

<card>

### 查找与替换

开启 `find-config` 后显示搜索面板。表格单元格获得焦点时，Ctrl / Command + F 打开查找，Ctrl / Command + H 聚焦替换框，F3 / Shift + F3 导航匹配。面板内按 Enter 执行查找，Escape 取消等待或关闭面板。`panel: false` 用于只通过 API 集成；`keyboard: false` 关闭表格快捷键。

查询按字面文本匹配，可选区分大小写和匹配整个单元格。当前视图搜索当前筛选页中已展开的行；选中区域搜索当前矩形选区。两者按可见视觉列顺序遍历，合并单元格只计一次。已提供数据范围跨页搜索所有已提供的行和已加载的树子节点，不受筛选限制，搜索可见列对应的原始字段；不会请求其他远程页面或懒加载子节点。定位会展开已加载的祖先、分组并请求切页；若筛选隐藏目标行或受控视图拒绝导航，则返回 `false`，不会清除筛选条件。

<template #example><table-zh-find /></template>

<template #template>

@[code{57-103}](../../../.vuepress/components/table-zh/find.vue)

</template>

<template #script>

@[code{1-56}](../../../.vuepress/components/table-zh/find.vue)

</template>

<template #style>

@[code{104-115}](../../../.vuepress/components/table-zh/find.vue)

</template>

</card>

<card>

### 巨量数据查找与替换

`find-config` 默认最多检查 100000 个位置、保留 1000 个匹配格、处理 2000000 文本字符。本例将 `maxCells` 降为 4096。搜索未完成时会保留明确的上限状态，`replaceAll` 拒绝部分结果，`replaceMatch` 仍可替换一个已返回的匹配格。可缩小范围或主动调整上限。对象值需要格式化函数；文本与单元格上限不衡量已提供对象占用的内存。

来源为百万行、十万列。查找已选中的末端合并区域，在面板中填写替换值，即可更新跨固定列边界的合并起点。数据适配器只保存发生变化的字段，定位复用虚拟行列窗口。

<template #example><table-zh-find-source /></template>

<template #template>

@[code{95-135}](../../../.vuepress/components/table-zh/find-source.vue)

</template>

<template #script>

@[code{1-94}](../../../.vuepress/components/table-zh/find-source.vue)

</template>

<template #style>

@[code{136-147}](../../../.vuepress/components/table-zh/find-source.vue)

</template>

</card>

<card>

### 右键菜单

通过 `context-menu-config.header`、`body` 和 `footer` 分别提供菜单项数组，或接收上下文并返回数组的同步函数。`visibleMethod` 返回 false、当前区域没有菜单项或配置关闭时，保留浏览器原生右键菜单。工厂函数异常时同样回退到原生菜单。

`context.area` 区分 `header`、`body` 与 `footer`，三者都有 `column`、`columnIndex`。表头另有 `group`，分组表头提供分组列，索引指向当前渲染标题段的首个叶子列；数据区提供 `row`、`rowKey`、`rowIndex`、原始 `value` 及树节点上下文；表尾提供汇总行、表尾行索引及原始值。`contextMenuSelect` 返回 `{ context, item }`，组件不会自动修改数据或执行删除等业务动作。

<template #example><table-zh-context-menu /></template>

<template #template>

@[code{58-98}](../../../.vuepress/components/table-zh/context-menu.vue)

</template>

<template #script>

@[code{1-56}](../../../.vuepress/components/table-zh/context-menu.vue)

</template>

<template #style>

@[code{100-114}](../../../.vuepress/components/table-zh/context-menu.vue)

</template>

</card>

<card>

### 虚拟数据菜单

`virtualSource` 下的数据行列索引为绝对源索引，表尾 `rowIndex` 仍是表尾数组索引。仅为命中的已渲染单元格构造上下文，不枚举整张数据源。点击末格后按 Shift + F10，可检查末端数据和左右固定列；横向移动后也可打开对应表尾菜单。数据源的变更、滚动或卸载会关闭旧上下文。

<template #example><table-zh-context-menu-source /></template>

<template #template>

@[code{35-57}](../../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

<template #script>

@[code{1-33}](../../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

<template #style>

@[code{59-72}](../../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

</card>

<card>

### 行拖拽排序

开启 `row-drag-config`，在列上设置 `dragSort: true`（嵌套写法使用 `drag-sort`）显示手柄。使用稳定 `row-key` 和 `v-model:data` 接受重排数组。`draggableMethod` 限制可拾取行，`dropMethod` 限制落点；手柄不会触发行选择或编辑。

空格或回车拾取，方向键选择落点，回车放置，Escape 取消。鼠标拖至可滚动窗口边缘会自动滚动，可用 `autoScroll: false` 关闭；`scrollThreshold` 默认 40px，`scrollSpeed` 默认每帧 16px。

<template #example><table-zh-row-drag /></template>

<template #template>

@[code{40-57}](../../../.vuepress/components/table-zh/row-drag.vue)

</template>

<template #script>

@[code{1-38}](../../../.vuepress/components/table-zh/row-drag.vue)

</template>

<template #style>

@[code{59-69}](../../../.vuepress/components/table-zh/row-drag.vue)

</template>

</card>

<card>

### 树形同级重排

树形数据仅在同级之间移动，展开的后代随父节点一起移动；不会把节点重新挂到另一父节点。已加载的懒节点子数组与普通 children 使用相同规则，不请求未加载子节点。重排不会直接修改传入的行对象。下例组合嵌套列、左右固定列、虚拟滚动和动态行高。

<template #example><table-zh-row-drag-tree /></template>

<template #template>

@[code{29-52}](../../../.vuepress/components/table-zh/row-drag-tree.vue)

</template>

<template #script>

@[code{1-27}](../../../.vuepress/components/table-zh/row-drag-tree.vue)

</template>

</card>

<card>

### 生成源拖动与自动滚动

`virtualSource` 必须提供 `rowDragConfig.apply`，接收稳定行键、落点、源绝对位置和 `signal`。生成源请求没有 `data`，由适配器更新数据源及行键映射，再返回 true；组件核对移动行的新位置后报告成功。普通数组也可使用 apply；需先接受请求中的完整 data 数组。返回 false、异常、外部数据替换、取消或卸载均不能报告成功，`cancelRowDrag()` 会立即结束等待；适配器应在写入前检查 signal。

此例按需提供 100 万行、10 万列，仅缓存顺序改变的位置。相邻拖动只更新少量映射，长距离移动的时间和内存与跨越行数成正比；示例分批让出执行并支持取消。业务服务可用稳定行键及前后落点持久化顺序，不必加载完整数据集。

<template #example><table-zh-row-drag-source /></template>

<template #template>

@[code{59-83}](../../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

<template #script>

@[code{1-57}](../../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

<template #style>

@[code{85-98}](../../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

</card>
