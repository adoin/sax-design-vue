<template>
  <s-list>
    <s-list-header title="Users" color="danger" />
    <s-list-item title="Steve Jobes" subtitle="Top Contributor">
      <template #avatar>
        <s-avatar>
          <i class="material-icons notranslate">person</i>
        </s-avatar>
      </template>
    </s-list-item>
    <s-list-item title="Matt" subtitle="11 Points">
      <template #avatar>
        <s-avatar>
          <template #text>Vuesax</template>
        </s-avatar>
      </template>
    </s-list-item>
    <s-list-header title="Profile photo" color="warning" />
    <s-list-item
      title="Xian Famous Foods"
      subtitle="A taste of Shaanxi's delicious culinary traditions, with delights like spicy cold noodles and lamb burgers."
    >
      <template #avatar>
        <s-avatar>
          <template #text>Vue</template>
        </s-avatar>
      </template>
    </s-list-item>
  </s-list>
</template>
