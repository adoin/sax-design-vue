---
PROPS:
  - name: content
    type: String
    values: text
    description: Announcement text when no default slot is supplied.
    default: null
  - name: type
    type: String
    values: info | success | warning | danger
    description: Semantic announcement tone.
    default: info
  - name: scrollable
    type: Boolean
    values: true | false
    description: Enables marquee animation.
    default: true
  - name: closable
    type: Boolean
    values: true | false
    description: Shows a close control.
    default: false
EVENTS:
  - name: close
    description: Fired when closed.
description: "VXE-compatible notice bar for persistent announcements."
---

# Notice bar

<card><template #example><notice-bar-default /></template><template #template>

@[code{1-3}](../.vuepress/components/notice-bar/default.vue)

</template></card>
