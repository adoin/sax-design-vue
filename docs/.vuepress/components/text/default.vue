<template>
  <div class="text-demo">
    <div class="text-demo__item">
      <span class="text-demo__label">Typing / 打字效果</span>
      <s-text
        content="像 ChatGPT 一样，让内容随着思路一个字一个字自然出现。"
        status="primary"
        :typing="45"
      />
    </div>

    <div class="text-demo__item">
      <span class="text-demo__label">Line clamp / 文本省略</span>
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
