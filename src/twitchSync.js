// const fetch = require("node-fetch");
const settingsFile = require('./settings.js');
var api = require('twitch-api-v5');
const colors = require('colors/safe');


module.exports = {
  writeGame: function(gameName) {
    api.clientID = settingsFile.clientID;

    api.channels.updateChannel({
      auth: settingsFile.oAuthToken,
      channelID: '26082881',
      game: gameName,
      status: 'Any%'
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(res);
      }
    });
    console.log("Game on Twitch changed to " + colors.green(gameName));
  }
};
