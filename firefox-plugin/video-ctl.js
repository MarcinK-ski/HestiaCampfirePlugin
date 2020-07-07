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
			const currentVideoState = videoElement.paused ? "PAUSED" : "PLAYED";
			const newCommand = `SYNC--|T|${videoElement.currentTime}`
						 	 + `--|S|${currentVideoState}`
							 + `--|U|${window.location.href}`;
			console.log(newCommand);
			hestiaWebsocketConnection.send(newCommand);
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
		const uriVal = command.split("--|U|");
		const requiredUri = uriVal[1];
		if (requiredUri)
		{
			const currentUri = window.location.href;

			if (currentUri !== requiredUri)
			{
				browser.storage.sync.set({
					last_data: {
						room: roomNamePreview.innerText,
						user: currentUserNickname
					}
				}).then(_ => {
					window.location.href = requiredUri;
					console.log("Yours video was synced TO URI: " + requiredUri + "FROM: " + currentUri);
				});
			}
		}

		const playPauseState = command.split("--|S|");
		const requiredPPState = playPauseState[1];
		if (requiredPPState)
		{
			if (requiredPPState.includes("PAUSE"))
			{
				videoElement.pause();
				console.log("Your video was synced to PAUSE");
			}
			else if (requiredPPState.includes("PLAY"))
			{
				videoElement.play();
				console.log("Your video was synced to PLAY");
			}
		}

		const time = command.split("--|T|");
		const notTrimmedTime = time[1];
		if (notTrimmedTime)
		{
			trimmedTime = notTrimmedTime.split("--");
			const requestedTime = trimmedTime[0];
			if (requestedTime && Math.abs(videoElement.currentTime - requestedTime) > 3.14)
			{
				videoElement.currentTime = requestedTime;
				console.log("Yours video was synced to time: " + requestedTime);
			}
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


function sendThostRequest(message)
{
	if (isConnectionGenerated)
	{
		hestiaWebsocketConnection.send(message);
	}
}
