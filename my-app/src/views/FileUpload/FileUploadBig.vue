<template>
  <div class="big-file-upload-single">
    <el-card class="box-card">
        <template #header>
          <span>大文件上传</span>
        </template>
        <el-form :model="form" label-width="120px">
            <el-form-item label="文件名称">
                <el-input v-model="form.name" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="上传文件">
                <el-upload
                    class="upload-demo"
                    drag    
                    :limit="1"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                    </div>
                    <template #tip>
                    <div class="el-upload__tip">
                        jpg/png files with a size less than 500kb
                    </div>
                    </template>
                </el-upload>
            </el-form-item>
            <!-- 进度条 -->
            <el-form-item label="上传进度">
                <el-progress 
                style="width: 50%;"
                    :percentage="progress" 
                    :status="progressStatus" 
                    :stroke-width="20" 
                    striped striped-flow
                />
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from '../../api/request';
import { ElNotification } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import SparkMD5 from 'spark-md5';

const form = reactive({
    name: '',
    file:'',
});

//进度条
const progress = ref(0);
const progressStatus = ref(null);

const isUploading = ref(false);

// 删除文件处理函数
const handleRemove = () => {
    // 重置所有状态
    progress.value = 0;
    progressStatus.value = null;
    // showProgress.value = false;
    isUploading.value = false;
    form.name = '';
    form.file = '';
};

const handleChange = (file) => {
    if (isUploading.value) return; // 防重复
    isUploading.value = true;
    progress.value = 0;
    progressStatus.value = null;

    const uploadFile = file.raw;
    // 1. 计算文件MD5
    calculateFileMD5(uploadFile).then(md5 => {
        // 2. 使用这个 md5 作为文件唯一标识 dir
        // 后续的检查、上传、合并请求都带上这个 md5
        return uploadChunks(uploadFile, md5, (p) => {
            progress.value = Math.min(100, Math.floor(p));
        });
    }).then(() => {
        progress.value = 100;
        progressStatus.value = 'success';
        ElNotification({
            title: '上传成功',
            message: '文件上传完成',
            type: 'success',
        });
    }).catch(err => {
        progressStatus.value = 'exception';
        ElNotification({
            title: '上传失败',
            message: `文件上传失败: ${err.message}`,
            type: 'error',
        });
    }).finally(() => {
        isUploading.value = false;
    });
}
// 计算文件MD5的函数
const calculateFileMD5 = (file) => {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            spark.append(e.target.result);
            const md5 = spark.end();
            resolve(md5);
        };
        fileReader.onerror = (e) => {
            reject(e);
        };
        fileReader.readAsArrayBuffer(file);
    });
}
// 封装上传逻辑
const uploadChunks = async (file, dir, onProgress) => {
    // file: 原始文件对象
    // dir: 文件唯一标识 (MD5)
    const { name, size } = file;
    let chunkSize = 1024 * 1024 * 5; // 5MB
    
    // 1. 【检查】向服务器发送请求，检查文件是否已上传或部分上传
    //    参数中带上文件名和文件MD5，服务器根据此来判断
    const response = await axios.get('/api/upload/uploadfilebigInspect', { params: { name, dir } });
    console.log('检查结果:', response);
    //    data.index 是服务器返回的已上传分片的最后一个索引
    let index = response.index || 0;
    let uploadedSize = index * chunkSize;
    onProgress((uploadedSize / size) * 100);
    // 2. 【计算断点】根据已上传的分片索引，计算下一次上传的起始位置
    let start = (index + 1) * chunkSize;

    // 3. 【循环上传分片】只要起始位置小于文件总大小，就继续执行上传
    while (start < size) {
        // ... 创建分片 ...
        const end = Math.min(start + chunkSize, size);
        let blob = null;
        if (start + chunkSize > size) {
            blob = file.slice(start, size);
        } else {
            blob = file.slice(start, start + chunkSize);
        }
        let formData = new FormData();
        let blobFile = new File([blob], name);
        formData.append('file', blobFile);
        formData.append('dir', dir); // 每次请求都带上完整的dir
        formData.append('index', index);

        // 上传分片
        await axios.post('/api/upload/uploadfilebig', formData);
        // 更新本地计数与进度
        uploadedSize += (end - start);
        onProgress?.((uploadedSize / size) * 100);
        index++;
        start = index * chunkSize;
    }

    // 6. 【合并】所有分片上传完成后，向服务器发送合并请求
    //    服务器根据文件名和文件MD5找到所有分片并进行合并
    let extList = name.split('.');//["文件","mp4"]
    let ext = extList[extList.length - 1];
    await axios.post('/api/upload/uploadfilebigMerge', { name, dir, ext });
}



// const handleChange = async (file) => {
//     const uploadFile = file.raw;
//     const { name, size, type } = uploadFile;
//     let index = 0;//默认分片 从0开始
//     let chunkSize = 1024 * 1024 * 5; //每一片的大小 5MB
//     let start = 0;
//     let dir = '';//文件唯一标识 可以用md5等方式生成
//     //检查分片
//     const { data } = await axios.get('/upload/uploadfilebigInspect', { name });
//     index = data.index;

//     //分片上传
//     start = index > 0 ? index * chunkSize : 0;
//     while (start < size) {
//         //分割
//         let blob = null;
//         if (start + chunkSize > size) {
//             blob = uploadFile.slice(start, size);
//         } else {
//             blob = uploadFile.slice(start, start + chunkSize);
//         }
//         start = start + chunkSize;
//         let formData = new FormData();
//         let blobFile = new File([blob], name);
//         formData.append('file', blobFile);
//         formData.append('index', index); 
//         //分片请求
//         const { data } = await axios.post('/upload/uploadfilebig', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         dir = data.dir;
//         index++;
//     }

//     //合并分片
//     //name dir(md5) ext(类型)
//     //文件.mp4
//     let extList = name.split('.');//["文件","mp4"]
//     let ext = extList[extList.length - 1];

//     await axios.post('/upload/uploadfilebigMerge', {name,ext,dir});
// }


</script>

<style scoped lang="less">
.big-file-upload-single {
  padding: 20px;
}
</style>
