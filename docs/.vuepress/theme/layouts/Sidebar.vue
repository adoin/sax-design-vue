<template>
  <div class="clean">
    <s-sidebar v-model="active" :open="openSidebar" :reduce="reduce">
      <template #logo>
        <img src="/logos/logo-vuesax-logotipo-vuesax-png-3.png" alt="" />
      </template>
      <template #header>
        <s-avatar>
          <img src="/avatars/avatar-5.png" alt="" />
        </s-avatar>
      </template>

      <s-sidebar-group>
        <template #header>
          <s-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-sitemap" />
            </template>
            Items
          </s-sidebar-item>
        </template>

        <s-sidebar-item id="home">
          <template #icon>
            <i class="bx bx-home" />
          </template>
          Home
        </s-sidebar-item>
        <s-sidebar-item id="docs">
          <template #icon>
            <i class="bx bx-book-open" />
          </template>
          Documents the new
        </s-sidebar-item>
        <s-sidebar-group>
          <template #header>
            <s-sidebar-item arrow>
              <template #icon>
                <i class="bx bx-archive" />
              </template>
              Children
            </s-sidebar-item>
          </template>

          <s-sidebar-item id="news">
            <template #icon>
              <i class="bx bx-news" />
            </template>
            News
          </s-sidebar-item>
          <s-sidebar-item id="Playlist">
            <template #icon>
              <i class="bx bxs-playlist" />
            </template>
            Playlist
          </s-sidebar-item>
        </s-sidebar-group>
      </s-sidebar-group>

      <s-sidebar-item id="Artist">
        <template #icon>
          <i class="bx bxs-bar-chart-alt-2" />
        </template>
        Artist
      </s-sidebar-item>
      <s-sidebar-item id="chat">
        <template #icon>
          <i class="bx bx-chat" />
        </template>
        Chat
      </s-sidebar-item>
      <s-sidebar-item id="Songs">
        <template #icon>
          <i class="bx bx-music" />
        </template>
        Songs
      </s-sidebar-item>
      <template #footer>
        <s-button flat icon><i class="bx bxs-cog" /></s-button>
      </template>
    </s-sidebar>

    <div class="div">
      <s-button @click="reduce = !reduce"> click toggle </s-button>
      <s-button @click="openSidebar = !openSidebar"> Open sidebar </s-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reduce = ref<boolean>(false)
const active = ref<string>('docs')
const openSidebar = ref<boolean>(false)
const activeSidebar = ref<boolean>(false)

const handleChange = (val: string) => {
  active.value = val
}

defineExpose({
  activeSidebar,
  handleChange,
})
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  border: 0px;
  background: #f5f5f5;
  .div {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
