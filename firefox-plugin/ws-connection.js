var isConnectionGenerated = false;
var hestiaWebsocketConnection = null;
var roomId = undefined;

function generateConnection(user = "U")
{
    roomId = browser.storage.sync.get('room_id');
    console.log(browser.storage);
    roomId.then(value => {
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
                console.log(`Connection closed. Code: ${event.code}; Reason: ${event.reason}`);
            };

            isConnectionGenerated = true; // TODO: Zrobić to porządniej
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
    console.log(hestiaWebsocketConnection);
    hestiaWebsocketConnection.close();
    connectionEstablished();
}
