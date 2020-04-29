console.log("INIT has been started");
var currentDomainPage = undefined;

function receiveMessage(event, isFromSocket = false)
{
	var message = event.data;
	console.log("INCOMING MESSAGE: ");
	console.log(message);
	
	switch (message) 
	{
		case "LOAD":
			loadVideoElement(isFromSocket);
			break;
		case "PLAY":
			playVideo(isFromSocket);
			break;
		case "PAUSE":
			pauseVideo(isFromSocket);
			break;
		case "SYNC":
			syncVideo(isFromSocket);
			break;
		case "INFO":
			showPageUrl(isFromSocket);
			break;
		case "LAG":
			lagMeasure(isFromSocket);
			break;
	}
}

function onLoadedWebPage()
{
	// TODO: FORCE DISPLAY!!!!
	currentDomainPage = document.domain;
	console.log("Current domain is: " + currentDomainPage);

	loadVideoElement();
	if (videoElement)
	{
		if (!isButtonsDivActive)
		{
			buildCtrlPanel();
		}
	}
	else
	{
		// TODO: Info, ze nie ma video - najlepiej ikonka plugina

		if (isButtonsDivActive && !forceDisplay)
		{
			destroyCtrlPanel();
		}
	}
}