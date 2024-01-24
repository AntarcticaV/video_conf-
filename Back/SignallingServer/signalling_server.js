const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 }, () => {
  console.log("Signalling server is now listening on port 8081");
});

wss.broadcast = (ws, data) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      console.log(typeof data);

      const jsonString = JSON.stringify(data);

      client.send(jsonString);
    }
  });
};

wss.on("connection", (ws) => {
  console.log(`Client connected. Total connected clients: ${wss.clients.size}`);

  ws.on("message", (message) => {
    // msg = JSON.parse(message);
    const textDecoder = new TextDecoder("utf-8");

    // Декодируем ArrayBuffer в строку
    const decodedString = textDecoder.decode(message);
    // console.log(decodedString + "\n\n");
    wss.broadcast(ws, decodedString);
  });
  ws.on("close", (ws) => {
    console.log(
      `Client disconnected. Total connected clients: ${wss.clients.size}`
    );
  });

  ws.on("error", (error) => {
    console.log(`Client error. Total connected clients: ${wss.clients.size}`);
  });
});
