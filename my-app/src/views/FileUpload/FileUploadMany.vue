<template>
  <div class="big-file-upload-single">
    <el-card class="box-card">
        <template #header>
          <span>多文件上传</span>
        </template>
        <el-form :model="form" label-width="120px">
            <el-form-item label="文件名称">
                <el-input v-model="form.name" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="上传文件">
                <!-- :action="'https://jsonplaceholder.typicode.com/posts/'"自动上传属性 -->
                 <!-- :limit="1"  最大上传文件数量 :on-exceed="handleExceed"  超出数量限制时的钩子
                 accept=".jpg,.png"  接受上传的文件类型 :before-upload="beforeUpload" 上传文件之前的钩子 -->
                 <!-- :on-change="handleChange" 多文件上传时触发的钩子 -->
                <el-upload
                    v-mode:fileList="fileList"
                    class="upload-demo"
                    :http-request="uploadFile"
                    :limit="3"
                    :on-exceed="handleExceed"
                    accept=".jpg,.png"
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    multiple
                >
                    <el-button  type="primary">点击上传</el-button>
                    <template #tip>
                      <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </template>
                </el-upload>
            </el-form-item>
            <!-- 提交按钮 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from '../../api/request';
import { ElNotification } from 'element-plus';

const form = reactive({
    name: '',
    file:'',
});

const fileList = ref([

]);

const uploadFile = async (file) => {
    // form.file = file.file;
}
const handleChange = (file, fileList) => {
    form.file = fileList;
}
const submitForm = async () => {
    let formData = new FormData();
    formData.append('name', form.name);
    // formData.append('file', form.file);
    form.file.forEach(element => {
        formData.append('file', element.raw);
    });
    let res = await axios.post('/api/upload/fileUploadMany', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log(res);
    if(res.code === 200) {
        ElNotification({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
        });
    } else {
        ElNotification({
            title: '错误',
            message: '文件上传失败',
            type: 'error',
        });
    }   
}

const handleExceed = () => {
    ElNotification({
        title: '警告',
        message: '超出文件数量限制',
        type: 'warning',
    });
}
const beforeUpload = (file) => {
    const { type, size } = file;
    const isLt2M = size / 1024 / 1024 < 2;
    if(!isLt2M) {
        ElNotification({
            title: '错误',
            message: '上传文件大小不能超过2MB!',
            type: 'error',
        });
    }
    return isLt2M;
}

</script>

<style scoped lang="less">
.big-file-upload-single {
  padding: 20px;
}
</style>
