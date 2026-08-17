<template>
  <router-link
    :title="title"
    :to="link || ''"
    :active-class="''"
    :exact-active-class="''"
    class="sidebar-link"
    :class="{
      active,
      'sidebar-update': isUpdate,
    }"
  >
    {{ text }}
    <span v-if="isUpdate" class="sidebar-update-badge">{{
      t.shell.update
    }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { isMatchedHeader, isMathcedPath } from '../../util'
import { useDocLocaleUi } from '../../composables/docLocale'

const props = defineProps<{
  text: string
  link: string
  isUpdate?: boolean

  isHeaderLink?: boolean
}>()

const route = useRoute()
const { t } = useDocLocaleUi()

const title = computed(() => {
  if (props.isUpdate) return `${props.text} ${t.value.shell.update}`
  return props.text
})

const active = ref(false)

const updateActive = () => {
  active.value = props.isHeaderLink
    ? isMatchedHeader(route, props.link)
    : isMathcedPath(route, props.link)
}

watch(() => (props.isHeaderLink ? route.hash : route.path), updateActive, {
  immediate: true,
})
</script>

<style lang="scss">
@use '../../styles/use' as *;

.sidebar-update-badge {
  margin-left: 0.35rem;
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.2;
  vertical-align: middle;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.sidebar-update-badge {
  color: #ffba00;
  background: rgba(255, 186, 0, 0.12);
}
.sidebar-update {
  position: relative;
  color: #ffba00 !important;
  opacity: 1 !important;
  &:after {
    background: #ffba00 !important;
  }
}
.sidebar {
  .sidebar-sub-headers {
    padding-left: 1rem;
    font-size: 0.95em;
  }
}
a {
  &.sidebar-link {
    font-size: 0.95rem;
    font-weight: 400;
    display: inline-block;
    color: -color('theme-color');
    padding: 0.3rem 1rem 0.3rem 1.25rem;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.25s ease;
    opacity: 0.5;
    font-weight: normal;
    position: relative;
    margin-left: 0px;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      left: 0px;
      width: 5px;
      background: -color('theme-color');
      height: 0px;
      transition: all 0.25s ease;
      border-radius: 0px 5px 5px 0px;
    }
    &.active {
      &:after {
        height: 30px;
      }
    }
  }
}
a.sidebar-link.active,
a.sidebar-link:hover {
  opacity: 1;
}
.sidebar-group {
  a {
    &.sidebar-link {
      padding-left: 2rem;
    }
  }
}
.sidebar-sub-headers {
  a {
    &.sidebar-link {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      border-left: none;
      &.active {
        font-weight: 500;
      }
    }
  }
}
</style>
