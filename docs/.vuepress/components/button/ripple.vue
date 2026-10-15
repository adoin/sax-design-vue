<template>
  <div style="width: 100%; display: grid; gap: 20px">
    <p>
      Press different points to compare the wave directions. Enter and Space
      activate from the center; reduced motion uses a brief tint.
    </p>
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      "
    >
      <s-button size="large" block ripple="expand">Expand</s-button>
      <s-button size="large" block ripple="reverse">Contract</s-button>
      <s-button size="large" block ripple="cut">Split</s-button>
      <s-button size="large" block ripple="ring">Ring</s-button>
      <s-button size="large" block>Glow (default)</s-button>
    </div>
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      "
    >
      <s-button size="large" block type="flat" ripple="expand">Expand</s-button>
      <s-button size="large" block type="flat" ripple="reverse"
        >Contract</s-button
      >
      <s-button size="large" block type="flat" ripple="cut">Split</s-button>
      <s-button size="large" block type="flat" ripple="ring">Ring</s-button>
      <s-button size="large" block type="flat" ripple="glow"
        >Glow (default)</s-button
      >
    </div>
  </div>
</template>
