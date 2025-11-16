"use strict";
const WebSocket = require("ws");

class Player {
  constructor(username, x, y) {
    this.username = username;
    this.x = x;
    this.y = y;
    this.status = "online";
    this.hasBall = false;
  }
}

const players = new Map();

const webSocketRoutes = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function connection(ws) {
    console.log("A new client connected.");
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      let messageStr = typeof data === "string" ? data : data.toString();
      messageStr = messageStr.trim();

      const parts = messageStr.split(",");

      if (parts.length === 3) {
        const username = parts[0].trim();
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);

        let player = players.get(username);

        if (!player) {
          player = new Player(username, x, y);
          players.set(username, player);
          console.log(
            `New player ${username} joined with status ${player.status}.`
          );
          if (!ws.username) {
            ws.username = username;
          }
        } else {
          player.x = x;
          player.y = y;
          console.log(`Updated ${username} position to (${x}, ${y})`);
        }
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
          }
        });
      } else if (
        parts.length === 2 &&
        parts[0].trim().toUpperCase() === "OFFLINE"
      ) {
        const username = parts[1].trim();
        console.log(`Received 'offline' request from ${username}.`);

        if (players.delete(username)) {
          console.log(
            `${username} removed from players map (clean disconnect).`
          );

          const disconnectMessage = `DISCONNECT,${username}`;
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(disconnectMessage);
            }
          });
        }
        ws.close();
      }
    });

    ws.on("close", () => {
      if (ws.username) {
        if (players.delete(ws.username)) {
          console.log(
            `${ws.username} had a dirty disconnect. Removed and broadcasting.`
          );

          const disconnectMessage = `DISCONNECT,${ws.username}`;
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(disconnectMessage);
            }
          });
        } else {
          console.log(
            `${ws.username} connection closed (was already removed).`
          );
        }
      } else {
        console.log("A client (who never sent data) disconnected.");
      }
    });

    ws.send("Hello! Message From Server!!");
    ws.send("this is Baerr Futbol");
  });
  return wss;
};

module.exports = webSocketRoutes;
