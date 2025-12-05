<template>
   <div class="tabs">
        <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :effect="route.name === tag.name ?'dark':'plain'"
            size:="large"
            @click="handleMenu(tag)"
            @close="handleClose(tag,index)"
        >
            {{ tag.label }}
        </el-tag>
   </div>
</template>

<script setup>
import { ref, computed, effect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { useAllDataStore } from '../stores'

// const store = useAllDataStore()
const route = useRoute()
const router = useRouter()

// const tags = computed(() => store.state.tags)
// const handleMenu = (tag) => {
//     router.push(tag.name);
//     store.selectMenu(tag);
// }
// const handleClose = (tag,index) => {
//     store.updateTags(tag);
//     if (tag.name !== route.name) {
//         return;
//     }
//     if (index === store.state.tags.length) {
//         store.selectMenu(store.state.tags[index - 1]);
//         router.push(store.state.tags[index - 1].name);
//     } else {
//         store.selectMenu(store.state.tags[index]);
//         router.push(store.state.tags[index].name);
//     }

// }
</script>

<style scoped lang="less">
.tabs {
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 10px;
    ::v-deep(.el-tag) {
        cursor: pointer;
    }
}
</style>