<template>
  <div class="text-demo">
    <s-text content="Semantic text" status="primary" />
    <s-text
      content="This long text is safely truncated in constrained layouts."
      ellipsis
    />
    <s-text
      content="Two line truncation keeps a card layout stable when body copy varies in length."
      :line-clamp="2"
    />
  </div>
</template>

<style scoped>
.text-demo {
  display: grid;
  max-width: 300px;
  gap: 12px;
}
</style>
