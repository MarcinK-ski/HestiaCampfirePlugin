var isConnectionGenerated = false;
var hestiaWebsocketConnection = null;
var roomId = undefined;

function generateConnection(user = "U")
{
    roomId = browser.storage.sync.get('room_id');
    roomId.then(value => {
        const roomIdValue = value.room_id;
        if (value && roomIdValue)
        {
            console.log("Try to connect to websocket with room: " + roomIdValue);
            hestiaWebsocketConnection = new WebSocket("ws://localhost:8080?room=" + roomIdValue + "&user=" + user);

            hestiaWebsocketConnection.onmessage = function (event)
            {
                console.log("WS:" + event.data);
                receiveMessage(event, true);
            };

            isConnectionGenerated = true; // TODO: Zrobić to porządniej
        }
        else
        {
            console.warn("There no roomId specified!");
        }
    });
}

function closeConnection()
{
    console.log("CLOSE WS!");
    console.log(hestiaWebsocketConnection);
    hestiaWebsocketConnection.close();
}
