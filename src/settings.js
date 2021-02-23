const fs = require('fs');
var timeText = 'Estimate format:\nYou can decide the format for the estimate. Write your desired format as such; hh:mm:ss. ' +
  '\n For the hours, you can put an o after the h\'s to hide the hours if the run is shorter than an hour. Additionally, a double "hh" will result in that the hour is always 2 characters. A single h will produce a single character, if the run is >10 hours. \n' +
  ' Seconds are optional and can be omitted.\nExample inputs: hh:mm, ho:mm:ss, hho:mm, hho:mm:ss  \n\nTime format=h:mm:ss\n\n';
var settingsText = timeText;

var timeSetting = [];

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
        timeSetting = saveData[i].substring(12).split(':');
        module.exports.timeSetting = timeSetting;
      }
    }
  }
};