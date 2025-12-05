<template>
  <div class="virtual-list-show">
    <h1>Virtual List Show</h1>
    <div style="height: 100vh; width: 500px;">
        <virtual-list :listData="listData" :itemSize="100"></virtual-list>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import VirtualList from "../components/VirtualList.vue";
import axios from "../api/request";
const listData = ref([]);

// listData.value = [
//       ...Array.from({ length: 100 }).map((_, i) => ({
//         id: i,
//         value: `这是第${i}条数据`,
//       })),
//     ];

onMounted(async () => {
  try {
    const response = await axios.get("/api/getVirtualList");
    console.log(" virtual list data:", response);
    // const result = await response.json();
    // console.log("Response data:", response);
    listData.value = response.data;
  } catch (error) {
    console.error("Failed to fetch virtual list data:", error);
  }
});
</script>
<style scoped lang="less">
.virtual-list-show {
  padding: 20px;
}
</style>
