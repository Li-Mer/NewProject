<template>
    <div class="pdf-preview">
        <h2>PDF 预览组件</h2>
        <!-- <div class="toolbar">
            <input type="file" accept="application/pdf" class="" @change="onFileChange" />
        </div> -->
        <div class="header" style="border: 1px solid grey; margin-bottom: 20px;">
            <div class="handleFile">
                <el-button type="danger" @click="checkPdfFile">选择PDF文档</el-button>
                <span style="margin-left: 10px;">{{pdfFileName}}</span>
                <input type="file" id="pdf-file-input" style="display: none;" @change="onFileChange"/>
            </div>
            <el-button type="info" @click="clear">清空数据</el-button>
        </div>
        <iframe v-if="viewerSrc" :src="viewerSrc" width="100%" height="100%"  style="overflow: hidden;"></iframe>
        <div v-else style="padding:12px;color:#666;">请选择一个本地 PDF 文件进行预览</div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const viewerBase = '/pdf/web/viewer.html'
const viewerSrc = ref('')
let currentBlobUrl = null

const pdfFileName = ref('未选择文件');
function checkPdfFile() {
    document.getElementById('pdf-file-input').click();
}
function onFileChange(e) {
    const file = e.target.files?.[0];
    if(file.type !== 'application/pdf') {
        console.warn('所选文件不是 PDF');
        return;
    }
    if(currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
    }
    pdfFileName.value = file.name;
    console.log('选择的文件:', file);
    currentBlobUrl = URL.createObjectURL(file);
    console.log('生成的 Blob URL:', currentBlobUrl);//生成的 Blob URL: blob:http://localhost:5173/8e3389d3-6eaf-4638-96b1-f8e2b8f84a0c
    console.log('预览链接:', `${viewerBase}?file=${encodeURIComponent(currentBlobUrl)}`);
    // encodeURIComponent 用于把 blob URL 安全放入查询参数，防止特殊字符打断 URL。
    //预览链接: /pdf/web/viewer.html?file=blob%3Ahttp%3A%2F%2Flocalhost%3A5173%2F8e3389d3-6eaf-4638-96b1-f8e2b8f84a0c
    viewerSrc.value = `${viewerBase}?file=${encodeURIComponent(currentBlobUrl)}`;
}
function clear() {
    pdfFileName.value = '未选择文件';
    viewerSrc.value = '';
    if(currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
    }
    const input = document.getElementById('pdf-file-input');
    if (input) input.value = '';
}
onBeforeUnmount(() => {
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
})

</script>

<style lang="less">
.header {
  padding: 20px;
  display: flex;
    justify-content: space-between;
}
.pdf-preview {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.toolbar {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
iframe {
    flex: 1;
}
</style>