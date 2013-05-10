var njs = require('nightmare').nightmare('test');

njs.notifyCasperMessage = function(msg) {
    if(msg.type == 'statement') {
        console.log(msg.msg);
        console.log("Nightmare Server says hello.");
    }
    else if(msg.type == 'dateQuestion') {
        console.log(msg.msg);
        var d = new Date();
        njs.sendCasperMessage({ time: d.toString(), timeNow: d.getTime()});
    }
}