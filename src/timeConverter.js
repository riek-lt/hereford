const settingsFile = require('./settings.js');
const fs = require('fs');
var timeSetting = [];
var saveData;   //Import from settings.js

module.exports = {
  parseDuration: function(PT) { //Converts ISO to hh:mm:ss
    timeSetting = settingsFile.timeSetting;
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
    //Down here is where I work with settings.
    // Hours extraction
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
  }
};


//Adds a zero to parts that doesn't have 2 0's.
function extraZero(output) {
  if (timeSetting[0].includes('hh')) {
    output[0] = '0' + output[0];
  }
}
