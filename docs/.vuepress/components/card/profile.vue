<template>
  <div class="center">
    <s-card
      type="profile"
      title="Maya Chen"
      subtitle="Product designer"
      text="Designing calm, accessible tools for creative teams."
    >
      <template #media>
        <img src="/avatars/avatar-4.png" alt="Portrait of Maya Chen" />
      </template>

      <div class="profile-stats" aria-label="Profile statistics">
        <span><strong>128</strong> Projects</span>
        <span><strong>8.4k</strong> Followers</span>
        <span><strong>96%</strong> Rating</span>
      </div>

      <template #actions>
        <s-button color="primary">View profile</s-button>
        <s-button type="flat">Message</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  span {
    display: grid;
    gap: 2px;
    color: hsl(var(--sax-text) / 0.62);
    font-size: 0.72rem;
  }

  strong {
    color: hsl(var(--sax-text));
    font-size: 1rem;
  }
}
</style>
