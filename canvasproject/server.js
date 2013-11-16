/////////////////////////////////////////////////////////////////////////////
//     HTTP Server                                                                  
/////////////////////////////////////////////////////////////////////////////


var port = 1337;

//Include modules
var http = require('http');

//http server with callback
var httpServer = http.createServer(function(request, response)
{
	response.writeHead(200, {'Content-type' : 'text/plain'});
	response.end('Server is online\n');
});

//http server listen to port for connections
httpServer.listen(port, function()
{
	console.log((new Date()) + ' HTTP server is listening on port ' + port);
});


/////////////////////////////////////////////////////////////////////////////
//     WebSocket Server                                                                
/////////////////////////////////////////////////////////////////////////////

// Include modules
var WebSocketServer = require('websocket').server;

//Create object for WebSockets
wsServer = new WebSocketServer(
{
	httpServer: httpServer,
	autoAcceptConnections: false
});

//Check client origin (whitelisting)
function originIsAllowed(origin)
{
	if(origin === 'http://localhost' || origin === 'null')
	{
		return true;
	}
	else
	{
		return false;
	}
}

// create a callback to handle each conencection request
wsServer.on('request', function(request)
{

	// Check origin before allowing connection
	if(!originIsAllowed(request.origin))
	{
		request.reject();
		console.log((new Date()) + 'Connection from origin ' + request.origin + ' was denied.');

		return;
	}

	var connection = request.accept('protocol');
	console.log((new Date()) + 'Connection established from ' + request.origin);

	// Callback for each message from client
	connection.on('message', function(message)
	{
		if(message.type === 'utf8')
		{
			console.log('Recieved message: ' + message.utf8Data);
			connection.sendUTF(message.utf8Data);
		}
		else if(message.type === 'binary')
		{
			console.log(' Recieved binary message of ' + message.binaryData.length + ' bytes');
			connection.sendBytes(message.binaryData);
		}
	});

	//Callback when client closes connection
	connection.on('close', function(reasonCode, description)
	{
		console.log((new Date()) + ' User ' + connection.remoteAddress + ' disconnected');
	});
});