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
        document.querySelector("#room-id").value = res.room_id || DEFAULT_ROOM_ID;
        document.querySelector("#storage-room-id").innerText = res.room_id || undefined;
    });
}

// TODO: Albo automatyczne wczytywanie currentRoomId albo informowanie ikoną, że nie jest podany
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
