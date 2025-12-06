<template>
  <div class="POLL">
    <h1>POLL</h1>
    <el-button @click="sendPollMessage">轮询发送消息</el-button>
    <el-button @click="clearPoll">结束轮询</el-button>
  </div>
  <div class="SSE">
    <h1>SSE</h1>
    <div class="controls">
      <el-button type="primary" @click="startSSE" :disabled="isConnected">建立 SSE 连接</el-button>
      <el-button type="danger" @click="closeSSE" :disabled="!isConnected">断开连接</el-button>
    </div>
    
    <div class="message-box" v-if="lastMessage">
      <p>当前 Index: {{ lastMessage.index }}</p>
      <p>消息内容: {{ lastMessage.message }}</p>
      <p>时间: {{ lastMessage.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref ,onBeforeUnmount} from 'vue';
import { ElNotification } from 'element-plus';
import axios from '../../api/request';


//POLL
const index = ref(0);
let timer = null;
const sendPollMessage = () => {
  timer = setInterval(() => {
    index.value += 1;
    axios.get('/api/sentmessage/poll', {
      params: {
        index: index.value,
        name: `用户${index.value}`,
        value: `这是第 ${index.value} 条消息`
      }
    }).then(() => {
      
    }).catch(() => {
      ElNotification({
        title: '错误',
        message: `发送第 ${index.value} 条消息失败`,
        type: 'error',
      });
      clearInterval(timer); 
    })
  }, 1000);
};

const clearPoll = () => {
  clearInterval(timer);
  index.value = 0;
}

//SSE
const isConnected = ref(false);
const lastMessage = ref(null);
let eventSource = null;

const startSSE = () => {
  if (eventSource) return;
  eventSource = new EventSource('http://localhost:3000/api/sentmessage/sse');

  eventSource.onopen = () => {
    isConnected.value = true;
    ElNotification({
      title: '成功',
      message: 'SSE 连接已建立！',
      type: 'success',
    });
  };

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('收到 SSE 消息:', data);
    lastMessage.value = data;
  };

  eventSource.onerror = () => {
    ElNotification({
      title: '错误',
      message: 'SSE 连接出错！',
      type: 'error',
    });
    closeSSE();
  };
}
const closeSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    isConnected.value = false;
    ElNotification({
      title: '信息',
      message: 'SSE 连接已关闭。',
      type: 'info',
    });
  }
}
onBeforeUnmount(() => {
  closeSSE();
  clearPoll();
});
</script>

<style scoped lang="less">
.POLL {
  margin-bottom: 20px;
}
.SSE {
  padding: 20px;
  .controls { margin-bottom: 20px; }
  .message-box {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 4px;
    background: #f9f9f9;
  }
}
</style>
