<template>
  <div class="effect-demo effect-demo--liquid">
    <s-card texture="liquid-glass" title="Liquid glass">
      <p>
        The displacement map visibly bends the stripes and color fields behind
        this transparent optical surface.
      </p>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.effect-demo {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  padding: 68px 36px;
  border-radius: var(--sax-radius-xl);
}

.effect-demo--liquid {
  background:
    repeating-linear-gradient(
      118deg,
      transparent 0 52px,
      rgb(255 255 255 / 10%) 53px 55px,
      transparent 56px 104px
    ),
    #171b42;
}

.effect-demo--liquid::before,
.effect-demo--liquid::after {
  position: absolute;
  width: clamp(170px, 31%, 230px);
  aspect-ratio: 1;
  border-radius: 50%;
  content: '';
}

.effect-demo--liquid::before {
  left: 9%;
  background: linear-gradient(145deg, #ff0099, #c21dcc 58%, #fa00ff);
  animation: liquid-orb-left 8s ease-in-out infinite alternate;
}

.effect-demo--liquid::after {
  right: 8%;
  background: linear-gradient(145deg, #04d9c4, #0bbbea 58%, #12b8db);
  animation: liquid-orb-right 9.5s ease-in-out -3s infinite alternate;
}

.effect-demo :deep(.s-card) {
  z-index: 1;
  display: flex;
  min-height: 240px;
  flex-direction: column;
  justify-content: center;
  max-width: 380px;
  color: #fff;
}

.effect-demo :deep(.s-card.is-texture-liquid-glass .s-card__body) {
  color: rgb(240 240 255 / 92%);
  text-align: center;
}

.effect-demo :deep(.s-card.is-texture-liquid-glass .s-card__header) {
  justify-content: center;
  padding-bottom: 0;
  border-bottom: 0;
}

.effect-demo :deep(.s-card.is-texture-liquid-glass .s-card__header-content) {
  text-align: center;
}

.effect-demo :deep(.s-card.is-texture-liquid-glass .s-card__title-text) {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@keyframes liquid-orb-left {
  from {
    transform: translate3d(-18px, 14px, 0) scale(0.96);
  }

  to {
    transform: translate3d(34px, -18px, 0) scale(1.07);
  }
}

@keyframes liquid-orb-right {
  from {
    transform: translate3d(22px, -16px, 0) scale(1.04);
  }

  to {
    transform: translate3d(-36px, 20px, 0) scale(0.94);
  }
}

@media (prefers-reduced-motion: reduce) {
  .effect-demo--liquid::before,
  .effect-demo--liquid::after {
    animation: none;
  }
}
</style>
