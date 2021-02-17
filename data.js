const discord = require('./discord');
const horaro = require('./horaro');
const timeConverter = require('./timeConverter');

var runArray = [];
var method = "discord";
var scheduleLength;
var currentRun;
var schedulejson;

//0 = gameName
//1 = Category name
//2 = estimate
//3 = console
//4-8 = usernames (1/4)
module.exports = {
  putData: function(j) {
    if (method === 'discord') {
      //TODO Get multiple runners and split in multiple text files.
      runArray[0] = schedulejson.lines[j].gameName;
      runArray[1] = schedulejson.lines[j].categoryName;
      runArray[2] = timeConverter.parseDuration(schedulejson.lines[j].estimate);
      runArray[3] = schedulejson.lines[j].console;
      if (schedulejson.lines[j].runners.length > 0) {
        runArray[4] = schedulejson.lines[j].runners[0].username;
      } else {
        runArray[4] = '';
      }
      currentRun = runArray[0];
    } else if (method === 'horaro') {
      //TODO Make it find columns automatically
      //TODO also: Split runners in multiple files
      runArray[0] = schedulejson.data.items[j].data[1];
      runArray[1] = schedulejson.data.items[j].data[2];
      runArray[2] = timeConverter.parseDuration(schedulejson.data.items[j].length);
      runArray[3] = schedulejson.data.items[j].data[4];
      if (schedulejson.data.items[j].data[0].length >= 0) {
        runArray[4] = schedulejson.data.items[j].data[0];
      } else {
        runArray[4] = '';
      }
      currentRun = runArray[0];
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
      return schedulejson.data.items[currentRun].data[0];
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
