const WebSocket = require('ws');

console.log("Starting server...");
const wss = new WebSocket.Server({ port: 8080 });

var roomsUsersConnectionDictionary = [];

wss.on('connection', function connection(ws, req) {
    console.log('connected');

    ws.id = req.headers['sec-websocket-key'];
    console.log(ws.id);

    ws.room = "01";
    if (roomsUsersConnectionDictionary[ws.room]) {
        roomsUsersConnectionDictionary[ws.room].push(ws);
    } else {
        roomsUsersConnectionDictionary[ws.room] = [ws];
    }
    console.log(ws.room);

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
