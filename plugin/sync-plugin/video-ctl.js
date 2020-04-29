var video = undefined;
var lastLoadedPage = undefined;
var lag = -1;

function loadVideoElement() 
{
	video = document.getElementsByTagName("video")[0];
	if (!video) 
	{
		console.warn("No video was found on this page");
		video = null;
	}
}

function playVideo() 
{
	if (video) 
	{
		video.play();
	} 
	else 
	{
		console.warn("Video is undefined or null");
	}
}

function pauseVideo() 
{
	if (video) 
	{
		video.pause();
	} 
	else 
	{
		console.warn("Video is undefined or null");
	}
}

function syncVideo() 
{
	if (video) 
	{
		video.currentTime = 20
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
}
