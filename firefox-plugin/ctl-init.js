console.log("INIT has been started");
var currentDomainPage = undefined;
var currentThost = undefined;

function receiveMessage(event, isFromSocket = false)
{
	var message = event.data;
	console.log("INCOMING MESSAGE: ");
	console.log(message);
	var heartbeat = false;

	try
	{
		var objectFromJson = JSON.parse(message);

		if (objectFromJson.usersInThisRoom)	// When contains info about current users in the room
		{
			makeTempHostSelectList.innerHTML = "<option value=''>/SELECT USER/</option>";
			var usersInRoom = objectFromJson.usersInThisRoom;

			for (var i = 0; i < usersInRoom.length; i++)
			{
				var currentUser = usersInRoom[i];
				var option = document.createElement("option");
				option.value = JSON.stringify(currentUser);
				option.innerText = `${currentUser.no}.${currentUser.user} (${currentUser.type})`;

				makeTempHostSelectList.appendChild(option);
			}
		}
		else
		{
			var exceptionMsg = "Json detected, but is not match to any pattern";
			console.warn(exceptionMsg);
			throw exceptionMsg;
		}
	}
	catch (e)	// When is not JSON (parsing failed) or JSON don't "match with pattern" (don't have specified property)
	{
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
			case "HEARTBEAT":
				if (!isUserTypeWithPermission(currentUserType) || (currentThost && currentUserType === userTypes.HOST))
				{
					break;
				}
				heartbeat = true;
			case "SYNC":
				if (!isFromSocket || heartbeat)
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
				if (message.includes("SYNC--|T|"))
				{
					syncVideo(message);
				}
				else if (message.includes("UTYPE--|NT|"))
				{
					const newTypeCommandArray = message.split("--|NT|");
					if (newTypeCommandArray[1])
					{
						const newType = userTypes[newTypeCommandArray[1]];
						if (newType)
						{
							if (newType === userTypes.HOST && currentUserType !== userTypes.HOST)
							{
								currentThost = undefined;
							}

							setNewUserType(newType);
						}
					}
				}
				else if (message.includes("THOST - "))
				{
					var json = message.substring(message.indexOf('-') + 1).trim();
					try
					{
						JSON.parse(json);
						sendThostRequest(message);
					}
					catch (e)
					{
						alert("Giving HOST-T permission failed");
						console.error(`${e}\n${json}`);
					}
				}
				else if (message.includes("THOSTUPDATE:"))
				{
					var whoIsThost = message.substring(message.indexOf(':') + 1).trim();
					var newInfo = whoIsThost ? `New HOST-T is: ${whoIsThost}.` : "No HOST-T user in this room anymore."
					alert(newInfo);
					currentThost = whoIsThost || undefined;
				}
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

		restorePreviousDataIfExists();
	}
	else
	{
		// TODO: Info, ze nie ma video - najlepiej ikonka plugina
		console.error("Video not found");
		if (isButtonsDivActive && !forceDisplay)
		{
			destroyCtrlPanel();
		}
	}
}

function restorePreviousDataIfExists() {
	var getLastData = browser.storage.sync.get('last_data');
	getLastData.then((res) =>
	{
		const lastData = res.last_data;
		if (lastData && lastData.room && lastData.user)
		{
			console.warn(`Restoring last data -> room: ${lastData.room} and user: ${lastData.user}`);
			connectionEstablished()
			generateConnection(lastData.user, lastData.room);

			browser.storage.sync.set({ last_data: undefined }).then(_ => console.log("Last data has been cleared!"));
		}
	});
}