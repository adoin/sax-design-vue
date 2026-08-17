<template>
  <div class="center">
    <s-button-group>
      <s-button> One </s-button>
      <s-button> Two </s-button>
      <s-button> Three </s-button>
      <s-button> four </s-button>
    </s-button-group>

    <span class="divider" />

    <s-button-group>
      <s-button type="flat" icon>
        <s-icon  name="bx:play" />
      </s-button>
      <s-button type="flat" icon>
        <s-icon  name="bx:pause" />
      </s-button>
      <s-button type="flat" icon>
        <s-icon  name="bx:fast-forward" />
      </s-button>
      <s-button type="flat" icon>
        <s-icon  name="bx:shuffle" />
      </s-button>
    </s-button-group>

    <span class="divider" />

    <s-button-group>
      <s-button type="border"> <s-icon  name="bxs:pencil" /> Edit </s-button>
      <s-button type="border" icon>
        <s-icon  name="bx:font-color" />
      </s-button>
      <s-button type="border" icon>
        <s-icon  name="bx:align-middle" />
      </s-button>
      <s-button type="border">
        <s-icon  name="bx:font-size" /> Font size
      </s-button>
    </s-button-group>

    <span class="divider" />

    <s-button-group>
      <s-button type="relief"> <s-icon  name="bx:home-alt" /> Home </s-button>
      <s-button type="relief">
        <s-icon  name="bxs:phone-call" /> Contact
      </s-button>
      <s-button type="relief" loading>
        <s-icon  name="bxs:cart-alt" /> Products
      </s-button>
      <s-button type="relief" upload>
        <s-icon  name="bxs:envelope" /> Send
      </s-button>
    </s-button-group>
  </div>
</template>

<style lang="scss" scoped>
.center {
  flex-wrap: wrap;

  .s-button__group {
    margin: 20px 20px;
  }
}
</style>
