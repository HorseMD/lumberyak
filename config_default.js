var fs = require('fs');
var config = {};

config.username = process.env.STEAM_USERNAME || 'changeme';
config.password = process.env.STEAM_PASSWORD || 'changeme';
config.authcode = '';
config.sentry   = fs.existsSync('sentry.txt') ? fs.readFileSync('sentry.txt') : '';

module.exports = config;
