const Router = require("koa-router");
const virtualListRouter = require("./virtualList");
const fileUploadRouter = require("./fileUpload");
const sentMessageRouter = require("./sentMessage");

const router = new Router({ prefix: "/api" });

// 将各模块路由挂载到主路由
router.use(virtualListRouter.routes(), virtualListRouter.allowedMethods());
router.use(fileUploadRouter.routes(), fileUploadRouter.allowedMethods());
router.use(sentMessageRouter.routes(), sentMessageRouter.allowedMethods());

// 以后可继续：
// const userRouter = require("./user");
// router.use(userRouter.routes(), userRouter.allowedMethods());

module.exports = router;
