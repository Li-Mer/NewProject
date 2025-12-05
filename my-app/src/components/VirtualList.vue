<template>
    <!-- 容器：作为滚动区域，通过ref获取DOM元素，监听scroll事件 -->
    <div class="container" ref="containerRef" @scroll="handleScroll($event)">
        <!-- 占位元素：用于撑起列表总高度，让滚动条能正确显示整体长度 -->
        <div class="placeHolder" :style="{height: listHeight + 'px'}"></div>
        <!-- 列表容器：通过transform定位，只显示当前需要渲染的项 -->
        <div class="list-wrapper" :style="{transform: getTransform}">
            <div 
                class="card-item"
                v-for="item in renderList"
                :key="item.id"
                :style="{
                    height: itemSize + 'px',
                    lineHeight: itemSize + 'px',
                    
                }"
            >
                {{item.value}}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const { listData, itemSize } = defineProps({
    listData: {
        type: Array,
        default:()=>[],  // 列表数据，默认空数组
    },
    itemSize: {
        type: Number,
        default: 50,  // 每项的固定高度，默认50px
    },
})

const containerRef = ref(null);// 容器DOM元素的引用
const containerHeight = ref(0);// 容器的可视高度

// 计算属性：需要渲染的项数（可视区域能容纳的数量+1，避免滚动时出现空白）
const renderCount = computed(() => Math.ceil(containerHeight.value / itemSize) + 1);

const startIndex = ref(0);// 当前需要渲染的起始索引
const offsetY = ref(0);// 列表容器的偏移量（用于定位）

// 计算属性：当前需要渲染的结束索引（起始索引+渲染数量）
const endIndex = computed(() => startIndex.value + renderCount.value);

// 计算属性：列表总高度（总数据量×每项高度，用于占位元素）
const listHeight = computed(() => {
    return listData.length * itemSize;
});
// 计算属性：当前需要渲染的列表项（从总数据中截取可视范围的部分）
const renderList = computed(() => listData.slice(startIndex.value, endIndex.value));
// 计算属性：列表容器的transform样式（根据偏移量进行定位）
const getTransform = computed(() => `translateY(${offsetY.value}px)`);

onMounted(() => {
    containerHeight.value = containerRef.value.clientHeight;
});

function handleScroll(e) {
    const scrollTop = e.target.scrollTop;// 获取当前滚动距离顶部的距离
    startIndex.value = Math.floor(scrollTop / itemSize);// 计算当前滚动到的起始索引（滚动距离÷每项高度，向下取整）
    offsetY.value = startIndex.value * itemSize; // 计算列表容器的偏移量（起始索引×每项高度，让可见项"顶"到容器顶部）
}
</script>

<style scoped lang="less">
.container {
    width: 500px;
    height: 400px;
    border: 1px solid #ccc;
    position: relative;
    overflow: auto;
}
.placeHolder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
.card-item {
    padding: 10px;
    color: #777;
    box-sizing: border-box;
    border-bottom: 1px solid red;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
}
</style>