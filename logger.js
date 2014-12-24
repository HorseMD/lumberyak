// Basic Steam Chat (and announcement) Logger
// by Horse M.D.
//
// Usage:
// 1. run `npm install steam`.
// 2.1. rename `config_default.js` to `config.js`.
// 2.2. insert your username and password into the relevant area in config.js.
// 3. run this file with `node logger.js`.
// 4. copy the code Valve will have sent you via email and set it as the authcode value in `config.js`.
// 5. run this file again.
//
// You should now no longer be prompted for anything when running the file.

var Steam  = require('steam');
var fs     = require('fs');
var config = require('./config');

var bot = new Steam.SteamClient();
bot.logOn({
    accountName:   config.username,
    password:      config.password,
    authCode:      config.authcode,
    shaSentryfile: config.sentry
});

bot.on('loggedOn', function() {
    console.log('Logged in.');
    bot.setPersonaState(Steam.EPersonaState.Online);
});

bot.on('sentry', function(buf) {
    fs.writeFile("sentry.txt", buf, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('Wrote to sentry file.');
        };
    });
});

bot.on('message', function(source, message, type, chatter) {
    if (message == 'ping') {
        console.log("Recieved 'ping', sending 'pong'.");
        bot.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg);
    }
    else if(message.length > 0) {
        var log_line     = getDateTime() + ' - ' + message + '\n'; // the line written to file
        var console_line = bot.users[source].playerName + ": " + message; // the line written to console

        console.log(console_line);
        fs.appendFile("chat_" + source, log_line, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
});

bot.on('announcement', function(group, headline) {
    fs.appendFile('announcements_' + group, getDateTime() + ' - ' + headline + '\n', function(err) {
        if(err) {
            console.log(err);
        }
    });
});

// Get a pretty human-readable version of the current time and date.
function getDateTime() {
    var date = new Date();

    var hour = zeroify(date.getHours());
    var min  = zeroify(date.getMinutes());
    var sec  = zeroify(date.getSeconds());

    var month = zeroify(date.getMonth() + 1);
    var day   = zeroify(date.getDate());

    return [date.getFullYear(), month, day].join("/") + " " + [hour, min, sec].join(":");
}

// If a number is less than 10, stick a 0 onto the front of it.
function zeroify(num) {
    return (num < 10 ? "0" : "") + num;
}
