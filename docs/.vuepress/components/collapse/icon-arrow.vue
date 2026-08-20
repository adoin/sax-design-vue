<template>
  <s-collapse>
    <s-collapse-item>
      <template #header>Collapse item</template>
      <template #icon-arrow="{ open }">
        <SIcon :name="open ? 'cb:chevron-down' : 'cb:chevron-right'" />
      </template>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rhoncus
      eros tortor, non fringilla lectus cursus et.
    </s-collapse-item>
    <s-collapse-item>
      <template #header>Collapse item 2</template>
      <template #icon-arrow="{ open }">
        <SIcon :name="open ? 'cb:subtract' : 'cb:add'" />
      </template>
      Nunc auctor et leo vitae suscipit. Nullam aliquet purus scelerisque enim
      hendrerit tristique.
    </s-collapse-item>
    <s-collapse-item disabled>
      <template #header>Collapse item 3 - Disabled</template>
      <template #icon-arrow>
        <SIcon name="cb:chevron-right" />
      </template>
      Suspendisse aliquet condimentum diam, sed aliquam nisl dapibus et.
    </s-collapse-item>
    <s-collapse-item>
      <template #header>Collapse item 4</template>
      <template #icon-arrow>
        <SIcon name="cb:chevron-down" />
      </template>
      Suspendisse aliquet condimentum diam, sed aliquam nisl dapibus et. Aliquam
      euismod ullamcorper dolor eu imperdiet.
    </s-collapse-item>
  </s-collapse>
</template>

<script setup lang="ts">
import { SIcon } from 'sax-design-vue'
</script>
