const buttonsDivId = "CtlButtonsDivCtrlPanel";
var isButtonsDivActive = false;
var forceDisplay = false;

var connectBtn;
var disconnectBtn;

function buildCtrlPanel() {
    var mainContainerDiv = document.createElement("div");
    mainContainerDiv.id = buttonsDivId;
    mainContainerDiv.style = "background-color: rgba(255, 0, 0, 0.3); opacity: 0.5; position: fixed; z-index: 99999; bottom: 50px; left: 0px; width:60px";

    var roomNamePreview = document.createElement("p");
    roomNamePreview.style.color = "white";
    roomNamePreview.innerText = "RoomNameHere";
    fillRoomNamePreviewInnerText(roomNamePreview);
    mainContainerDiv.appendChild(roomNamePreview);

    var playBtn = document.createElement("button");
    playBtn.onclick = function() {
        parent.postMessage('PLAY', '*');
    };
    playBtn.innerText = "PLAY";
    mainContainerDiv.appendChild(playBtn);


    var pauseBtn = document.createElement("button");
    pauseBtn.onclick = function() {
        parent.postMessage('PAUSE', '*');
    };
    pauseBtn.innerText = "PAUSE";
    mainContainerDiv.appendChild(pauseBtn);


    var syncBtn = document.createElement("button");
    syncBtn.onclick = function() {
        parent.postMessage('SYNC', '*');
    };
    syncBtn.innerText = "SYNC";
    mainContainerDiv.appendChild(syncBtn);

    connectBtn = document.createElement("button");
    connectBtn.onclick = function() {
        parent.postMessage('CONNECT', '*');
        connectionEstablished()
    };
    connectBtn.innerText = "CONNECT";
    mainContainerDiv.appendChild(connectBtn);

    disconnectBtn = document.createElement("button");
    disconnectBtn.onclick = function() {
        parent.postMessage('DISCONNECT', '*');
        connectionEstablished(false)
    };
    disconnectBtn.innerText = "DISCONNECT";
    disconnectBtn.disabled = true;
    mainContainerDiv.appendChild(disconnectBtn);


    var loadVideoBtn = document.createElement("button");
    loadVideoBtn.onclick = function() {
        parent.postMessage('LOAD', '*');
    };
    loadVideoBtn.innerText = "VIDEO LOAD";
    mainContainerDiv.appendChild(loadVideoBtn);

    var showUrlBtn = document.createElement("button");
    showUrlBtn.onclick = function() {
        parent.postMessage('INFO', '*');
    };
    showUrlBtn.innerText = "INFO";
    mainContainerDiv.appendChild(showUrlBtn);

    var lagMeasureBtn = document.createElement("button");
    lagMeasureBtn.onclick = function() {
        parent.postMessage('LAG', '*');
    };
    lagMeasureBtn.innerText = "LAG";
    mainContainerDiv.appendChild(lagMeasureBtn);

    /*
        BEGIN: Button for testing
     */
    testingButtons(false, mainContainerDiv);
    /*
        END: Button for testing
     */

    document.body.append(mainContainerDiv);
    isButtonsDivActive = true;
}

function destroyCtrlPanel() {
    document.getElementById(buttonsDivId).remove();
    isButtonsDivActive = false;
}

function disableConnectBtn(toDisable = true)
{
    connectBtn.disabled = toDisable;
}

function disableDisconnectBtn(toDisable = true)
{
    disconnectBtn.disabled = toDisable;
}

function connectionEstablished(isEstablished = true)
{
    disableConnectBtn(isEstablished);
    disableDisconnectBtn(!isEstablished);
}

function fillRoomNamePreviewInnerText(roomNamePreview) {
    browser.storage.sync.get('room_id').then((res) =>
    {
        changeRoomNameInPreview(roomNamePreview, res.room_id);
    });

    browser.storage.onChanged.addListener((c, n) =>
    {
        if (n === "sync" && c.room_id)
        {
            changeRoomNameInPreview(roomNamePreview, c.room_id.newValue);
        }
    });
}

function changeRoomNameInPreview(roomNamePreview, newInnerTextValue)
{
    roomNamePreview.innerText =  newInnerTextValue || "RoomNameNotFound"
}

function testingButtons(isEnabled, mainContainerDiv)
{
    if(isEnabled)
    {
        var clearStorageBtn = document.createElement("button");
        clearStorageBtn.onclick = function() {
            browser.storage.sync.clear().then(() => console.log("CLEARED")).catch((e) => console.log(e));
        };
        clearStorageBtn.innerText = "clearStorageBtn";
        mainContainerDiv.appendChild(clearStorageBtn);
    }
}