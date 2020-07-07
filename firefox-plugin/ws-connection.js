var isConnectionGenerated = false;
var hestiaWebsocketConnection = null;
var roomIdFromStorage = undefined;
var userFriendlyNameFromStorage = undefined;
var currentUserNickname = '';

function generateConnection(user = undefined, roomId = undefined)
{
    isConnectionGenerated = false;
    currentUserNickname = user;

    roomIdFromStorage = browser.storage.sync.get('room_id');
    userFriendlyNameFromStorage = browser.storage.sync.get('friendly_user_name');
    userFriendlyNameFromStorage.then(userFNValueFromStorage => {
        const userFNValue = user || userFNValueFromStorage.friendly_user_name;

        roomIdFromStorage.then(roomIdValueFromStorage => {
            console.log(roomIdValueFromStorage);
            const roomIdValue = roomId || roomIdValueFromStorage.room_id;
            if (roomIdValueFromStorage && roomIdValue)
            {
                setNewUserType(userTypes["GUEST-D"]);
                const wsUrl = "wss://hestia-campfire-server.herokuapp.com?room=" + roomIdValue + "&user=" + userFNValue;
                hestiaWebsocketConnection = new WebSocket(wsUrl);
                console.log("Trying to connect to websocket with room: " + roomIdValue);

                hestiaWebsocketConnection.onerror = function ()
                {
                    connectionEstablished(false);
                    isConnectionGenerated = false;
                    alert("Connection error!");
                };

                hestiaWebsocketConnection.onmessage = function (event)
                {
                    console.log("WS:" + event.data);
                    receiveMessage(event, true);
                };

                hestiaWebsocketConnection.onclose = function (event)
                {
                    connectionEstablished(false);
                    isConnectionGenerated = false;
                    console.log(`Connection closed. Code: ${event.code}; Reason: ${event.reason}`);
                };

                isConnectionGenerated = true;
            }
            else
            {
                const warnMessage = "There no roomId specified!";
                console.warn(warnMessage);
                connectionEstablished(false);
                alert(warnMessage);
            }
        });
    });
}

function closeConnection()
{
    console.log("CLOSE WS!");
    hestiaWebsocketConnection.close();
    isConnectionGenerated = false;
    connectionEstablished(false);
}
