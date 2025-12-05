<template>
  <div class="pdf-preview-view">
    <h1>PDF Preview</h1>
    <p>This view is intended for previewing PDF documents.</p>
    <iframe :src="url" width="100%" height="100%"></iframe>
  </div>
</template>

<script setup>
const url = "path/to/your/pdf/file.pdf"; // Replace with the actual PDF file URL or path
</script>

<style lang="less">

</style>