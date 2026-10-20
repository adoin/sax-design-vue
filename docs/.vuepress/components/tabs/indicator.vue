<template>
  <s-config-provider :tabs="{ showIndicator: true, indicatorPosition: 'top' }">
    <s-tabs>
      <s-tab :name="0" label="Overview">Top indicator</s-tab>
      <s-tab :name="1" label="Activity">Activity content</s-tab>
    </s-tabs>
    <s-tabs :show-indicator="false">
      <s-tab :name="0" label="Overview">Hidden indicator</s-tab>
    </s-tabs>
    <s-tabs indicator-position="bottom">
      <s-tab :name="0" label="Overview">Local override</s-tab>
    </s-tabs>
  </s-config-provider>
</template>
