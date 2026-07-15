<template>
  <div class="call">
    <img src="/woman.jpg" alt="" />
    <footer>
      <s-button color="dark" icon>
        <i class="bx bx-video-off" />
      </s-button>
      <s-button color="success" icon>
        <i class="bx bxs-phone-call" />
      </s-button>
      <s-button color="dark" icon>
        <i class="bx bx-microphone-off" />
      </s-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { SButton } from 'sax-design-vue'
</script>

<style lang="scss" scoped>
.call {
  img {
    min-height: 250px;
    max-height: 250px;
  }
  footer {
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-image: linear-gradient(180deg, transparent 0%, #000 100%);
    padding: 10px;
    .s-button {
      margin: 10px;
    }
  }
}
</style>
