import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "/virtual-list",
        name: "virtual-list",
        component: () => import("../views/VirtualListShow.vue"),
      },
      // {
      //   path: "/file-upload",
      //   name: "file-upload",
      //   component: () => import("../views/FileUpload.vue"),
      // },
      {
        path: "/file-upload/single",
        name: "file-upload-single",
        component: () => import("../views/FileUpload/FileUploadSingle.vue"),
      },
      {
        path: "/file-upload/big",
        name: "file-upload-big",
        component: () => import("../views/FileUpload/FileUploadBig.vue"),
      },
      {
        path: "/file-upload/many",
        name: "file-upload-many",
        component: () => import("../views/FileUpload/FileUploadMany.vue"),
      },
      {
        path: "/send-message/websocket",
        name: "websocket",
        component: () => import("../views/SendMessage/Websocket.vue"),
      },
      {
        path: "/send-message/sse",
        name: "sse",
        component: () => import("../views/SendMessage/SSE.vue"),
      },
      {
        path: "/document-preview/pdf",
        name: "pdf-preview",
        component: () => import("../views/DocumentPreview/PdfPreview.vue"),
      },
      {
        path: "/form-validator/easy",
        name: "form-validator-easy",
        component: () => import("../views/FormValidator/FormValidatorEasy.vue"),
      },
      {
        path: "/page1",
        name: "page1",
        component: () => import("../views/Page1.vue"),
      },
      {
        path: "/page2",
        name: "page2",
        component: () => import("../views/Page2.vue"),
      },
    ],
  },
];

const router = createRouter({
  //history设置路由模式
  history: createWebHashHistory(),
  routes,
});

export default router;
