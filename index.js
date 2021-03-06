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

    ws.userFriendlyName = urlQuery.user;
    console.log(`> With name: ${ws.userFriendlyName}`);

    ws.room = urlQuery.room;
    const roomId = ws.room;
    console.log(`> To room: ${roomId}`);

    ws.userType = getHostIfAvaliable(roomId);
    console.log(`> As: ${ws.userType}`);

    if (roomsUsersConnectionDictionary[roomId]) {
        roomsUsersConnectionDictionary[roomId].push(ws);
    } else {
        roomsUsersConnectionDictionary[roomId] = [ws];
    }

    resetUsersNoInRoom(roomId);
    console.log(`> This user is: ${ws.userNo} in this room`);

    ws.on('message', function incoming(message) {
        console.log(`> Received message: ${message} from user: ${ws.id}`);

        if (message.includes('THOST - ') && ws.userType === ut.userTypes.HOST) {
            try {
                var thostUser = JSON.parse(message.substring(message.indexOf('-') + 1).trim());
                thostManagement(ws, thostUser);
            }
            catch (e) {
                console.error(`JSON parsing failed due to: ${e}`)
            }
        } else if (!message.includes('SYNC') || ut.isUserTypeWithPermission(ws.userType)) {
            sendToEveryone(ws, message, true);
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
    sendCurrentRoomUsersList(ws);
});

function thostManagement(ws, thostUser) {
    console.log(roomsUsersConnectionDictionary);
    var currentRoom = roomsUsersConnectionDictionary[ws.room];
    var currentThost = roomsUsersConnectionDictionary[ws.room].find(u => u.userType === ut.userTypes["HOST-T"]);
    var requestedUser = currentRoom[thostUser.no];

    if (currentThost) {
        if (requestedUser === currentThost) {
            requestedUser.userType = ut.userTypes["GUEST-V"];
        } else if (requestedUser.userType === ut.userTypes["GUEST-V"]) {
            currentThost.userType = ut.userTypes["GUEST-V"];
            requestedUser.userType = ut.userTypes["HOST-T"];
        }
    } else {
        requestedUser.userType = ut.userTypes["HOST-T"];
    }


    currentThost = roomsUsersConnectionDictionary[ws.room].find(u => u.userType === ut.userTypes["HOST-T"]);
    var message = currentThost ? `${currentThost.userNo}.${currentThost.userFriendlyName}` : '';
    sendToEveryone(ws, `THOSTUPDATE:${message}`);
    sendCurrentRoomUsersList(ws);
}

function sendCurrentRoomUsersList(ws, withResetUsersNo = false) {
    if (withResetUsersNo) {
        resetUsersNoInRoom(ws.room)
    }

    const jsonWithUsersInThisRoom = JSON.stringify({
        usersInThisRoom: roomsUsersConnectionDictionary[ws.room].map(s => {
            return {
                no: s.userNo,
                user:s.userFriendlyName,
                type: s.userType
            };
        })
    });
    sendToEveryone(ws, jsonWithUsersInThisRoom);
}

function sendToEveryone(ws, message, omitSender = false) {
    roomsUsersConnectionDictionary[ws.room].forEach(sock => {
        if (!omitSender || sock.id !== ws.id) {
            sock.send(message);
        }
    });
}

setInterval(function () {
    wss.clients.forEach(ws => {
        ws.send("HEARTBEAT");
        ws.send(`UTYPE--|NT|${ws.userType}`);
    })
}, 3000);

function resetUsersNoInRoom(roomId) {
    for (let i = 0; i < roomsUsersConnectionDictionary[roomId].length; i++) {
        roomsUsersConnectionDictionary[roomId][i].userNo = i;
    }
}

function getHostIfAvaliable(roomId) {
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
        if (ut.isUserTypeWithPermission(user.userType)) {
            console.warn(`> User was permitted - all userTypes will be reset 
                                    (oldest user will be as HOST, others - GUEST-V).`);
            for (i = 0; i < room.length; i++) {
                var currentUser = room[i];
                if (currentUser.userType !== ut.userTypes.HOST) {
                    currentUser.userType = getHostIfAvaliable(roomId);
                }
            }
        }
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
    } else {
        sendCurrentRoomUsersList({room: roomId, id: -1}, true);
    }
}

function updateUserTypesModule() {
    var fs = require('fs');
    var userTypesFileContent = fs.readFileSync('firefox-plugin/user-types.js', 'utf8');
    userTypesFileContent += "\nmodule.exports = {userTypes, isUserTypeWithPermission};";
    fs.writeFileSync('userTypesModule.js',userTypesFileContent);
}