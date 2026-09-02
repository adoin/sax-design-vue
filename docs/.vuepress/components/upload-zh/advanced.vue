<template>
  <s-upload accept=".pdf,.doc,.docx" :limit="2" :upload-method="uploadMethod">
    <template #trigger="{ choose, disabled }">
      <div class="custom-trigger">
        <s-icon name="cb:folder-open" />
        <div>
          <strong>导入文档</strong>
          <span>支持 PDF 或 Word 文件</span>
        </div>
        <s-button :disabled="disabled" @click.stop="choose">浏览</s-button>
      </div>
    </template>
  </s-upload>
</template>

<script setup lang="ts">
const uploadMethod = async () => ({ ok: true })
</script>

<style scoped>
.custom-trigger {
  display: flex;
  width: min(100%, 520px);
  align-items: center;
  gap: 14px;
}

.custom-trigger > div {
  display: grid;
  flex: 1;
  gap: 2px;
  text-align: left;
}

.custom-trigger span {
  opacity: 0.62;
  font-size: 0.75rem;
}
</style>
