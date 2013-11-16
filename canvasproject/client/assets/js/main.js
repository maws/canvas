var url = document.getElementById('url'),
connect = document.getElementById('connect'),
websocket,
output 	= $(".output");


// Event handler creates websocket conection on button click
connect.addEventListener('click', function(event)
{
	console.log('Connecting to: ' + url.value);
	outputLog("Connecting to: " + url.value);
	websocket = new WebSocket(url.value, 'protocol');

	// Event handler when socket is open
	websocket.onopen = function()
	{
		console.log('websocket is open');
		outputLog("Connected.");
	}

	websocket.onmessage = function(event)
	{
		console.log('Receiving message: ' + event.data);
		outputLog("Server: " + event.data);
	}

	// Event handler when websocket is closed
	websocket.onclose = function()
	{
		console.log('Websocket closed.');
		outputLog("Disconnected.");
	}
}, false);

// EventHandler to send message
send.addEventListener('click', function(event)
{
	var message = document.getElementById('message').value;

	if (!websocket || websocket.readyState === 3) 
	{
		console.log('The websocket is not connected: FAILED');
	}
	else
	{
		console.log('Sending message: ' + message);
		websocket.send(message);
	}
});

// Eventhadler to close connection
disconnect.addEventListener('click', function(event)
{
	console.log("Disconnecting. . .");
	websocket.close();
});

// Output messages in client
function outputLog(message)
{
	var now = new Date();
	output.append(now.toLocaleTimeString() + ' ' + message + '<br>').scrollTop(output[0].scrollHeight);
}