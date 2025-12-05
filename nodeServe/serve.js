const koa = require("koa");
const http = require("http");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser"); //解析请求体
const cors = require("koa2-cors");
const routes = require("./routes"); // 引入集中路由
const { setupWebSocketServer } = require("./lib/websocket");

const app = new koa();
const router = new Router({ prefix: "/api" }); //前缀
const bodyParser = BodyParser();

//koa请求跨域配置
app.use(
  cors({
    origin: function (ctx) {
      return ctx.request.header.origin || ""; // 允许所有来源
    },
    credentials: true, // 允许携带cookie
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(bodyParser); //使用解析请求体中间件

const server = http.createServer(app.callback());
setupWebSocketServer(server);

// app.use(async (ctx) => {
//   ctx.body = "Hello World";
// });

// router.get("/getVirtualList", async (ctx) => {
//   ctx.body = {
//     code: 200,
//     message: "获取列表成功",
//     data: [
//       { id: 1, name: "item1" },
//       { id: 2, name: "item2" },
//       { id: 3, name: "item3" },
//     ],
//   };
// });

// 注册集中路由
app.use(routes.routes()).use(routes.allowedMethods());

// app.use(router.routes()).use(router.allowedMethods()); //创建或管理路由
//启动服务器
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
