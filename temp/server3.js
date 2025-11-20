"use strict";

const http = require("http");
const WebSocket = require("ws");

// -------------------- CLASSES --------------------
class Player {
    constructor(username, device_id) {
        this.username = username;
        this.device_id = device_id;
    }
}

class PlayerMovement {
    constructor(username, x, y) {
        this.username = username;
        this.x = x;
        this.y = y;
    }
}

// -------------------- DATA STRUCTURES --------------------
const playerList = new Map();        // username -> Player
const playerMovementMap = new Map(); // username -> PlayerMovement

// -------------------- SERVER SETUP --------------------
const port = 8080;
let wss = null; // will hold WebSocket server instance

// -------------------- HTTP SERVER --------------------
const httpserver = http.createServer((req, res) => {
    console.log(`[HTTP] Request for ${req.url}`);

    // ---- LOGIN ROUTE ----
    if (req.url.startsWith("/login")) {
        // Example: /login?username=John&device_id=123
        const url = new URL(req.url, `http://${req.headers.host}`);
        const username = url.searchParams.get("username");
        const device_id = url.searchParams.get("device_id");

        if (username && device_id) {
            const player = new Player(username, device_id);
            playerList.set(username, player);

            console.log(` Player logged in: ${username} (${device_id})`);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`Player ${username} logged in successfully`);
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Missing username or device_id");
        }
    }

    // ---- LOBBY ROUTE ----
    else if (req.url === "/inLobby") {
        if (!wss) {
            startWebSocketServer(httpserver);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(" WebSocket Lobby server started!");
        } else {
            // store 2nd, 3rd players username and x, y in the playerMovementMap
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(" Lobby already active!");
        }
    }

    // ---- DEFAULT ----
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(" Route not found");
    }
});

httpserver.listen(port, () => {
    console.log(` HTTP server listening on port ${port}`);
});

// -------------------- WEBSOCKET SERVER --------------------
function startWebSocketServer(server) {
    wss = new WebSocket.Server({ server });
    console.log(" WebSocket server started on same port as HTTP");

    wss.on("connection", (ws) => {
        console.log(" New WebSocket client connected");

        ws.on("message", (data) => {
            const messageStr = data.toString().trim();
            const parts = messageStr.split(",");

            if (parts.length === 3) {
                const username = parts[0].trim();
                const x = parseFloat(parts[1]);
                const y = parseFloat(parts[2]);

                playerMovementMap.set(username, new PlayerMovement(username, x, y));
                console.log(`Updated ${username} position to (${x}, ${y})`);

                // Broadcast to other clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(messageStr);
                    }
                });
            }
        });

        ws.send(" Welcome to the game lobby!");
    });
}
