const settingsFile = require('./settings.js');
const fs = require('fs');
var timeSetting = [];
var saveData;

module.exports = {
  parseDuration: function(PT) {
    var output = [];
    var durationInSec = 0;
    var matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
    var parts = [{
        pos: 1,
        multiplier: 86400 * 365
      },
      {
        pos: 2,
        multiplier: 86400 * 30
      },
      {
        pos: 3,
        multiplier: 604800
      },
      {
        pos: 4,
        multiplier: 86400
      },
      {
        pos: 5,
        multiplier: 3600
      },
      {
        pos: 6,
        multiplier: 60
      },
      {
        pos: 7,
        multiplier: 1
      }
    ];
    for (var i = 0; i < parts.length; i++) {
      if (typeof matches[parts[i].pos] != 'undefined') {
        durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
      }
    }
    // Hours extraction
    console.log(timeSetting)
    if (timeSetting[0].includes('h')) {
      if (timeSetting[0].includes('o')) {
        if (durationInSec > 3599) {
          output.push(parseInt(durationInSec / 3600));
          durationInSec %= 3600;
          extraZero(output);
        }
      } else {
        output.push(parseInt(durationInSec / 3600));
        durationInSec %= 3600;
        extraZero(output);
      }
    }
    // Minutes extraction with leading zero
    output.push(('0' + parseInt(durationInSec / 60)).slice(-2));
    // Seconds extraction with leading zero
    if (timeSetting[timeSetting.length - 1].includes('s')) {
      output.push(('0' + durationInSec % 60).slice(-2));
    }
    return output.join(':');
  },
  readSave: function() {
    saveData = fs.readFileSync('./settings.txt', {
      encoding: 'utf8',
      flag: 'r'
    }).split('\n');
    for (var i = 0; i < saveData.length; i++) {
      if (saveData[i].substring(0, 11) === 'Time format') {
        timeSetting = saveData[i].substring(12).split(':');
      }
    }
  }
};



function extraZero(output) {
  if (timeSetting[0].includes('hh')) {
    output[0] = '0' + output[0];
  }
}
