casper.start('http://www.google.com', function() {
    this.test.assertTitle('Google', 'Google has the correct title');
    this.sendMessageToParent({ type: 'statement', msg: 'Hello Nightmare.'})
})

casper.then(function() {
    this.waitForMessageResponse({ type: 'dateQuestion', msg: 'What time is it?'}, 'time', function() {
        var d = new Date();
        this.echo('Nightmare thinks the time is: ' + this.lastDataReceived.time);
        this.log('Nightmare thinks the time is: ' + this.lastDataReceived.time, 'debug');
        this.test.assert(Math.abs(this.lastDataReceived.timeNow - d.getTime()) < 1000, "Nightmare and Casper's times are within 1000 seconds of each other");
    })
});

casper.run(function() {
    this.test.done();
});
