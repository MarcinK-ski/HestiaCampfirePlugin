window.addEventListener("message", receiveMessage, false);
window.addEventListener("yt-navigate", onLoadedWebPage);
window.addEventListener("popstate", onLoadedWebPage);

var currentDomainPage = undefined;

function receiveMessage(event)
{
	var message = event.data;
	console.log("INCOMING MESSAGE: ");
	console.log(message);
	
	switch (message) 
	{
		case "LOAD":
			loadVideoElement();
			break;
		case "PLAY":
			playVideo();
			break;
		case "PAUSE":
			pauseVideo();
			break;
		case "SYNC":
			syncVideo();
			break;
		case "INFO":
			showPageUrl();
			break;
		case "LAG":
			lagMeasure();
			break;
	}
}

function onLoadedWebPage() 
{
	currentDomainPage = document.domain;
	console.log("Current domain is: " + currentDomainPage);
}