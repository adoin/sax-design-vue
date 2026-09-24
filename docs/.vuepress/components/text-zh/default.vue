<template>
  <div class="text-demo">
    <div class="text-demo__item">
      <span class="text-demo__label">文字特效</span>
      <div class="text-demo__effects">
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "shimmer"</span>
          <s-text content="正在生成回答…" effect="shimmer" status="primary" />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "rainbow"</span>
          <s-text content="彩虹变色" effect="rainbow" />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "neon"</span>
          <s-text content="霓虹信号" effect="neon" status="primary" />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "shadow"</span>
          <s-text content="移动光影" effect="shadow" status="info" />
        </div>
      </div>
    </div>

    <div class="text-demo__item">
      <span class="text-demo__label">打字效果</span>
      <s-text
        content="像 ChatGPT 一样，让内容随着思路一个字一个字自然出现。"
        effect="typing"
        status="primary"
      />
    </div>

    <div class="text-demo__item">
      <span class="text-demo__label">文本省略</span>
      <span class="text-demo__value">line-clamp = false</span>
      <s-text
        content="False 会完整展示文本，不限制行数，也不会添加省略号。"
        :line-clamp="false"
      />
      <span class="text-demo__value">line-clamp = 1</span>
      <s-text
        content="Line clamp 设为 1 时，较长的文字会在同一行末尾自动显示省略号。"
        :line-clamp="1"
      />
      <span class="text-demo__value">line-clamp = 2</span>
      <s-text
        content="Line clamp 设为 2 时，文本最多展示两行，适合需要保持高度稳定的卡片和列表内容。设为 false 时则会完整显示，不进行省略。"
        :line-clamp="2"
      />
    </div>
  </div>
</template>

<style scoped>
.text-demo {
  display: grid;
  max-width: 420px;
  gap: 24px;
}

.text-demo__item {
  display: grid;
  gap: 10px;
}

.text-demo__effects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.text-demo__effect {
  display: grid;
  align-content: center;
  gap: 9px;
  min-height: 74px;
  padding: 12px;
  border-radius: var(--sax-radius-sm);
  background: var(--sax-css-color-gray-1);
}

.text-demo__label {
  color: var(--sax-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.text-demo__value {
  width: fit-content;
  padding: 2px 7px;
  border-radius: var(--sax-radius-xs);
  background: hsl(var(--sax-fill-color-light));
  color: var(--sax-text-color-secondary);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
</style>
