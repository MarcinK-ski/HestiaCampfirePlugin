const DEFAULT_ROOM_ID = "R01";

function saveOptions(e)
{
    browser.storage.sync.set({
        room_id: document.querySelector("#room-id").value
    }).then(_ =>
    {
        restoreOptions();
    });
    e.preventDefault();
}

function restoreOptions()
{
    var gettingItem = browser.storage.sync.get('room_id');
    gettingItem.then((res) =>
    {
        var currentRoomId = res.room_id || DEFAULT_ROOM_ID;
        document.querySelector("#room-id").value = currentRoomId;
        document.querySelector("#storage-room-id").innerText = currentRoomId;
    });
}

// TODO: Albo automatyczne wczytywanie currentRoomId albo informowanie ikoną, że nie jest podany
document.querySelector("form").addEventListener("submit", saveOptions);
