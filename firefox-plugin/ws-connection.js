var isConnectionGenerated = false;
var hestiaWebsocketConnection = null;
var roomIdFromStorage = undefined;

function generateConnection(user = "U")
{
    isConnectionGenerated = false;

    roomIdFromStorage = browser.storage.sync.get('room_id');
    console.log(browser.storage);
    roomIdFromStorage.then(value => {
        console.log(value);
        const roomIdValue = value.room_id;
        if (value && roomIdValue)
        {
            const wsUrl = "wss://hestia-campfire-server.herokuapp.com?room=" + roomIdValue + "&user=" + user;
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
}

function closeConnection()
{
    console.log("CLOSE WS!");
    hestiaWebsocketConnection.close();
    isConnectionGenerated = false;
    connectionEstablished(false);
}
