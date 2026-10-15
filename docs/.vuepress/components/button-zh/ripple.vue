<template>
  <div style="width: 100%; display: grid; gap: 20px">
    <p>
      在按钮的不同位置按下，观察光波方向。也可聚焦后用 Enter
      或空格触发；减弱动态效果模式会改为短暂明暗反馈。
    </p>
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      "
    >
      <s-button size="large" block ripple="expand">向外扩散</s-button>
      <s-button size="large" block ripple="reverse">向内收拢</s-button>
      <s-button size="large" block ripple="cut">两侧分离</s-button>
      <s-button size="large" block ripple="ring">光环扩散</s-button>
      <s-button size="large" block>柔光脉冲（默认）</s-button>
    </div>
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      "
    >
      <s-button size="large" block type="flat" ripple="expand"
        >向外扩散</s-button
      >
      <s-button size="large" block type="flat" ripple="reverse"
        >向内收拢</s-button
      >
      <s-button size="large" block type="flat" ripple="cut">两侧分离</s-button>
      <s-button size="large" block type="flat" ripple="ring">光环扩散</s-button>
      <s-button size="large" block type="flat" ripple="glow"
        >柔光脉冲（默认）</s-button
      >
    </div>
  </div>
</template>
