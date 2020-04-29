console.log("INIT has been started");
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