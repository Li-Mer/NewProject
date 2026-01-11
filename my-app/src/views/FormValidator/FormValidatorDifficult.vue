<template>
  <div class="FormValidatorDifficult">
    <h1>复杂验证</h1>
    <el-card class="complex-form" style="border-radius: 20px; padding: 20px;">
        <h2>欢迎注册</h2>
        <el-form class="form" :model="formData" :rules="complexFormRules" ref="formRef" label-width="80px">
            <el-form-item label="省份" prop="address.province">
                <el-select v-model="formData.address.province" placeholder="请选择省份" style="width: 200px;">
                    <el-option label="北京" value="beijing"></el-option>
                    <el-option label="上海" value="shanghai"></el-option>
                    <el-option label="广东" value="guangdong"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="address.city">
                <el-select v-model="formData.address.city" placeholder="请选择城市" style="width: 200px;">
                    <el-option label="朝阳区" value="chaoyang"></el-option>
                    <el-option label="浦东新区" value="pudong"></el-option>
                    <el-option label="天河区" value="tianhe"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区县" prop="address.district">
              <el-select v-model="formData.address.district" placeholder="请选择区县" style="width: 200px;">
                  <el-option label="朝阳区" value="chaoyang"></el-option>
                  <el-option label="浦东新区" value="pudong"></el-option>
                  <el-option label="天河区" value="tianhe"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="标签列表" prop="tags">
              <el-input v-model="tagInput" placeholder="请输入标签" @keyup.enter="addTag"></el-input>
              <el-tag
                v-for="(tag,index) in formData.tags"
                :key="index"
                closable
                @close="formData.tags.splice(index, 1)"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>
        </el-form>
        <el-button @click="handleSubmit" type="primary" style="width: 100%;">提交</el-button>
    </el-card>
    
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const formRef = ref(null);
const tagInput = ref('');
const complexFormRules = {
  'address.province': 
    { required: true, message: "省份不能为空", trigger: 'change' }
  ,
  'address.city': [
    { required: true, message: "城市不能为空", trigger: 'change' }
  ],
  'address.district': [
    { required: true, message: "区县不能为空", trigger: 'change' }
  ],
  tags: {
    type: 'array',
    required: true,
    min: 1,
    max: 5,
    trigger: 'change',
    validator: (rule, value, callback) => { // 添加 callback 参数
      console.log('Validating tags:', value,Object.prototype.toString.call(value));
      const arr = Array.isArray(value) ? value : [];
      console.log('Validating tags:', value,Object.prototype.toString.call(value));
      if (arr.length === 0) {
        callback(new Error('请至少添加一个标签'));
        return;
      }
      if (arr.length > 5) return callback(new Error('标签最多只能添加 5 个'));
      const uniqueTags = new Set(arr);
      if (uniqueTags.size !== arr.length) {
        callback(new Error('标签不能重复')); // 使用 callback 返回错误
      } else {
        callback(); // 验证通过必须调用 callback()
      }
    }
  }
}

const formData = reactive({
  address: {
    province: '',
    city: '',
    district: ''
  },
  tags: []
});

const addTag = () => {
  const value = tagInput.value.trim();
  if (value && !formData.tags.includes(value)) {
    formData.tags.push(value);
  }
  tagInput.value = '';
}
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    ElMessage.success('表单验证通过，提交成功！');
  } catch {
    ElMessage.error('表单验证失败，请检查输入项');
  }
}
</script>

<style scoped lang="less">
.FormValidatorDifficult {
  padding: 20px;
}
.complex-form{
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
.tag {
  margin: 5px 5px 0 0;
}
</style>