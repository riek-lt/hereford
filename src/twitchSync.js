// const fetch = require("node-fetch");
const settingsFile = require('./settings.js');
var api = require('twitch-api-v5');
const colors = require('colors/safe');


module.exports = {
  writeGame: function(gameName) { //Writes game to Twitch API
    api.clientID = settingsFile.clientID;

    api.channels.updateChannel({
      auth: settingsFile.oAuthToken,
      channelID: settingsFile.twitchID,
      game: gameName,   //Reads gameName
      status: 'Any%'  //Useless
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(res);
            console.log("Game on Twitch changed to " + colors.green(gameName))
      }
    });;
  }
};
