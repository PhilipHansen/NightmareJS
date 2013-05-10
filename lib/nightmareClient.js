/*global phantom*/

var utils        = require('utils');
var Casper       = require('casper').Casper;
var socket;

function Nightmare() {
    Nightmare.super_.apply(this, arguments);
    phantom.injectJs(this.cli.get('socketIOHome')+'node_modules/socket.io-client/dist/socket.io.min.js');
    socket = io.connect('http://localhost:1346');
    var self = this;

    socket.on('msgResponse', function(data) {
        self.emit('msg.received', data);
    });

    var lastDataReceived = '';
}

exports.Nightmare = function(args) {
    utils.inherits(Nightmare, Casper);

    /**
     * Sends a message to the node parent server
     * @param   String    message   Message to be sent to the node server. Can be a string or JSON object.
     */
    Nightmare.prototype.sendMessageToParent = function(msg) {
        socket.emit('msg', msg);
    };

    /**
     * Waits until we get a specified emit message
     *
     * @param   String      msgForParent    Message to be send to the node server.
     * @param   String      dataFilter      A filter on the data type to be returned.
     * @param   Function    then            The next step to be preformed. (optional)
     * @param   Function    onTimeout       A callback function to call on timeout. (optional)
     * @param   Number      timeout         The max amount of time to wait, in milliseconds (optional)
     * @return  Nightmare
     */
    Nightmare.prototype.waitForMessageResponse = function waitForEmit(msgForParent, dataFilter, then, timeout, onTimeout) {
        "use strict";
        this.checkStarted();
        timeout = timeout ? timeout : this.options.waitTimeout;
        return this.then(function _step() {
            this.waitStart();
            var start = new Date().getTime();
            var condition = false;
            this.on('msg.received', function(data){
                if(data[dataFilter] !== undefined) {
                    condition = true;
                    this.lastDataReceived = data;
                }
            });

            this.sendMessageToParent(msgForParent);

            var interval = setInterval(function _check(self, timeout, onTimeout) {
                if((new Date().getTime() - start >= timeout) || condition) {
                    self.waitDone();
                    if(!condition) {
                        self.log("Casper.waitFor() timeout", "warning");
                        self.emit('waitFor.timeout');
                        var onWaitTimeout = onTimeout ? onTimeout : self.options.onWaitTimeout;
                        if (!utils.isFunction(onWaitTimeout)) {
                            throw new CasperError('Invalid timeout function, exiting.');
                        }
                        onWaitTimeout.call(self, timeout);
                    } else {
                        self.log(f("waitFor() finished in %dms.", new Date().getTime() - start), "info");
                        if (then) {
                            self.then(then);
                        }
                    }
                    clearInterval(interval);
                }
            }, 100, this, timeout, onTimeout)
        });
    }

    return new Nightmare(args);
}
