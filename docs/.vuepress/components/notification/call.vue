<template>
  <div class="call">
    <img src="/woman.jpg" :alt="labels.caller" />
    <footer>
      <s-button color="dark" icon :aria-label="labels.video">
        <s-icon name="bx:video-off" />
      </s-button>
      <s-button color="success" icon :aria-label="labels.answer">
        <s-icon name="bxs:phone-call" />
      </s-button>
      <s-button color="dark" icon :aria-label="labels.microphone">
        <s-icon name="bx:microphone-off" />
      </s-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SButton, SIcon } from 'sax-design-vue'

const route = useRoute()
const labels = computed(() =>
  route.path.startsWith('/zh/')
    ? {
        caller: '来电联系人',
        video: '关闭视频',
        answer: '接听电话',
        microphone: '关闭麦克风',
      }
    : {
        caller: 'Incoming caller',
        video: 'Turn off video',
        answer: 'Answer call',
        microphone: 'Mute microphone',
      },
)
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
