
function Nightmare(test) {
    var spawn = require('child_process').spawn;
    var io = require('socket.io').listen(1346, { log: false });
    var cliArray     = process.argv.slice(2);
    var socket = null;

    if(test) {
        cliArray.splice(0, 0, module.filename.slice(0, -12)+'nightmareTest.js');
    }

    cliArray.splice(1, 0, '--socketIOHome='+require.resolve('socket.io').slice(0, -8));
    cliArray.splice(1, 0, '--moduleHome='+module.filename.slice(0, -12));

    var casperjs = spawn('casperjs', cliArray);

    casperjs.stdout.setEncoding('utf8');
    casperjs.stdout.on('data', function (data) {
        process.stdout.write(data);
    });

    casperjs.stderr.on('data', function (data) {
        process.stdout.write(data);
    });

    casperjs.on('exit', function (code) {
        process.exit(code);
    });

    var self = this;
    io.sockets.on('connection', function (socket) {
        self.socket = socket;
        socket.on('msg', function(data) {
            //when a message is received, call the handling function
            self.notifyCasperMessage.call(self, data);
        })
    });
}

exports.nightmare = function(args) {
    if(args === 'test')
        return new Nightmare(true);
    else
        return new Nightmare(false);
}

Nightmare.prototype.notifyCasperMessage = function(msg) {
    throw new Error('This function is not yet implemented.');
}

//send a message to the casper object. currently only works for responses
Nightmare.prototype.sendCasperMessage = function (msg) {
    this.socket.emit('msgResponse', msg);
}
