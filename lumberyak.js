// Lumberyak
// Steam Chat (and announcement) Logger
// by Horse M.D.

var Steam  = require('steam');
var fs     = require('fs');
var path   = require('path');
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
    if(message == 'ping') {
        console.log("Recieved 'ping', sending 'pong'.");
        bot.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg);
    }
    else if(message.length > 0) {
        var log_line     = getDateTime() + ' - ' + message + '\n'; // the line written to file
        var console_line = bot.users[source].playerName + ": " + message; // the line written to console

        console.log(console_line);

        var chat_dir = path.join(__dirname, "chat");

        ensurePresent(chat_dir, function(fileerr) {
            if(fileerr) {
                console.log(fileerr);
            } else {
                fs.appendFile(path.join(chat_dir, source), log_line, function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });
    }
});

bot.on('announcement', function(group, headline) {
    var announcements_dir = path.join(__dirname, "announcements");

    ensurePresent(announcements_dir, function(fileerr) {
        if(fileerr) {
            console.log(fileerr);
        } else {
            fs.appendFile(path.join(announcements_dir, group), getDateTime() + ' - ' + headline + '\n', function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
});

// Create the folder at the given path if it doesn't already exist.
function ensurePresent(path, callback) {
    fs.mkdir(path, function(err) {
        if(err) {
            if(err.code == 'EEXIST') {
                callback(null);
            } else {
                console.log("An error occured when trying to write to file.");
                callback(err);
            }
        } else {
            callback(null);
        }
    });
}

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
