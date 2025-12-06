const Router = require("koa-router");
const router = new Router();
const { PassThrough } = require("stream"); // 引入流模块

router.get("/sentmessage/poll", async (ctx) => {
  const params = ctx.query;
  //   console.log("Received poll request with params:", params);
  ctx.body = { index: params.index };
});
router.get("/sentmessage/sse", async (ctx) => {
  // 1. 设置 SSE 必须的响应头
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*", // 允许跨域
  });
  //2.创建一个转换流，用于持续写入数据
  let stream = new PassThrough();
  ctx.body = stream;
  ctx.status = 200;

  //3.模拟后端自动递增数据
  let index = 0;
  const interval = setInterval(() => {
    const data = {
      index: index,
      message: `后端自动推送消息 #${index}`,
      timestamp: new Date().toISOString(),
    };
    index++;
    // console.log(data);

    // SSE 格式必须是: "data: <内容>\n\n"（文本格式）
    stream.write(`data:${JSON.stringify(data)}\n\n`);
  }, 2000);

  // 4. 当连接关闭时（前端关闭页面或调用 close），清除定时器
  stream.on("close", () => {
    console.log("SSE connection closed");
    clearInterval(interval);
  });
});
module.exports = router;
