<template>
  <div class="hidden">
    <s-sidebar v-model="active" background="primary" text-white absolute open>
      <s-sidebar-item id="home">
        <template #icon>
          <s-icon  name="bx:home" />
        </template>
        Home
      </s-sidebar-item>
      <s-sidebar-item id="market">
        <template #icon>
          <s-icon  name="bx:grid-alt" />
        </template>
        Market Overview
      </s-sidebar-item>
      <s-sidebar-item id="Music">
        <template #icon>
          <s-icon  name="bxs:music" />
        </template>
        Music
      </s-sidebar-item>
      <s-sidebar-group>
        <template #header>
          <s-sidebar-item arrow>
            <template #icon>
              <s-icon  name="bx:group" />
            </template>
            Social media
          </s-sidebar-item>
        </template>

        <s-sidebar-item id="Instagram">
          <template #icon>
            <s-icon  name="bxl:instagram" />
          </template>
          Instagram
        </s-sidebar-item>
        <s-sidebar-item id="twitter">
          <template #icon>
            <s-icon  name="bxl:twitter" />
          </template>
          Twitter
        </s-sidebar-item>
        <s-sidebar-item id="Facebook">
          <template #icon>
            <s-icon  name="bxl:facebook" />
          </template>
          Facebook
        </s-sidebar-item>
      </s-sidebar-group>
      <s-sidebar-group>
        <template #header>
          <s-sidebar-item arrow>
            <template #icon>
              <s-icon  name="bx:code-alt" />
            </template>
            Coding
          </s-sidebar-item>
        </template>

        <s-sidebar-item id="github">
          <template #icon>
            <s-icon  name="bxl:github" />
          </template>
          Github
        </s-sidebar-item>
        <s-sidebar-item id="codepen">
          <template #icon>
            <s-icon  name="bxl:codepen" />
          </template>
          Codepen
        </s-sidebar-item>
        <s-sidebar-item id="discord">
          <template #icon>
            <s-icon  name="bxl:discord" />
          </template>
          Discord
        </s-sidebar-item>
        <s-sidebar-item id="Javascript">
          <template #icon>
            <s-icon  name="bxl:javascript" />
          </template>
          Javascript
        </s-sidebar-item>
        <s-sidebar-item id="git">
          <template #icon>
            <s-icon  name="bxl:git" />
          </template>
          Git
        </s-sidebar-item>
      </s-sidebar-group>
      <s-sidebar-item id="donate">
        <template #icon>
          <s-icon  name="bxs:donate-heart" />
        </template>
        Donate
      </s-sidebar-item>
      <s-sidebar-item id="drink">
        <template #icon>
          <s-icon  name="bx:drink" />
        </template>
        Drink
      </s-sidebar-item>
      <s-sidebar-item id="shopping">
        <template #icon>
          <s-icon  name="bxs:shopping-bags" />
        </template>
        Shopping
      </s-sidebar-item>
      <s-sidebar-item id="chat">
        <template #icon>
          <s-icon  name="bx:chat" />
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
  .s-avatar {
    margin-top: 10px;
  }
}
</style>
