const WebSocket = require("ws");

function setupWebSocketServer(server) {
  const socket = new WebSocket.Server({ server });

  //连接用户列表
  const clients = [];

  //监听客户端的连接
  socket.on("connection", (ws) => {
    clients.push({
      ws: ws,
    });
    ws.on("message", (message) => {
      clients.forEach((client) => {
        // console.log("Received:", message); Received: <Buffer 7b 22 6e 61 6d 65 22 3a 22 e7 94 a8 e6 88 b7 37 22 2c 22 76 61 6c 75 65 22 3a 22 31 32 33 31 32 33 22 7d>
        // console.log("Received String", String(message)); Received String {"name":"用户7","value":"123123"}
        if (
          String(message) === '{"type":"ping"}' ||
          String(message) === '{"type":"init"}'
        ) {
          return;
        }
        client.ws.send(String(message));
      });
    });
  });
  console.log("websocket server is running on port 3000");
  return socket;
}
module.exports = { setupWebSocketServer };
