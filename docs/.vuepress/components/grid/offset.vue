<template>
  <div>
    <s-row>
      <s-col :push="6" :span="2"> offset = 6 </s-col>
    </s-row>

    <s-row>
      <s-col :push="2" :span="2"> offset = 2 </s-col>
    </s-row>

    <s-row>
      <s-col :push="8" :span="2"> offset = 8 </s-col>
    </s-row>

    <s-row>
      <s-col :push="7" :span="2"> offset = 7 </s-col>
    </s-row>

    <s-row>
      <s-col :push="4" :span="2"> offset = 4 </s-col>
    </s-row>
  </div>
</template>
<style scoped lang="scss">
@function -var($var) {
  @return unquote('var(--s-' + var + ')');
}
@function -color($color, $alpha: 1) {
  @return unquote('rgba(var(--s-#{$color}), #{$alpha})');
}
.grid {
  border-radius: 20px;
  overflow: hidden;
  padding: 0px;
}
.s-row {
  background: -color('theme-layout');
  border-bottom: 1px dashed -color('theme-bg2');
}
.s-col {
  padding: 10px;
  text-align: center;
  background: -color('theme-bg2');
  cursor: default;
  transition: all 0.25s ease;
  box-shadow: inset 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: scale(0.93);
    box-shadow: inset 0px 10px 20px -10px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 500px) {
  .s-col {
    font-size: 0.6rem;
    font-weight: bold;
    padding: 10px 2px;
  }
}
</style>
