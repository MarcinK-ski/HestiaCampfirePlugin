window.addEventListener("message", receiveMessage, false);
window.addEventListener("yt-navigate-finish", onLoadedWebPage);
window.addEventListener("DOMContentLoaded", onLoadedWebPage);

browser.storage.onChanged.addListener((c, n) =>
{
    if (n === "sync" && c.room_id && !isConnectionGenerated)
    {
        changeInnerTextInElement(roomNamePreview, c.room_id.newValue, "RoomNameNotFound");
    }
});

// TODO: Event do włączania oraz wyłączania panelu
