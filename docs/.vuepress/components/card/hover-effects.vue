<template>
  <div class="effect-grid">
    <s-card
      interactive
      hover-effect="none"
      variant="outlined"
      title="None"
      text="Stable surface without decorative movement."
      aria-label="Open card without a hover effect"
    />
    <s-card
      interactive
      hover-effect="lift"
      title="Lift"
      text="Raises the surface on hover and keyboard focus."
      aria-label="Open card with a lift effect"
    />
    <s-card
      interactive
      hover-effect="glow"
      variant="outlined"
      color="success"
      title="Glow"
      text="Uses the semantic color for focus and edge emphasis."
      aria-label="Open card with a glow effect"
    />
  </div>
</template>

<style lang="scss" scoped>
.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 12px;
}
</style>
