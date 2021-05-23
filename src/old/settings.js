const fs = require('fs');
var api = require('twitch-api-v5');
var separator = '\n\n----------------------------\n\n'
var versionnr = "version 2\n\n"
var timeText = 'Estimate format:\nYou can decide the format for the estimate. Write your desired format as such; hh:mm:ss. ' +
  '\n For the hours, you can put an o after the h\'s to hide the hours if the run is shorter than an hour. Additionally, a double "hh" will result in that the hour is always 2 characters. A single h will produce a single character, if the run is >10 hours. \n' +
  ' You cannot actually omit minutes, sorry!\n Seconds are optional and can be omitted.\nExample inputs: hh:mm, ho:mm:ss, hho:mm, hho:mm:ss  \n\nTime format=h:mm:ss\n\n';
var twitchSyncText = 'Twitch sync:\nIf you want this program to attempt to sync the game with Twitch, you can enable this feature. It will give feedback whether it worked, or not (most probable due to the Twitch directory being called differently).\n' +
  'To turn this feature on or off, replace the value to a 1 or 0 respectively.\nTwitch Sync=0\n\nFor the Client-ID, go to dev.twitch.tv, log in on the channel, or a channel that has editor rights to the marathon channel, and make an application. Put the Client-ID you receive down here. \nUse "https://twitchapps.com/tokengen/" as Redirect URL\nClient-ID=\n\n' +
  'Second, for the auth key, go to "https://twitchapps.com/tokengen/", use the previous acquired Client-ID and use the scope "channel_editor". Paste the oAuth token down here.\noAuth token=\n\n' +
  'Finally, fill the channel name down here:\nTwitch name=';
  var horaroNames = 'Horaro names:\nHere you can configure what the names of the columns are with the appropriate data.\n\nGame=Game\nCategory=Category\nConsole=Console\nRunners=Runners\n'
  var horaroItems = ['', '', '', '']
  //Order of things in settingsfile in 1 variable
// var settingsText = versionnr + timeText + separator + twitchSyncText;
var settingsText = versionnr + timeText + separator + horaroNames;
var client_id;    //Twitch client ID for other uses
var updateV2 = separator + horaroNames;

module.exports = {
  create: function() {    //Create settings file
    console.log('settings.txt created');
    fs.writeFileSync('./settings.txt', settingsText);
  },
  readSave: function() {  //Read file
    saveData = fs.readFileSync('./settings.txt', {
      encoding: 'utf8',
      flag: 'r'
    }).split('\n');
    //Reads every line, and saves data from it
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
        api.clientID = client_id; //Sets client ID to the library and retrieves Twitch UserID from Twitch
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
      if (saveData[i].substring(0, 4) === 'Game') {
        horaroItems[0] = saveData[i].substring(5);
      }
      if (saveData[i].substring(0, 8) === 'Category') {
        horaroItems[1] = saveData[i].substring(9);
      }
      if (saveData[i].substring(0, 7) === 'Console') {
        horaroItems[2] = saveData[i].substring(8);
      }
      if (saveData[i].substring(0, 7) === 'Runners') {
        horaroItems[3] = saveData[i].substring(8);
      }
    }
    module.exports.horaroItems = horaroItems;
  },
  versionCheck: function() {
    saveData = fs.readFileSync('./settings.txt', {
      encoding: 'utf8',
      flag: 'r'
    }).split('\n');
    if (saveData[0] !== 'version 2') {
          fs.writeFileSync('./settings.txt', settingsText);
          console.log('Rewritten settings.txt, you might want to re-check your earlier-made settings');
    }
  }

};
