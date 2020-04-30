const buttonsDivId = "CtlButtonsDivCtrlPanel";
var isButtonsDivActive = false;
var forceDisplay = false;

var connectBtn;
var disconnectBtn;

    function buildCtrlPanel() {
    var buttonsDiv = document.createElement("div");
    buttonsDiv.id = buttonsDivId;
    buttonsDiv.style = "background-color: rgba(255, 0, 0, 0.3); opacity: 0.5; position: fixed; z-index: 99999; bottom: 50px; left: 0px; width:60px";


    var playBtn = document.createElement("button");
    playBtn.onclick = function() {
        parent.postMessage('PLAY', '*');
    };
    playBtn.innerText = "PLAY";
    buttonsDiv.appendChild(playBtn);


    var pauseBtn = document.createElement("button");
    pauseBtn.onclick = function() {
        parent.postMessage('PAUSE', '*');
    };
    pauseBtn.innerText = "PAUSE";
    buttonsDiv.appendChild(pauseBtn);


    var syncBtn = document.createElement("button");
    syncBtn.onclick = function() {
        parent.postMessage('SYNC', '*');
    };
    syncBtn.innerText = "SYNC";
    buttonsDiv.appendChild(syncBtn);

    connectBtn = document.createElement("button");
    connectBtn.onclick = function() {
        parent.postMessage('CONNECT', '*');
        connectionEstablished()
    };
    connectBtn.innerText = "CONNECT";
    buttonsDiv.appendChild(connectBtn);

    disconnectBtn = document.createElement("button");
    disconnectBtn.onclick = function() {
        parent.postMessage('DISCONNECT', '*');
        connectionEstablished(false)
    };
    disconnectBtn.innerText = "DISCONNECT";
    disconnectBtn.disabled = true;
    buttonsDiv.appendChild(disconnectBtn);


    var loadVideoBtn = document.createElement("button");
    loadVideoBtn.onclick = function() {
        parent.postMessage('LOAD', '*');
    };
    loadVideoBtn.innerText = "VIDEO LOAD";
    buttonsDiv.appendChild(loadVideoBtn);

    var showUrlBtn = document.createElement("button");
    showUrlBtn.onclick = function() {
        parent.postMessage('INFO', '*');
    };
    showUrlBtn.innerText = "INFO";
    buttonsDiv.appendChild(showUrlBtn);

    var lagMeasureBtn = document.createElement("button");
    lagMeasureBtn.onclick = function() {
        parent.postMessage('LAG', '*');
    };
    lagMeasureBtn.innerText = "LAG";
    buttonsDiv.appendChild(lagMeasureBtn);


    document.body.append(buttonsDiv);
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