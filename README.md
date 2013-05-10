#NightmareJS

NightmareJS is a means to connect CasperJS with NodeJS. There is no need to rewrite existing CasperJS code.
Instead, it passes data over a socket.io connection between the Casper object and the Node server, allowing you
to query specific data or execute specific functions that node offers but are unavailable in the web browser that Casper
operates through.

##Install
```bash
> npm install nightmarejs
```

##Usage
You'll first need to create a javascript file to control and listen to the nightmare components.
To initialize the class, use:
```javascript
var nightmareJS = require('nightmareServer').nightmare();
```
If you plan to use this for testing, pass in the parameter 'test' to the object during creation, like:
```javascript
var nightmareJS = require('nightmareServer').nightmare('test');
```

Once the object has been created, you'll need to implement a function called 'notifyCasperMessage'. This is the function that
gets called every time the node side receives a message from the casper side. An example implementation is:
```javascript
nightmareJS.notifyCasperMessage = function(msg) {
    if(msg.type == 'statement') {
        console.log(msg.msg);
        console.log("Nightmare Server says hello.");
    }
    else if(msg.type == 'dateQuestion') {
        console.log(msg.msg);
        var d = new Date();
        nightmareJS.sendCasperMessage({ time: d.toString(), timeNow: d.getTime()});
    }
}
```

On the Casper side, to send a message to the server, call the function:
```javascript
/**
	msgForParent	= Object to be sent to the Node server.
	expectedTerm 		= Term that is expected to be included in response from the Node server.
	then			= Function with the next step for casper to execute. (Optional)
	timeout			= Millisecond timeout value. If not included, specified default is used instead. (Optional)
	onTimeout		= Function to be executed on timeout. (Optional)
*/
casper.waitForMessageResponse(msgForParent, expectedTerm, then, timeout, onTimeout);
```

Once it is all together, you can run it like:
```bash
> node examples/server.js --log-level=debug --direct examples/casper.js
```
For a more complete example set, please look in the example folder.

##Command Line Options
When running a Nightmare test, you can pass in any of the command line options that CasperJS takes provided that they
come after your server file. Example form:
```bash
> node server_filename.js [command line options] casper_filenames.js
```

##License
MIT Licensed