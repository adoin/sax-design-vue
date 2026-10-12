---
status: implemented
kind: project-specification
completed_at: 2026-10-12
modules:
  - packages/components/message
  - packages/components/message-scroller
---

# Role-specific hover actions in Message Scroller

## 用户要求

> message-scroller hover的时候应该有类似的按钮，ai和人的消息块不一样

## Contract

- SMessage defaults to actions for assistant and user roles. Assistant actions are copy, like, dislike, regenerate; user actions are copy and edit. System/tool roles remain action-free unless explicitly enabled.
- The edit event requests a user-message edit. Feedback remains controlled through v-model:feedback; selected votes can be cleared. Disabled and loading messages keep normal actions blocked.
- All action buttons share a private MessageAction wrapper and STooltip/SPopper; tooltips teleport, track position, and show on hover or keyboard focus. Rounded Agent controls remain fixed. Only voting buttons expose aria-pressed.
- Inside SMessageScroller, action rows keep their measured footprint and reveal on message hover or focus-within. User actions align right; assistant actions align left. Coarse-pointer and non-hover devices keep actions visible with 44px targets.
- Built-in items rendering enables role actions in both virtual and plain modes. message-action includes item, index, action, optional feedback, and optional copy error. Feedback state is keyed by stable message id using Map so virtual unmount/remount and arbitrary string ids remain safe.
- Custom message slots use SMessage events directly. Both localized basic and virtual examples support editing/saving/canceling, controlled feedback, and replacing a response without implementing request transport in the component.

## Verification

- 47 Agent component tests pass, including distinct role action sets, edit requests, associated default-data actions, vote selection and clearing.
- 21 documentation tests pass; web, Playground, and Vitest type checks and theme build pass.
- All four bilingual scroller examples verified through Code and Playground.
- Browser: hidden action opacity 0; hover/focus opacity 1; hover leaves measured assistant height unchanged at approximately 85.6px. User actions align flex-end.
- Native pointer editing/save updates the user bubble; Enter also submits. Vote state, tooltip teleport, and role-specific action counts verified. Screenshot saved under .codex/previews/message-scroller-actions.png.
