const WebSocket = require("ws");
const PORT = 8080;

const socket = new WebSocket.Server({ port: PORT });

const clients = new WeakSet();

socket.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (data) => {
    const recievers = clients.filter((client) => client !== ws);

    recievers.forEach((reciever) => reciever.send(data));
  });
});

console.log(`Server is running on port ${PORT}`);
