const express = require('express');
const WebSocket = require('ws');
const url = require('url');

const PORT = process.env.PORT || 8080;
const INDEX_HTML = "overview.html";

var roomsUsersConnectionDictionary = [];

console.log("Starting server...");

const server = express()
    .use((req, res) => res.sendFile(INDEX_HTML, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));

const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws, req) {
    console.log('connected');
    const urlQuery = url.parse(req.url, true).query;

    ws.id = req.headers['sec-websocket-key'];
    console.log(ws.id);

    ws.room = urlQuery.room;
    console.log(ws.room);

    const roomId = ws.room;
    if (roomsUsersConnectionDictionary[roomId]) {
        roomsUsersConnectionDictionary[roomId].push(ws);
    } else {
        roomsUsersConnectionDictionary[roomId] = [ws];
    }

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        console.log(ws.id);

        roomsUsersConnectionDictionary[ws.room].forEach(sock => {
            if (sock.id !== ws.id) {
                sock.send(message);
            }
        });
    });

    ws.send('CONNECTED TO ROOM:' + ws.room);
});