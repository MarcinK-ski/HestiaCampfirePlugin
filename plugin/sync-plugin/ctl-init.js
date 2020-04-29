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
			if (!isFromSocket)
			{
				loadVideoElement();
			}
			break;
		case "PLAY":
			playVideo(isFromSocket);
			break;
		case "PAUSE":
			pauseVideo(isFromSocket);
			break;
		case "SYNC":
			if (!isFromSocket)
			{
				syncRequest();
			}
			break;
		case "INFO":
			showPageUrl(isFromSocket);
			break;
		case "LAG":
			lagMeasure(isFromSocket);
			break;
		case "CONNECT":
			if (!isFromSocket)
			{
				generateConnection();
			}
			break;
		case "DISCONNECT":
			if (!isFromSocket)
			{
				closeConnection();
			}
			break;
		default:
			if (message.includes("SYNC-T"))
			{
				syncVideo(message);
			}
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