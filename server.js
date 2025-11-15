"use strict";

const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);
    res.end("hi there");
});

class Player {
    constructor(username, x, y) {
        this.username = username;
        this.x = x;
        this.y = y;
    }
}

const players = new Map(); // username -> Player object

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        let messageStr = typeof data === 'string' ? data : data.toString();
        messageStr = messageStr.trim();

        // Split by commas
        const parts = messageStr.split(',');
        if (parts.length === 3) {
            const username = parts[0].trim();
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);

            // Create or update player
            players.set(username, new Player(username, x, y));

            console.log(`Updated ${username} position to (${x}, ${y})`);

            // Broadcast to all connected clients except sel
            wss.clients.forEach(function each(client) {
                // client !== ws && 
                if ( client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(messageStr);
                }
            });
        }
    });

    ws.send('Hello! Message From Server!!');
    ws.send("this is Baerr Futbol");
});

// Start server
server.listen(8080, function () {
    console.log(new Date() + ' Server is listening on port 8080');
});
