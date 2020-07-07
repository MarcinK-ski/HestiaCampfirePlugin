const DEFAULT_ROOM_ID = "R01";
const DEFAULT_USER_FRIENDLY_NAME = `U_${Date.now()}`;

function saveEvenIfAnyOptionIsDefault() {
    saveOptionsToStorage();
}

window.addEventListener('undefinedStorageValue', saveEvenIfAnyOptionIsDefault);

function saveOptionsToStorage() {
    browser.storage.sync.set({
        room_id: document.querySelector("#room-id").value,
        friendly_user_name: document.querySelector("#user-friendly-name").value
    }).then(_ =>
    {
        restoreOptions();
    });
}

function saveOptions(e)
{
    saveOptionsToStorage();
    e.preventDefault();
}

function restoreOptions()
{
    var roomIdFromStorageItem = browser.storage.sync.get('room_id');
    roomIdFromStorageItem.then((res) =>
    {
        document.querySelector("#room-id").value = res.room_id || DEFAULT_ROOM_ID;
        document.querySelector("#storage-room-id").innerText = res.room_id || undefined;
        if (!res.room_id) {
            window.dispatchEvent(new CustomEvent('undefinedStorageValue'))
        }
    });

    var userFriendlyNameFromStorageItem = browser.storage.sync.get('friendly_user_name');
    userFriendlyNameFromStorageItem.then((res) =>
    {
        document.querySelector("#user-friendly-name").value = res.friendly_user_name || DEFAULT_USER_FRIENDLY_NAME;
        document.querySelector("#storage-user-friendly-name").innerText = res.friendly_user_name || undefined;
        if (!res.friendly_user_name) {
            window.dispatchEvent(new CustomEvent('undefinedStorageValue'))
        }
    });
}

// TODO: Albo automatyczne wczytywanie currentRoomId albo informowanie ikoną, że nie jest podany
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
