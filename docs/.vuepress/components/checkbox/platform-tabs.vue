<script lang="ts" setup>
import { ref } from 'vue'

const tabs = [
  {
    label: 'Facebook',
    value: 'facebook',
    options: [
      {
        label: '动态',
        value: 'feed',
        options: [
          { label: 'Facebook Feed', value: 'facebook_feed' },
          { label: 'Facebook Marketplace', value: 'marketplace' },
          { label: 'Facebook Video Feeds', value: 'video_feeds' },
        ],
      },
      {
        label: '搜索结果',
        value: 'search',
        options: [{ label: 'Facebook Search Results', value: 'search_result' }],
      },
    ],
  },
  {
    label: 'Instagram',
    value: 'instagram',
    options: [
      {
        label: '动态',
        value: 'feed',
        options: [
          { label: 'Instagram Feed', value: 'instagram_feed' },
          { label: 'Instagram Profile Feed', value: 'profile_feed' },
          { label: 'Instagram Explore', value: 'explore' },
          { label: 'Instagram Explore Home', value: 'explore_home' },
        ],
      },
      {
        label: '搜索结果',
        value: 'search',
        options: [
          { label: 'Instagram Search Results', value: 'instagram_search' },
        ],
      },
      {
        label: '快拍和 Reels',
        value: 'story_reels',
        options: [
          { label: 'Instagram Stories', value: 'stories' },
          { label: 'Instagram Reels', value: 'reels' },
          { label: 'Instagram Profile Reels', value: 'profile_reels' },
        ],
      },
    ],
  },
  {
    label: 'Messenger',
    value: 'messenger',
    options: [
      {
        label: '收件箱',
        value: 'inbox',
        options: [
          { label: 'Messenger Inbox', value: 'messenger_inbox' },
          { label: 'Messenger Stories', value: 'messenger_stories' },
        ],
      },
    ],
  },
  {
    label: 'Audience Network',
    value: 'audience_network',
    options: [
      {
        label: '应用和网站',
        value: 'apps_sites',
        options: [
          { label: 'Native, Banner and Interstitial', value: 'native_banner' },
          { label: 'Rewarded Video', value: 'rewarded_video' },
        ],
      },
    ],
  },
]

const value = ref({
  facebook: ['facebook_feed', 'marketplace'],
  instagram: ['instagram_feed', 'explore', 'stories', 'reels'],
  messenger: ['messenger_inbox'],
  audience_network: [],
})
</script>

<template>
  <div class="checkbox-group-tabs-demo">
    <s-checkbox-group-tabs v-model="value" :tabs="tabs" :columns="2" />
  </div>
</template>

<style scoped>
.checkbox-group-tabs-demo {
  width: min(100%, 760px);
}
</style>
