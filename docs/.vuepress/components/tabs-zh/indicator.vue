<template>
  <s-config-provider :tabs="{ showIndicator: true, indicatorPosition: 'top' }">
    <s-tabs>
      <s-tab :name="0" label="概览">顶部指示线</s-tab>
      <s-tab :name="1" label="活动">活动内容</s-tab>
    </s-tabs>
    <s-tabs :show-indicator="false">
      <s-tab :name="0" label="概览">隐藏指示线</s-tab>
    </s-tabs>
    <s-tabs indicator-position="bottom">
      <s-tab :name="0" label="概览">局部覆盖</s-tab>
    </s-tabs>
  </s-config-provider>
</template>
