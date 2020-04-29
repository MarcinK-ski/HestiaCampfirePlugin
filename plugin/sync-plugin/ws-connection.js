var isConnectionGenerated = false;
var hestiaWebsocketConnection = null;

function generateConnection(user = "U", roomNo = "01")
{
    hestiaWebsocketConnection = new WebSocket("ws://localhost:8080?room=" + roomNo + "&user=" + user);

    hestiaWebsocketConnection.onmessage = function (event)
    {
        console.log("WS:" + event.data);
        receiveMessage(event, true);
    };

    isConnectionGenerated = true; // TODO: Zrobić to porządniej
}

function closeConnection()
{
    console.log("CLOSE WS!");
    console.log(hestiaWebsocketConnection);
    hestiaWebsocketConnection?.close();
}
