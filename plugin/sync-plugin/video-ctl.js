var videoElement = undefined;
var lastLoadedPage = undefined;
var lag = -1;

function loadVideoElement()
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
			if (isConnectionGenerated)
			{
				console.info("Sending play command!");
				hestiaWebsocketConnection.send("PLAY");
			}
			else
			{
				console.warn("Play command not sent - connection was not generated!");
			}
		}
	}
	else
	{
		console.warn("Cannot play video. Video is undefined or null");
	}
}

function pauseVideo(isFromSocket = false)
{
	if (videoElement)
	{
		videoElement.pause();
		if (!isFromSocket)
		{
			if (isConnectionGenerated)
			{
				console.info("Sending pause command!");
				hestiaWebsocketConnection.send("PAUSE");
			}
			else
			{
				console.warn("Pause command not sent - connection was not generated!");
			}
		}
	}
	else
	{
		console.warn("Cannot pause. Video is undefined or null");
	}
}

function syncRequest()
{
	if (videoElement)
	{
		if (isConnectionGenerated)
		{
			console.info("Sending sync command!");
			hestiaWebsocketConnection.send("SYNC-T" + videoElement.currentTime);
		}
		else
		{
			console.warn("Sync command not sent - connection was not generated!");
		}
	}
	else
	{
		console.warn("Sannot send sync request. Video is undefined or null");
	}
}

function syncVideo(command)
{
	if (videoElement)
	{
		const time = command.split('T');
		if (time[1])
		{
			videoElement.currentTime = time[1];
			console.log("Yours video was synced to time: " + time[1]);
		}
	}
	else
	{
		console.warn("Cannot sync. Video is undefined or null");
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
/*
	lag--;
	console.log("Lag: " + lag);
	//destroyCtrlPanel();
*/
}
