<template>
  <div class="FormValidatorEasy">
    <h1>简单验证</h1>
    <el-card class="register-form" style="border-radius: 20px; padding: 20px;">
        <h2>欢迎注册</h2>
        <el-form class="form" :model="formData" :rules="registerRulesAdvanced" ref="formRef" label-width="80px">
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
import axios from '../../api/request';

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

//进阶校验
//增加密码强度校验（一个大写，一个小写，一个数字）
//用户名唯一性校验（异步请求：调用后端接口检查用户名是否已经存在）
const registerRulesAdvanced = {
    username: [
        { required: true, message: "用户名不能为空" },
        { min: 3, max: 15, message: "用户名长度应在3到15个字符之间" },
        {
            validator: async (rule, value, callback) => {
                // 模拟异步请求检查用户名唯一性
                try {
                    const isUsernameExist = await checkUsernameExist(value);
                    if (isUsernameExist) {
                        callback(new Error('用户名已存在，请选择其他用户名'));
                    } else {
                        callback();
                    }
                } catch (error) {
                    // 如果接口挂了，通常选择放行或者提示网络错误
                    // 这里选择放行，避免阻断用户
                    console.error("验证用户名失败:", error);
                    callback(); 
                }
            }
        }
    ],
    password: [
        { required: true, message: "密码不能为空" },
        { 
            validator: (rule, value, callback) => {
                const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,16}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码需包含大写字母、小写字母和数字，长度 6-16 字符'));
                } else {
                    callback();
                }
            }
        }
    ],
    confirmPassword: [
        { required: true, message: "请确认密码" },
        {
            validator: (rule, value, callback) => {
                if (value !== formData.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            }
        }
    ]
}
const checkUsernameExist = async (username) => {
    try {
        const response = await axios.get('/api/checkUsername', {
            params: { username }
        });
        return response.data.exists;
    }catch (error) {
        throw error;
    }
}
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
    width: 500px;
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
