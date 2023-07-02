import webconfig from "../webconfig";
export function connectStart(uploadId, onMessage, onClose) {
  let wsUrl = webconfig.videoApiUrl;
  if (wsUrl.indexOf("http") == -1) {
    wsUrl = "ws://" + window.location.host+wsUrl;
  } else {
    wsUrl = wsUrl.replace("http", "ws");
  }
  wsUrl += "/upload-progress/" + uploadId;
  

  // wsUrl="ws://192.168.14.211:8081/upload-progress/"+uploadId;


  let websocket = new WebSocket(wsUrl);
  websocket.onerror = function () {
    console.log("websocket error");
  };
  websocket.onopen = function (event) {
    console.log("websocket open");
  };
  websocket.onmessage = function (event) {
    console.log("websocket on message ", event.data);
    let json = event.data;
    try {
      json = JSON.parse(json);
    } catch (e) {
      console.log(e);
    }
    onMessage(json);
  };

  //连接关闭的回调方法
  websocket.onclose = function () {
    console.log("websocket close");
    onClose();
    // setTimeout(connectStart, 3000);
  };
}
