const discord = require('./discord');
const horaro = require('./horaro');
const timeConverter = require('./timeConverter');

var runArray = [];
var method = "discord";
var scheduleLength;
var currentRun;
var schedulejson;

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
    } else if (method === 'horaro') {
      //TODO Make it find columns automatically
      if (schedulejson.data.items[j].data[0].length >= 0) {
        runArray[0] = schedulejson.data.items[j].data[0];
      } else {
        runArray[0] = '';
      }
      runArray[1] = schedulejson.data.items[j].data[1];
      runArray[2] = schedulejson.data.items[j].data[2];
      runArray[3] = timeConverter.parseDuration(schedulejson.data.items[j].length);
      runArray[4] = schedulejson.data.items[j].data[4];
    }
  },
  call: function(slug) {
    methodPick(slug);
    if (method === 'discord') {
      discord.apiCall(slug)
      setTimeout(function() {
        schedulejson = discord.schedule;
        scheduleLength = schedulejson.lines.length;
        module.exports.runArray = runArray;
        module.exports.scheduleLength = scheduleLength;
        module.exports.currentRun = currentRun;
        module.exports.schedulejson = schedulejson;
      }, 2000)
    } else if (method === 'horaro') {
      horaro.apiCall(slug);
      setTimeout(function() {
        schedulejson = horaro.schedule;
        scheduleLength = schedulejson.data.items.length;
        module.exports.runArray = runArray;
        module.exports.scheduleLength = scheduleLength;
        module.exports.currentRun = currentRun;
        module.exports.schedulejson = schedulejson;
      }, 2000)
    }
  },
  getRun: function(currentRun) {
    if (method === 'discord') {
      return schedulejson.lines[currentRun].gameName;
    } else if (method === 'horaro') {
      return schedulejson.data.items[currentRun].data[1];
    }
  }
};

function methodPick(slug) {
  if (slug.includes('horaro')) {
    method = 'horaro';
  } else {
    method = 'discord';
  }
}
