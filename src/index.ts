import WebSocket from "ws";

const port: number = parseInt(process.env.PORT || "3000", 10);
const WebSocketServer = WebSocket.Server;

console.log(`Starting web socket server on port '${port}'`);
var server = new WebSocketServer({ port: port });

function broadcast(data: any): void {
  server.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
}
function send(ws: WebSocket, data: any): void {
  ws.send(JSON.stringify(data));
}

server.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const inputMessage: any = JSON.parse(message.toString());
      switch (inputMessage.cmd) {
        case "request/move/forward": {
          broadcast({ ...inputMessage, cmd: "move/forward" });
          break;
        }
        case "request/move/backward": {
          broadcast({ ...inputMessage, cmd: "move/backward" });
          break;
        }
        case "request/move/stop": {
          broadcast({ ...inputMessage, cmd: "move/stop" });
          break;
        }
        case "request/move/turn-left": {
          broadcast({ ...inputMessage, cmd: "move/turn-left" });
          break;
        }
        case "request/move/turn-right": {
          broadcast({ ...inputMessage, cmd: "move/turn-right" });
        }
        default: {
          send(ws, {
            error: "Unknown message",
            source: inputMessage,
          });
        }
      }
    } catch (e) {
      send(ws, { error: "Error while processing message", source: message });
    }
  });
});
