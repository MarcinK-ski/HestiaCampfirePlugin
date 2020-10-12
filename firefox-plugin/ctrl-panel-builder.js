const DEFAULT_THOST_TEXT = "GIVE T-HOST";
const buttonsDivId = "hcf-ctrl-panel-div";
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
var toggleUsersSelectorBtn;
var makeTempHostSelectList;
var makeTempHostBtn;

function buildCtrlPanel()
{
    var mainContainerDiv = document.createElement("div");
    mainContainerDiv.id = buttonsDivId;

    userTypePreview = document.createElement("p");
    userTypePreview.id = "hcf-user-type-label";
    userTypePreview.classList.add("hcf-labels");
    setNewUserType(userTypes["DISCONNECTED"]);
    mainContainerDiv.appendChild(userTypePreview);

    roomNamePreview = document.createElement("p");
    roomNamePreview.id = "hcf-room-name-label";
    roomNamePreview.classList.add("hcf-labels");
    roomNamePreview.innerText = "RoomNameHere";
    fillRoomNamePreviewInnerText();
    mainContainerDiv.appendChild(roomNamePreview);

    playBtn = document.createElement("button");
    playBtn.title = "PLAY";
    playBtn.id = "hcf-play-button";
    playBtn.classList.add("hcf-icons");
    playBtn.onclick = function()
    {
        parent.postMessage('PLAY', '*');
    };
    mainContainerDiv.appendChild(playBtn);


    pauseBtn = document.createElement("button");
    pauseBtn.title = "PAUSE";
    pauseBtn.id = "hcf-pause-button";
    pauseBtn.classList.add("hcf-icons");
    pauseBtn.onclick = function()
    {
        parent.postMessage('PAUSE', '*');
    };
    mainContainerDiv.appendChild(pauseBtn);

/*
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
*/

    connectBtn = document.createElement("button");
    connectBtn.title = "CONNECT TO ROOM";
    connectBtn.id = "hcf-connect-button";
    connectBtn.classList.add("hcf-icons");
    connectBtn.onclick = function()
    {
        parent.postMessage('CONNECT', '*');
        connectionEstablished()
    };
    mainContainerDiv.appendChild(connectBtn);

    disconnectBtn = document.createElement("button");
    disconnectBtn.title = "DISCONNECT";
    disconnectBtn.id = "hcf-disconnect-button";
    disconnectBtn.classList.add("hcf-icons");
    disconnectBtn.onclick = function()
    {
        parent.postMessage('DISCONNECT', '*');
        connectionEstablished(false)
    };
    disconnectBtn.disabled = true;
    mainContainerDiv.appendChild(disconnectBtn);


    toggleUsersSelectorBtn = document.createElement("button");
    toggleUsersSelectorBtn.title = "TOGGLE USERS LIST";
    toggleUsersSelectorBtn.id = "hcf-users-list-button";
    toggleUsersSelectorBtn.classList.add("hcf-icons");
    toggleUsersSelectorBtn.onclick = function()
    {
        if (makeTempHostSelectList.style.display === "none")
        {
            makeTempHostSelectList.style.display = "";
            makeTempHostBtn.style.display = "";
        }
        else
        {
            makeTempHostSelectList.style.display = "none";
            makeTempHostBtn.style.display = "none";
        }
    };
    toggleUsersSelectorBtn.style.display = "none";
    toggleUsersSelectorBtn.disabled = true;
    mainContainerDiv.appendChild(toggleUsersSelectorBtn);

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

/*
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
*/

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

    userTypePreview.style.fontWeight = newUserType === userTypes["DISCONNECTED"] ? "normal" : "bold";
}

function setOrRevokeAbilityToGiveTempHostMode(isItHost) {
    if (isItHost)
    {
        toggleUsersSelectorBtn.style.display = "";
    }
    else
    {
        toggleUsersSelectorBtn.style.display = "none";
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
    //syncBtn.disabled = toDisable;
}

function disablePlayBtn(toDisable = true)
{
    playBtn.disabled = toDisable;
}

function disablePauseBtn(toDisable = true)
{
    pauseBtn.disabled = toDisable;
}

function disableToggleUsersBtn(toDisable = true)
{
    toggleUsersSelectorBtn.disabled = toDisable;
}

function connectionEstablished(isEstablished = true)
{
    disableConnectBtn(isEstablished);
    disableDisconnectBtn(!isEstablished);
    disableSyncBtn(!isEstablished);
    disableToggleUsersBtn(!isEstablished);

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
