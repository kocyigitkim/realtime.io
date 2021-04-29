

# Introduction 
Real time data streaming & socket programming library

# Getting Started
Steps:
1.	Installation
2.	Software dependencies
3.	Usage

# 1. Installation

 - npm install realtime.io
 - yarn add realtime.io
 
# 2. Software dependencies
 - socket.io
 - socket.io-client
 - uuid
 - chalk
 - crypto
 - express
 - http
 - node-cache
 # 3. Usage

-- A. _How To Create & Listen Server_

    // Import RealTime.IO Library
    const realtimeio = require('realtime.io');
    // Define Server Options
    // You can inspect server options from library
    const serverOptions = new realtimeio.server.RealtimeIOServerOptions();
    // Create RealTime Server
    const server = new realtimeio.server.RealtimeIOServer(serverOptions);
    // Listen
    server.listen();
    
-- B. _How To Define Server Object_

    class NotificationServerObject extends realtimeio.server.RealtimeIOServerObject{
	    constructor(server){
		    super('notification', server);
	    }
	    Listener_showNotification(client, type, title, message){
		    console.log(['Type: ', type, 'Title: ', title, 'Message: ', message].join(' '));
	    }
    }
-- C. How To Use Notification Server Object ?

    // Listen
    server.listen();
    // Write this code after listen server expression
    const notificationServer = new NotificationServerObject(server);
Then everything will be nice :)

-- D. How To Create Client ?

    // Import RealTime.IO Library
    const realtimeio = require('realtime.io');
    // Define Client Options
    // You can inspect client options from library
    const clientOptions = new realtimeio.server.RealtimeIOClientOptions();
    // Create RealTime Client
    const client = new realtimeio.client.RealtimeIOClient(clientOptions);
    // Connect to server
    client.connect();

-- E. How To Define Client Object?

    class NotificationClientObject extends realtimeio.client.RealtimeIOClientObject{
		constructor(client){
			super('notification', client);
		}
		showNotification(type, title, message){}
    }
-- F. How To Send A New Notification ?

    // Connect to server
    client.connect();
    // Send new notification
    const notificationObject = new NotificationClientObject(client);
    notificationObject.showNotification('info', 'Example #1', 'Hello world :)');

### If you want to contact with me please follow these links
- Gmail: muhammetkocyigit0@gmail.com
- Github: https://www.github.com/muhammetkocyigit0 