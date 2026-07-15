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
      <s-button flat icon>
        <i class="bx bx-play" />
      </s-button>
      <s-button flat icon>
        <i class="bx bx-pause" />
      </s-button>
      <s-button flat icon>
        <i class="bx bx-fast-forward" />
      </s-button>
      <s-button flat icon>
        <i class="bx bx-shuffle" />
      </s-button>
    </s-button-group>

    <span class="divider" />

    <s-button-group>
      <s-button border> <i class="bx bxs-pencil" /> Edit </s-button>
      <s-button border icon>
        <i class="bx bx-font-color" />
      </s-button>
      <s-button border icon>
        <i class="bx bx-align-middle" />
      </s-button>
      <s-button border> <i class="bx bx-font-size" /> Font size </s-button>
    </s-button-group>

    <span class="divider" />

    <s-button-group>
      <s-button relief> <i class="bx bx-home-alt" /> Home </s-button>
      <s-button relief> <i class="bx bxs-phone-call" /> Contact </s-button>
      <s-button relief loading>
        <i class="bx bxs-cart-alt" /> Products
      </s-button>
      <s-button relief upload> <i class="bx bxs-envelope" /> Send </s-button>
    </s-button-group>
  </div>
</template>

<style lang="scss" scoped>
.center {
  flex-wrap: wrap;

  .vs-button__group {
    margin: 20px 20px;
  }
}
</style>
