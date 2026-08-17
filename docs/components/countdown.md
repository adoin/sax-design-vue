---
PROPS:
  - name: auto-start
    type: Boolean
    values: true | false
    description: Start the countdown automatically after mounting.
    default: true
  - name: value
    type: Number
    values: timestamp
    description: Target timestamp in milliseconds.
    default: null
  - name: format
    type: String
    values: DD HH mm ss
    description: Display format tokens.
    default: HH:mm:ss
EVENTS:
  - name: finish
    description: Fired at zero.
  - name: change
    description: Remaining milliseconds change.
description: "Countdown display."
---
# Countdown
<card><template #example><countdown-default /></template><template #template>

@[code{1-7}](../.vuepress/components/countdown/default.vue)

</template></card>
