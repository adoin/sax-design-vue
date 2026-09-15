<template>
  <div class="con-user-example">
    <header>
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
      <p>Sally Willis</p>

      <s-avatar-group max="7">
        <s-avatar>
          <img src="/avatars/avatar-1.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-6.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-2.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-7.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-3.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-8.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-4.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-9.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-5.png" alt="" />
        </s-avatar>
        <s-avatar>
          <img src="/avatars/avatar-10.png" alt="" />
        </s-avatar>
      </s-avatar-group>
    </header>

    <div class="content-user">
      <p><b>Sally Willis</b> {{ labels.liked }} <b>9</b> {{ labels.others }}</p>
      <s-button color="dark" type="transparent" icon :aria-label="labels.view">
        <s-icon name="bx:chevron-right" />
      </s-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SAvatar, SAvatarGroup, SButton, SIcon } from 'sax-design-vue'

const route = useRoute()
const labels = computed(() =>
  route.path.startsWith('/zh/')
    ? { liked: '赞了你的动态，另有', others: '位用户', view: '查看动态' }
    : {
        liked: 'liked your post with',
        others: 'other users',
        view: 'View activity',
      },
)
</script>

<style lang="scss" scoped>
.con-user-example {
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      min-width: 100px;
      margin-left: 10px;
      font-size: 0.9rem;
    }
  }
  .content-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 0.7rem;
      max-width: 200px;
      padding: 0px;
      margin: 0px;
    }
  }
}
</style>
