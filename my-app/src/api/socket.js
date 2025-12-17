import { ElNotification } from "element-plus";

class Socket {
  constructor(options) {
    //连接的后端地址
    this.url = options.url;
    //接收到信息后要执行的方法
    this.callback = options.received;
    this.name = options.name || "default";
    this.wa = null;
    //当前状态
    this.status = null;
    this.pingInerval = null;
    //心跳检测
    this.timeout = 3000;
    this.isHeart = options.isHeart || false;
    this.isReconnection = options.isReconnection || false;
  }
  connect(data) {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.status = "open";
      ElNotification({
        title: "成功",
        message: "连接成功！",
        type: "success",
      });
      if (this.isHeart) {
        this.heartCheck();
      }
      if (data !== undefined) {
        return this.ws.send(JSON.stringify({ type: "init" }));
      }
    };

    this.ws.onmessage = (e) => {
      if (typeof this.callback === "function") {
        console.log("收到消息：", e);
        this.callback(e);
      }
    };

    // 关闭连接
    this.ws.onclose = (e) => {
      console.log("onclose", e);
      ElNotification({
        title: "警告",
        message: "连接已断开！",
        type: "warning",
      });
      this.closeSocket(e);
    };
    // 报错信息
    this.ws.onerror = (e) => {
      console.log("onerror", e);
      this.closeSocket(e);
    };
  }
  sendMsg(data) {
    let msg = JSON.stringify(data);
    this.ws.send(msg);
  }
  resetHeart() {
    clearInterval(this.pingInerval);
    return this;
  }
  heartCheck() {
    this.pingInerval = setInterval(() => {
      this.ws.send(JSON.stringify({ type: "ping" }));
    }, this.timeout);
  }
  closeSocket(e) {
    this.resetHeart();
    if (this.status !== "close") {
      console.log("断开，重连", e);
      if (this.isReconnection) {
        console.log("执行重连");
        this.connect();
      }
    } else {
      console.log("连接已关闭", e);
    }
  }
  close() {
    this.status = "close";
    this.resetHeart();
    return this.ws.close();
  }
}
export default Socket;
