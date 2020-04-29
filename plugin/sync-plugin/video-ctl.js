var videoElement = undefined;
var lastLoadedPage = undefined;
var lag = -1;

function loadVideoElement(isFromSocket = false)
{
	console.log(document);
	videoElement = document.getElementsByTagName("video")[0];

	if (!videoElement || !videoElement.offsetParent)
	{
		console.warn("No video was found on this page");

		if (!videoElement.offsetParent)
		{
			console.warn("Video element is hidden");
		}

		videoElement = null;
	}
	else
	{
		console.log("VIDEO FOUND:");
		console.log(videoElement);
	}
}

function playVideo(isFromSocket = false)
{
	if (videoElement)
	{
		videoElement.play();
		if (!isFromSocket)
		{
			console.warn("Sending!");
			console.log(hestiaWebsocketConnection);
			console.log("is" + isConnectionGenerated);
			hestiaWebsocketConnection.send("PLAY");
		}
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function pauseVideo(isFromSocket = false)
{
	if (videoElement)
	{
		videoElement.pause();
		if (!isFromSocket)
		{
			console.warn("Sending!");
			console.log(hestiaWebsocketConnection);
			console.log("is" + isConnectionGenerated);
			hestiaWebsocketConnection.send("PAUSE");
		}
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function syncVideo(isFromSocket = false)
{
	if (videoElement)
	{
		videoElement.currentTime = 20
		generateConnection();
		console.log(hestiaWebsocketConnection);
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function showPageUrl(isFromSocket = false)
{
	console.log(window.top);
	console.log(window.document);
	console.log(currentDomainPage);

	lastLoadedPage = document;
}

function lagMeasure(isFromSocket = false)
{
	lag--;
	console.log("Lag: " + lag);
	//destroyCtrlPanel();
	closeConnection();
}
