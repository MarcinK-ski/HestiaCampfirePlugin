const express = require('express');
const WebSocket = require('ws');
const url = require('url');

updateUserTypesModule();
var ut = require('./userTypesModule');

console.log(ut);
const PORT = process.env.PORT || 8080;
const INDEX_HTML = 'overview.html';

var roomsUsersConnectionDictionary = [];

console.log('> Starting server...');

const server = express()
    .use((req, res) => res.sendFile(INDEX_HTML, { root: __dirname }))
    .listen(PORT, () => console.log(`> Listening on port ${PORT}`));

const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws, req) {
    console.log('> Connected new user!');
    const urlQuery = url.parse(req.url, true).query;

    ws.joinTimestamp = Date.now();
    console.log(`> At: ${ws.joinTimestamp}`);

    ws.id = req.headers['sec-websocket-key'];
    console.log(`> UserId: ${ws.id}`);

    ws.room = urlQuery.room;
    const roomId = ws.room;
    console.log(`> To room: ${roomId}`);

    ws.userType = getHostIsAvaliable(roomId);
    console.log(`> As: ${ws.userType}`);

    if (roomsUsersConnectionDictionary[roomId]) {
        roomsUsersConnectionDictionary[roomId].push(ws);
    } else {
        roomsUsersConnectionDictionary[roomId] = [ws];
    }

    ws.on('message', function incoming(message) {
        console.log(`> Received message: ${message} from user: ${ws.id}`);

        if (message.includes('SYNC') && ut.isUserTypeWithPermission(ws.userType)) {
            roomsUsersConnectionDictionary[ws.room].forEach(sock => {
                if (sock.id !== ws.id) {
                    sock.send(message);
                }
            });
        } else {
            console.error(`>! User: ${ws.id} is not allowed to: ${message}, 
                              because it is: ${ws.userType} in room: ${ws.room}`);
        }
    });

    ws.on('close', function closing(){
        console.log(`> User: ${ws.id} send close event.`);
        removeUserFromDictionary(ws, ws.room);
    });

    ws.send('YOU ARE CONNECTED TO ROOM:' + ws.room);
});

setInterval(function () {
    wss.clients.forEach(ws => {
        ws.send("HEARTBEAT");
        ws.send(`UTYPE-NT${ws.userType}`);
    })
}, 5000);

function getHostIsAvaliable(roomId) {
    if (!roomsUsersConnectionDictionary[roomId]
     || !roomsUsersConnectionDictionary[roomId]
         .some(element => element.userType === ut.userTypes["HOST"])) {
        return ut.userTypes["HOST"];
    } else {
        return ut.userTypes["GUEST-V"];
    }
}

function removeUserFromDictionary(user, roomId) {
    var room = roomsUsersConnectionDictionary[roomId];
    const index = room.indexOf(user);

    if (index > -1) {
        room.splice(index, 1);
        console.log(`> User: ${user.id} has been removed from room: ${roomId}`);
    } else {
        console.warn(`? User: ${user.id} is not found in room: ${roomId}`);
        console.log(user);
        console.log('---');
        console.log(room);
    }

    if (room.length < 1) {
        delete roomsUsersConnectionDictionary[roomId];
        if (roomsUsersConnectionDictionary[roomId]) {
            console.error('! Something went wrong. Room has not been deleted!!!');
            console.warn(roomsUsersConnectionDictionary[roomId]);
            console.log('---');
            console.log(roomsUsersConnectionDictionary);
        } else {
            console.log(`> Room: ${roomId} has been deleted!`);
        }
    }
}

function updateUserTypesModule() {
    var fs = require('fs');
    var userTypesFileContent = fs.readFileSync('firefox-plugin/user-types.js', 'utf8');
    userTypesFileContent += "\nmodule.exports = {userTypes, isUserTypeWithPermission};";
    fs.writeFileSync('userTypesModule.js',userTypesFileContent);
}