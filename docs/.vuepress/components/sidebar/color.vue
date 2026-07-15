<template>
  <div class="hidden">
    <s-sidebar v-model="active" background="primary" text-white absolute open>
      <s-sidebar-item id="home">
        <template #icon>
          <i class="bx bx-home" />
        </template>
        Home
      </s-sidebar-item>
      <s-sidebar-item id="market">
        <template #icon>
          <i class="bx bx-grid-alt" />
        </template>
        Market Overview
      </s-sidebar-item>
      <s-sidebar-item id="Music">
        <template #icon>
          <i class="bx bxs-music" />
        </template>
        Music
      </s-sidebar-item>
      <s-sidebar-group>
        <template #header>
          <s-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-group" />
            </template>
            Social media
          </s-sidebar-item>
        </template>

        <s-sidebar-item id="Instagram">
          <template #icon>
            <i class="bx bxl-instagram" />
          </template>
          Instagram
        </s-sidebar-item>
        <s-sidebar-item id="twitter">
          <template #icon>
            <i class="bx bxl-twitter" />
          </template>
          Twitter
        </s-sidebar-item>
        <s-sidebar-item id="Facebook">
          <template #icon>
            <i class="bx bxl-facebook" />
          </template>
          Facebook
        </s-sidebar-item>
      </s-sidebar-group>
      <s-sidebar-group>
        <template #header>
          <s-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-code-alt" />
            </template>
            Coding
          </s-sidebar-item>
        </template>

        <s-sidebar-item id="github">
          <template #icon>
            <i class="bx bxl-github" />
          </template>
          Github
        </s-sidebar-item>
        <s-sidebar-item id="codepen">
          <template #icon>
            <i class="bx bxl-codepen" />
          </template>
          Codepen
        </s-sidebar-item>
        <s-sidebar-item id="discord">
          <template #icon>
            <i class="bx bxl-discord" />
          </template>
          Discord
        </s-sidebar-item>
        <s-sidebar-item id="Javascript">
          <template #icon>
            <i class="bx bxl-javascript" />
          </template>
          Javascript
        </s-sidebar-item>
        <s-sidebar-item id="git">
          <template #icon>
            <i class="bx bxl-git" />
          </template>
          Git
        </s-sidebar-item>
      </s-sidebar-group>
      <s-sidebar-item id="donate">
        <template #icon>
          <i class="bx bxs-donate-heart" />
        </template>
        Donate
      </s-sidebar-item>
      <s-sidebar-item id="drink">
        <template #icon>
          <i class="bx bx-drink" />
        </template>
        Drink
      </s-sidebar-item>
      <s-sidebar-item id="shopping">
        <template #icon>
          <i class="bx bxs-shopping-bags" />
        </template>
        Shopping
      </s-sidebar-item>
      <s-sidebar-item id="chat">
        <template #icon>
          <i class="bx bx-chat" />
        </template>
        Chat
      </s-sidebar-item>
    </s-sidebar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('home')
</script>

<style lang="scss" scoped>
.hidden {
  overflow: hidden;
  position: relative;
  min-height: 700px;
  .vs-avatar {
    margin-top: 10px;
  }
}
</style>
