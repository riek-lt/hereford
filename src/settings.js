const fs = require('fs');
var api = require('twitch-api-v5');
var separator = '\n\n----------------------------\n\n'
var versionnr = "version 1\n\n"
var timeText = 'Estimate format:\nYou can decide the format for the estimate. Write your desired format as such; hh:mm:ss. ' +
  '\n For the hours, you can put an o after the h\'s to hide the hours if the run is shorter than an hour. Additionally, a double "hh" will result in that the hour is always 2 characters. A single h will produce a single character, if the run is >10 hours. \n' +
  ' You cannot actually omit minutes, sorry!\n Seconds are optional and can be omitted.\nExample inputs: hh:mm, ho:mm:ss, hho:mm, hho:mm:ss  \n\nTime format=h:mm:ss\n\n';
var twitchSyncText = 'Twitch sync:\nIf you want this program to attempt to sync the game with Twitch, you can enable this feature. It will give feedback whether it worked, or not (most probable due to the Twitch directory being called differently).\n' +
  'To turn this feature on or off, replace the value to a 1 or 0 respectively.\nTwitch Sync=0\n\nFor the Client-ID, go to dev.twitch.tv, log in on the channel, or a channel that has editor rights to the marathon channel, and make an application. Put the Client-ID you receive down here. \nUse "https://twitchapps.com/tokengen/" as Redirect URL\nClient-ID=\n\n' +
  'Second, for the auth key, go to "https://twitchapps.com/tokengen/", use the previous acquired Client-ID and use the scope "channel_editor". Paste the oAuth token down here.\noAuth token=\n\n' +
  'Finally, fill the channel name down here:\nTwitch name=';
// var settingsText = versionnr + timeText + separator + twitchSyncText;
var settingsText = versionnr + timeText
var client_id;

module.exports = {
  create: function() {
    console.log('settings.txt created');
    fs.writeFileSync('./settings.txt', settingsText);
  },
  readSave: function() {
    saveData = fs.readFileSync('./settings.txt', {
      encoding: 'utf8',
      flag: 'r'
    }).split('\n');
    for (var i = 0; i < saveData.length; i++) {
      if (saveData[i].substring(0, 11) === 'Time format') {
        module.exports.timeSetting = saveData[i].substring(12).split(':');
      }
      if (saveData[i].substring(0, 11) === 'Twitch Sync') {
        if (saveData[i].substring(12) === '1') {
          module.exports.twitchSync = true;
        } else if (saveData[i].substring(12) === '0') {
          module.exports.twitchSync = false;
        }
      }
      if (saveData[i].substring(0, 9) === 'Client-ID') {
        module.exports.clientID = saveData[i].substring(10);
        client_id = saveData[i].substring(10);
      }
      if (saveData[i].substring(0, 11) === 'oAuth token') {
        module.exports.oAuthToken = saveData[i].substring(12);
      }
      if (saveData[i].substring(0, 11) === 'Twitch name') {
        api.clientID = client_id;
        api.users.usersByName({
            users: saveData[i].substring(12)
          },
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              module.exports.twitchID = res.users[0]._id;
            }
          });
      }
    }
  }
};
