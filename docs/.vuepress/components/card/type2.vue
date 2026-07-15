<template>
  <div class="center">
    <s-card type="2">
      <template #title>
        <h3>Change destiny</h3>
      </template>
      <template #img>
        <img src="/foto6.png" alt="" />
      </template>
      <template #text>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      </template>
      <template #interactions>
        <s-button color="danger" icon>
          <i class="bx bx-heart" />
        </s-button>
        <s-button class="btn-chat" type="shadow">
          <i class="bx bx-chat" />
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
