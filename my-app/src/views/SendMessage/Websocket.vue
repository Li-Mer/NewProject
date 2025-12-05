<template>
  <el-card class="chat-container" >
    <h1 class="letter">聊天室</h1>
    <el-card class="messages">
        <div
          v-for="(m,index) in lists" 
          :key="index"
          class="message-row"
          :class="{ me: m.username === `用户${user}` }"
        >
            <div class="bubble">
              <div class="meta">{{ m.username }}</div>
              <div class="text">{{ m.value }}</div>
            </div>
        </div>
    </el-card>
    <div class="input-container">
        <el-input 
            type="text"
            v-model="inputValue"
            placeholder="输入消息并按回车发送"
            style="width: 300px; margin-right: 8px;"
        />
        <el-button @click="sendMessage" type="primary">发送</el-button>   
    </div>
  </el-card>
</template>

<script setup>
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';

let socket = null;
const inputValue = ref('');
const lists = ref([]);
const user = Math.floor(Math.random() * 10) + 1;

const connectWebSocket = () => {
    socket = new WebSocket('ws://localhost:3000');

    //实例对象的onopen属性，用于指定连接成功后的回调函数
    socket.onopen = () => {
        ElNotification({
            title: '成功',
            message: '连接成功！',
            type: 'success',
        });
    };
    socket.onerror = (error) => {
        ElNotification({
            title: '错误',
            message: '连接失败！',
            type: 'error',
        });
    } 

    socket.onmessage = (event) => {
        console.log('收到消息：', event.data);
        const data = JSON.parse(event.data);
        lists.value.push({
            username: data.name,
            value: data.value
        });
    };
};
const sendMessage = () => {
    //用户名
    //消息
    const message = {
        name: `用户${user}`,
        value: inputValue.value
    }
    socket.send(JSON.stringify(message));
};
onMounted(() => {
    connectWebSocket();
})
</script>

<style scoped lang="less">
:deep(.chat-container) {
  width: 720px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  --el-card-bg-color: #fafafa;
}
.letter {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: 0;
}
.messages {
  height: 400px;
  width: 500px;
  overflow-y: auto;
  margin: 10px auto 20px; /* 水平居中 */
  box-shadow: none;
  border: 2px solid #ccc;
}
.message-row {
  display: flex;
  justify-content: flex-start;
  margin: 6px 8px;
}
.message-row.me {
  justify-content: flex-end;
}
.bubble {
  max-width: 70%;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f2f6ff;
  border: 1px solid #e6efff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  word-break: break-word;
  white-space: pre-wrap;
}
.message-row.me .bubble {
  background: #e9f5ff;
  border-color: #d3ecff;
}
.meta {
  font-size: 12px;
  color: #7a7a7a;
  margin-bottom: 4px;
}
.text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}
.input-container {
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
</style>