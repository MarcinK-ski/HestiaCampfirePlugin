var currentDomainPage = undefined;

var x = document.createElement("object");
x.type = "text/html";
x.data = "http://localhost/sync-plugin/controller.html";
x.style = "position: fixed; z-index: 99999; bottom: 50px; left: 0px; width:60px";
document.body.append(x);

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "http://localhost/sync-plugin/video-ctl.js";
document.head.append(s);

window.addEventListener("message", receiveMessage, false);
window.addEventListener("yt-navigate", onLoadedWebPage);
window.addEventListener("popstate", onLoadedWebPage);

function receiveMessage(event)
{
	var message = event.data;
	console.log("INCOMING MESSAGE: " + message);
	
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