const Router = require("koa-router");
const router = new Router();

// 虚拟列表接口 (支持 ?page=1&pageSize=50)
// router.get("/getVirtualList", async (ctx) => {
//   const page = Number(ctx.query.page || 1);
//   const pageSize = Number(ctx.query.pageSize || 50);
//   const total = 1000;

//   // 生成模拟数据
//   const start = (page - 1) * pageSize;
//   const end = Math.min(start + pageSize, total);
//   const data = Array.from({ length: end - start }).map((_, i) => {
//     const id = start + i + 1;
//     return { id, name: `item${id}`, value: `这是第 ${id} 条数据` };
//   });

//   ctx.body = {
//     code: 200,
//     message: "获取虚拟列表成功",
//     page,
//     pageSize,
//     total,
//     data,
//   };
// });
router.get("/getVirtualList", async (ctx) => {
  ctx.body = {
    code: 200,
    message: "获取列表",
    data: [
      ...Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        value: `这是第${i}条数据`,
      })),
    ],
  };
});

module.exports = router;
