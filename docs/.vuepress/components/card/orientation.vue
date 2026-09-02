<template>
  <div class="orientation-grid">
    <s-card
      orientation="vertical"
      variant="outlined"
      title="Vertical"
      subtitle="Media above content"
      text="Suitable for galleries, products, and article summaries."
    >
      <template #media>
        <img src="/foto2.jpg" alt="Abstract artwork in warm colors" />
      </template>
    </s-card>

    <s-card
      orientation="horizontal"
      variant="soft"
      color="success"
      title="Horizontal"
      subtitle="Media beside content"
      text="Reflows to a vertical card on narrow screens."
    >
      <template #media>
        <img src="/foto1.png" alt="Portrait used in the horizontal card" />
      </template>
      <template #actions>
        <s-button color="success" type="flat">View details</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.orientation-grid {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 12px;
}
</style>
