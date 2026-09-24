<template>
  <div class="text-demo">
    <div class="text-demo__item">
      <span class="text-demo__label">Effect</span>
      <div class="text-demo__effects">
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "shimmer"</span>
          <s-text
            content="Generating response…"
            effect="shimmer"
            status="primary"
          />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "rainbow"</span>
          <s-text content="Spectrum" effect="rainbow" />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "neon"</span>
          <s-text content="Neon signal" effect="neon" status="primary" />
        </div>
        <div class="text-demo__effect">
          <span class="text-demo__value">effect = "shadow"</span>
          <s-text content="Moving shadow" effect="shadow" status="info" />
        </div>
      </div>
    </div>

    <div class="text-demo__item">
      <span class="text-demo__label">Typing</span>
      <s-text
        content="Reveal an answer naturally, one character at a time."
        effect="typing"
        status="primary"
      />
    </div>

    <div class="text-demo__item">
      <span class="text-demo__label">Line clamp</span>
      <span class="text-demo__value">line-clamp = false</span>
      <s-text
        content="False shows the full text without a line limit or ellipsis."
        :line-clamp="false"
      />
      <span class="text-demo__value">line-clamp = 1</span>
      <s-text
        content="With line clamp set to 1, long text is truncated on one line with an ellipsis."
        :line-clamp="1"
      />
      <span class="text-demo__value">line-clamp = 2</span>
      <s-text
        content="With line clamp set to 2, text uses at most two lines so cards and list rows can keep a stable height."
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
