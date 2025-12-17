<template>
  <div class="FormValidatorEasy">
    <h1>简单验证</h1>
    <el-card class="register-form" style="border-radius: 20px; padding: 20px;">
        <h2>欢迎注册</h2>
        <el-form class="form" :model="formData" :rules="registerRulesEasy" ref="formRef" label-width="80px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username"  placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-button class="submit-button" type="primary" @click="submitForm">注册</el-button>
        </el-form>
    </el-card>
    
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AsyncValidator from 'async-validator';
import { ElMessage } from 'element-plus';

const formData = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})
const formRef = ref(null);

const registerRulesEasy = {
    username: [
        { required: true, message: "用户名不能为空" },
        { min: 3, max: 15, message: "用户名长度应在3到15个字符之间" }
    ],
    password: [
        { required: true, message: "密码不能为空" },
        { 
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/, 
            message: '密码需包含字母和数字，长度 6-16 字符' 
        }
    ],
    confirmPassword: [
        {required: true, message: "请确认密码" },
    ]
};

const submitForm = async () => {
    try {
        await formRef.value.validate();
        ElMessage({
            message: '注册成功！',
            type: 'success',
  });
    } catch (error) {
        ElMessage({
            message: '表单验证失败，请检查输入项。',
            type: 'error',
        });
    }
}
</script>

<style scoped lang="less">
.FormValidatorEasy{
  padding: 20px;
}
.register-form{
    width: 400px;
    margin-top: 20px;
    box-sizing: border-box;
    h2{
        margin-bottom: 20px;
        color: #333;
        font-weight: 500;
        font-style: normal;
        font-size: 30px;
    }
}
.form{
    :deep(.el-form-item__label){
        text-align: justify;
        text-align-last: justify;
        display: inline-block; 
    }
}
.submit-button{
    width: 100%;
}
</style>
