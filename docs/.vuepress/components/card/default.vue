<template>
  <div class="center">
    <s-card
      title="Trendy clothing"
      text="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
    >
      <template #img>
        <img :src="`/foto5.png`" alt="" />
      </template>
      <template #interactions>
        <s-button color="danger" icon>
          <s-icon  name="bx:heart" />
        </s-button>
        <s-button class="btn-chat" type="shadow">
          <s-icon  name="bx:chat" />
          <span class="span"> 54 </span>
        </s-button>
      </template>
    </s-card>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.btn-chat {
  i {
    font-size: 1.2rem;
  }
  .span {
    padding-left: 5px;
    font-weight: bold;
  }
}
</style>
