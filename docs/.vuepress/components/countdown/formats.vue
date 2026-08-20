<script setup lang="ts">
import { shallowRef } from 'vue'
import type {
  CountdownEffect,
  CountdownFormatter,
} from '@vuesax-alpha/components/countdown'

const shortDuration = 125 * 1000
const longDuration = (25 * 60 * 60 + 65) * 1000
const fastDuration = 10 * 60 * 1000
const totalSecondsDeadline = shallowRef(Date.now() + shortDuration)
const minutesDeadline = shallowRef(Date.now() + shortDuration)
const hoursDeadline = shallowRef(Date.now() + longDuration)
const fastDeadline = shallowRef(Date.now() + fastDuration)
const selectedEffect = shallowRef<CountdownEffect>('flip')
const effectOptions: Array<{ label: string; value: CountdownEffect }> = [
  { label: 'Default / 默认', value: 'default' },
  { label: 'Flip / 翻牌', value: 'flip' },
  { label: 'Fade / 淡入淡出', value: 'fade' },
  { label: 'Particle / 粒子', value: 'particle' },
  { label: 'Slide / 滑动', value: 'slide' },
]

const restartTotalSeconds = () => {
  totalSecondsDeadline.value = Date.now() + shortDuration
}
const restartMinutes = () => {
  minutesDeadline.value = Date.now() + shortDuration
}
const restartHours = () => {
  hoursDeadline.value = Date.now() + longDuration
}
const restartFast = () => {
  fastDeadline.value = Date.now() + fastDuration
}

const formatFastCountdown: CountdownFormatter = ({
  totalSeconds,
  minutes,
  seconds,
}) => `${totalSeconds} sec · ${minutes}m ${seconds}s`
</script>

<template>
  <div class="countdown-formats-demo">
    <div class="countdown-formats-demo__controls">
      <span class="countdown-formats-demo__control-label">
        Digit effect / 数字动效
      </span>
      <s-radio-group
        v-model="selectedEffect"
        :options="effectOptions"
        name="countdown-effect"
        aria-label="Digit effect / 数字动效"
      />
    </div>

    <div class="countdown-formats-demo__item">
      <span class="countdown-formats-demo__label">Total seconds / 总秒数</span>
      <s-countdown
        :value="totalSecondsDeadline"
        format="ss"
        :effect="selectedEffect"
        @finish="restartTotalSeconds"
      />
    </div>

    <div class="countdown-formats-demo__item">
      <span class="countdown-formats-demo__label"
        >Minutes : seconds / 分 : 秒</span
      >
      <s-countdown
        :value="minutesDeadline"
        format="mm:ss"
        :effect="selectedEffect"
        @finish="restartMinutes"
      />
    </div>

    <div class="countdown-formats-demo__item">
      <span class="countdown-formats-demo__label"
        >Hours : minutes : seconds / 时 : 分 : 秒</span
      >
      <s-countdown
        :value="hoursDeadline"
        format="HH:mm:ss"
        :effect="selectedEffect"
        @finish="restartHours"
      />
    </div>

    <div class="countdown-formats-demo__item">
      <span class="countdown-formats-demo__label"
        >4× formatter / 4 倍速自定义显示</span
      >
      <s-countdown
        :value="fastDeadline"
        :speed="4"
        :effect="selectedEffect"
        :formatter="formatFastCountdown"
        @finish="restartFast"
      />
    </div>
  </div>
</template>

<style scoped>
.countdown-formats-demo {
  display: grid;
  width: min(100%, 860px);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  gap: 20px;
}

.countdown-formats-demo__controls {
  display: flex;
  grid-column: 1 / -1;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
}

.countdown-formats-demo__control-label {
  color: var(--sax-text-color);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.4;
}

.countdown-formats-demo__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.countdown-formats-demo__label {
  color: var(--sax-text-color);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
}
</style>
