const discord = require('./discord');
const timeConverter = require('./timeConverter');

var runArray = [];
var method = "discord";
var scheduleLength;
var currentRun;
var schedulejson;

// module.exports = {
//
// };

module.exports = {
  putData: function(j) {
    if (method === 'discord') {
      if (schedulejson.lines[j].runners.length > 0) {
        runArray[0] = schedulejson.lines[j].runners[0].username;
      } else {
        runArray[0] = '';
      }
      runArray[1] = schedulejson.lines[j].gameName;
      runArray[2] = schedulejson.lines[j].categoryName;
      runArray[3] = timeConverter.parseDuration(schedulejson.lines[j].estimate);
      runArray[4] = schedulejson.lines[j].console;
      currentRun = runArray[1];
    }
  },
  call: function(slug) {
    discord.apiCall(slug)
    setTimeout(function() {
      schedulejson = discord.schedule;
      scheduleLength = schedulejson.length;
    }, 2000)
  }
};
module.exports.runArray = runArray;
module.exports.length = scheduleLength;
module.exports.currentRun = currentRun;
module.exports.schedulejson = schedulejson;
