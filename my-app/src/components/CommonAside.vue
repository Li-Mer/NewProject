<template>
  <el-aside :width="width" class="common-aside">
    <el-menu
      background-color="#545c64"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
    >
      <h3 v-show="!isCollapse">Project Highlights</h3>
      <h3 v-show="isCollapse">PH</h3>
      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.label"
        :index="item.label"
      >
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.path"
          :index="child.path"
          @click="handleMenu(child)"
        >
          <el-icon>
            <component :is="child.icon"></component>
          </el-icon>
          <span>{{ child.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from "vue";
// import { useAllDataStore } from '../stores'
import router from "../router";
const list = ref([
  {
    path: "/home",
    name: "home",
    label: "首页",
    icon: "house",
    url: "Home",
  },

  {
    path: "/virtual-list",
    name: "virtual-list",
    label: "虚拟列表",
    icon: "video-play",
    url: "VirtualList",
  },
  {
    path: "/file-upload",
    // name: "big-file-upload",
    label: "文件上传",
    icon: "user",
    // url: "BigFileUpload",
    children: [
      {
        path: "/file-upload/single",
        name: "file-upload-single",
        label: "单文件上传",
        icon: "user",
        url: "FileUploadSingle",
      },
      {
        path: "/file-upload/many",
        name: "file-upload-many",
        label: "多文件上传",
        icon: "user",
        url: "FileUploadMany",
      },
      {
        path: "/file-upload/big",
        name: "file-upload-big",
        label: "大文件上传",
        icon: "user",
        url: "FileUploadBig",
      },
    ],
  },
  {
    path: "/send-message",
    label: "通讯",
    icon: "message",
    children: [
      {
        path: "/send-message/websocket",
        name: "websocket",
        label: "WebSocket通讯",
        icon: "setting",
        url: "WebSocketMessage",
      },
    ]
  },
  {
    path: "other",
    label: "其他",
    icon: "location",
    children: [
      {
        path: "/page1",
        name: "page1",
        label: "页面1",
        icon: "setting",
        url: "Page1",
      },
      {
        path: "/page2",
        name: "page2",
        label: "页面2",
        icon: "setting",
        url: "Page2",
      },
    ],
  },
]);

// const list = computed(()=> store.state.menuList);
const noChildren = computed(() => list.value.filter((item) => !item.children));
const hasChildren = computed(() => list.value.filter((item) => item.children));
// const store = useAllDataStore();
// const isCollapse = computed(() => store.state.isCollapse);
// const width = computed(() => isCollapse.value ? '64px' : '200px');
const handleMenu = (item) => {
  router.push(item.path);
  // store.selectMenu(item);
};
// 无需手动跳转，开启 router 后 el-menu 根据 index(path) 自动 push
</script>

<style scoped lang="less">
.icons {
  width: 18px;
  height: 18px;
}
.el-menu {
  border-right: none;
  h3 {
    line-height: 60px;
    color: #fff;
    text-align: center;
  }
}
.common-aside {
  height: 100%;
  background-color: #545c64;
}
</style>
