<template>
  <div class="play-container demo">
    <vs-list>
      <vs-list-item title="Inbox" subtitle="12 unread messages" icon="mail" />
      <vs-list-item title="Drafts" subtitle="3 items" icon="drafts" />
      <vs-list-item title="Trash" subtitle="Empty" icon="delete" />
    </vs-list>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  width: min(520px, 90vw);
}
</style>
