<template>
  <vs-list>
    <vs-list-header title="Users" color="danger" />
    <vs-list-item title="Steve Jobes" subtitle="Top Contributor">
      <template #avatar>
        <vs-avatar>
          <i class="material-icons notranslate">person</i>
        </vs-avatar>
      </template>
    </vs-list-item>
    <vs-list-item title="Matt" subtitle="11 Points">
      <template #avatar>
        <vs-avatar>
          <template #text>Vuesax</template>
        </vs-avatar>
      </template>
    </vs-list-item>
    <vs-list-header title="Profile photo" color="warning" />
    <vs-list-item
      title="Xian Famous Foods"
      subtitle="A taste of Shaanxi's delicious culinary traditions, with delights like spicy cold noodles and lamb burgers."
    >
      <template #avatar>
        <vs-avatar>
          <template #text>Vue</template>
        </vs-avatar>
      </template>
    </vs-list-item>
  </vs-list>
</template>
