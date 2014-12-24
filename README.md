#Lumberyak

Steam chat and announcement logger.

##Chat

* Saved per person by steamid, avoids making tonnes of files when your friends change names.
* All chat logs are saved per user in `./chats/<Steam ID>`.

##Announcements

* All announcements are saved per group in `./announcements/<Group ID>`.
* Only the headline is stored

##Usage

First, rename `config_default.js` to `config.js`. Then, fill in the relevant details (username, password, etc...).
You'll need to run the program once to get an authorization code from Steam, once you have that, set it as the authcode
in `config.js`.

*You'll probably want to change the permissions on the file, for security purposes.*

1. `npm install steam`
2. `node logger.js`

##TODO

* Stop storing login information in plaintext :>
* Perhaps further separate folders so they contain the chats of a single month
