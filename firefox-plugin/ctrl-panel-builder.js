const DEFAULT_THOST_TEXT = "GIVE T-HOST";
const buttonsDivId = "CtlButtonsDivCtrlPanel";
var isButtonsDivActive = false;
var forceDisplay = false;

var currentUserType;

var roomNamePreview;
var userTypePreview;
var playBtn;
var pauseBtn;
var syncBtn;
var connectBtn;
var disconnectBtn;
var makeTempHostSelectList;
var makeTempHostBtn;

function buildCtrlPanel()
{
    var mainContainerDiv = document.createElement("div");
    mainContainerDiv.id = buttonsDivId;
    mainContainerDiv.style = "background-color: rgba(255, 0, 0, 0.3); opacity: 0.5; position: fixed; z-index: 99999; bottom: 50px; left: 0px; width:60px";

    roomNamePreview = document.createElement("p");
    roomNamePreview.style.color = "white";
    roomNamePreview.innerText = "RoomNameHere";
    fillRoomNamePreviewInnerText();
    mainContainerDiv.appendChild(roomNamePreview);

    userTypePreview = document.createElement("p");
    userTypePreview.style.color = "white";
    setNewUserType(userTypes["DISCONNECTED"]);
    mainContainerDiv.appendChild(userTypePreview);


    playBtn = document.createElement("button");
    playBtn.onclick = function()
    {
        parent.postMessage('PLAY', '*');
    };
    playBtn.innerText = "PLAY";
    mainContainerDiv.appendChild(playBtn);


    pauseBtn = document.createElement("button");
    pauseBtn.onclick = function()
    {
        parent.postMessage('PAUSE', '*');
    };
    pauseBtn.innerText = "PAUSE";
    mainContainerDiv.appendChild(pauseBtn);


    syncBtn = document.createElement("button");
    syncBtn.onclick = function()
    {
        if (isUserTypeWithPermission(currentUserType))
        {
            parent.postMessage('SYNC', '*');
        }
        else
        {
            alert("No permission to sync!");
        }
    };
    syncBtn.innerText = "SYNC";
    syncBtn.disabled = true;
    mainContainerDiv.appendChild(syncBtn);

    connectBtn = document.createElement("button");
    connectBtn.onclick = function()
    {
        parent.postMessage('CONNECT', '*');
        connectionEstablished()
    };
    connectBtn.innerText = "CONNECT";
    mainContainerDiv.appendChild(connectBtn);

    disconnectBtn = document.createElement("button");
    disconnectBtn.onclick = function()
    {
        parent.postMessage('DISCONNECT', '*');
        connectionEstablished(false)
    };
    disconnectBtn.innerText = "DISCONNECT";
    disconnectBtn.disabled = true;
    mainContainerDiv.appendChild(disconnectBtn);

    makeTempHostSelectList = document.createElement("select");
    makeTempHostSelectList.style.display = "none";
    makeTempHostSelectList.onchange = userSelectedFromList;
    mainContainerDiv.append(makeTempHostSelectList);

    makeTempHostBtn = document.createElement("button");
    makeTempHostBtn.onclick = function()
    {
        var currentUser = makeTempHostSelectList.value;
        if (currentUser)
        {
            parent.postMessage(`THOST - ${currentUser}`, '*');
        }
    }
    makeTempHostBtn.innerText = DEFAULT_THOST_TEXT;
    makeTempHostBtn.style.display = "none";
    makeTempHostBtn.disabled = true;
    mainContainerDiv.append(makeTempHostBtn);

    var loadVideoBtn = document.createElement("button");
    loadVideoBtn.onclick = function()
    {
        parent.postMessage('LOAD', '*');
    };
    loadVideoBtn.innerText = "VIDEO LOAD";
    mainContainerDiv.appendChild(loadVideoBtn);

    var showUrlBtn = document.createElement("button");
    showUrlBtn.onclick = function()
    {
        parent.postMessage('INFO', '*');
    };
    showUrlBtn.innerText = "INFO";
    mainContainerDiv.appendChild(showUrlBtn);

    var lagMeasureBtn = document.createElement("button");
    lagMeasureBtn.onclick = function()
    {
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

function userSelectedFromList(event)
{
    try
    {
        var currentUser = makeTempHostSelectList.value;
        if (currentUser)
        {
            makeTempHostBtn.disabled = false;

            var selectedUser = JSON.parse(makeTempHostSelectList.value);
            if (selectedUser.type === userTypes.HOST)
            {
                makeTempHostBtn.disabled = true;
            }
            else if (selectedUser.type === userTypes["HOST-T"])
            {
                makeTempHostBtn.innerText = "REVOKE T-HOST";
            }
            else
            {
                makeTempHostBtn.innerText = DEFAULT_THOST_TEXT;
            }
        }
        else
        {
            makeTempHostBtn.disabled = true;
            makeTempHostBtn.innerText = DEFAULT_THOST_TEXT;
        }
    }
    catch (e)
    {
        console.error(e);
        makeTempHostBtn.disabled = true;
        makeTempHostBtn.innerText = DEFAULT_THOST_TEXT;
    }
}

function destroyCtrlPanel()
{
    document.getElementById(buttonsDivId).remove();
    isButtonsDivActive = false;
}

function setNewUserType(newUserType)
{
    currentUserType = newUserType;
    userTypePreview.innerText = newUserType;

    if (isButtonsDivActive)
    {
        disableSyncBtn(!isUserTypeWithPermission(newUserType));
        disablePlayBtn(newUserType === userTypes["GUEST-D"]);
        disablePauseBtn(newUserType === userTypes["GUEST-D"]);
        setOrRevokeAbilityToGiveTempHostMode(newUserType === userTypes["HOST"]);
    }
}

function setOrRevokeAbilityToGiveTempHostMode(isItHost) {
    if (isItHost)
    {
        makeTempHostBtn.style.display = "";
        makeTempHostSelectList.style.display = "";
    }
    else
    {
        makeTempHostBtn.style.display = "none";
        makeTempHostSelectList.style.display = "none";
    }
}

function disableConnectBtn(toDisable = true)
{
    connectBtn.disabled = toDisable;
}

function disableDisconnectBtn(toDisable = true)
{
    disconnectBtn.disabled = toDisable;
}

function disableSyncBtn(toDisable = true)
{
    syncBtn.disabled = toDisable;
}

function disablePlayBtn(toDisable = true)
{
    playBtn.disabled = toDisable;
}

function disablePauseBtn(toDisable = true)
{
    pauseBtn.disabled = toDisable;
}

function connectionEstablished(isEstablished = true)
{
    disableConnectBtn(isEstablished);
    disableDisconnectBtn(!isEstablished);
    disableSyncBtn(!isEstablished);

    if (!isEstablished)
    {
        fillRoomNamePreviewInnerText();
        setNewUserType(userTypes["DISCONNECTED"]);
        currentThost = undefined;
    }
}

function fillRoomNamePreviewInnerText()
{
    browser.storage.sync.get('room_id').then((res) =>
    {
        changeInnerTextInElement(roomNamePreview, res.room_id, "RoomNameNotFound");
    });
}

function changeInnerTextInElement(elem, newInnerTextValue, defaultStaticText)
{
    elem.innerText =  newInnerTextValue || defaultStaticText;
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