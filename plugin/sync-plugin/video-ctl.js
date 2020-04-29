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

function playVideo()
{
	if (videoElement)
	{
		videoElement.play();
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function pauseVideo()
{
	if (videoElement)
	{
		videoElement.pause();
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function syncVideo()
{
	if (videoElement)
	{
		videoElement.currentTime = 20
	}
	else
	{
		console.warn("Video is undefined or null");
	}
}

function showPageUrl()
{
	console.log(window.top);
	console.log(window.document);
	console.log(currentDomainPage);

	lastLoadedPage = document;
}

function lagMeasure()
{
	lag--;
	console.log("Lag: " + lag);
	destroyCtrlPanel();
}
