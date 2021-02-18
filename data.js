const discord = require('./discord');
const horaro = require('./horaro');
const timeConverter = require('./timeConverter');

const horaroItems = ['Game', 'Category', 'Console', 'Runners']
var runArray = [];
var method = "discord";
var scheduleLength;
var currentRun;
var schedulejson;
var horaroColumns = [];
var horaroRunners = [];

//0 = gameName
//1 = Category name
//2 = estimate
//3 = console
//4-8 = usernames (1/4)
module.exports = {
  putData: function(j) {
    if (method === 'discord') {
      runArray[0] = schedulejson.lines[j].gameName;
      runArray[1] = schedulejson.lines[j].categoryName;
      runArray[2] = timeConverter.parseDuration(schedulejson.lines[j].estimate);
      runArray[3] = schedulejson.lines[j].console;
      for (var l = 0; l < 4; l++) {
        runArray[4 + l] = '';
        try {
          runArray[4 + l] = schedulejson.lines[j].runners[l].username;
        } catch (err) {

        }
      }
      currentRun = runArray[0];
    } else if (method === 'horaro') {

      for (var i = 0; i < 8; i++) {
        runArray[i] = '';
      }
      horaroColumns[0] = schedulejson.data.columns.indexOf(horaroItems[0]);
      horaroColumns[1] = schedulejson.data.columns.indexOf(horaroItems[1]);
      horaroColumns[2] = '';
      horaroColumns[3] = schedulejson.data.columns.indexOf(horaroItems[2]);
      horaroColumns[4] = schedulejson.data.columns.indexOf(horaroItems[3]);
      for (var i = 0; i < horaroColumns.length; i++) {
        if (horaroColumns[i] === -1) {
          horaroColumns[i] = 0;
        }
      }
      runArray[0] = schedulejson.data.items[j].data[horaroColumns[0]];
      runArray[1] = schedulejson.data.items[j].data[horaroColumns[1]];
      runArray[2] = timeConverter.parseDuration(schedulejson.data.items[j].length);
      runArray[3] = schedulejson.data.items[j].data[horaroColumns[3]];
      try {
        if (schedulejson.data.items[j].data[horaroColumns[4]] === null) {} else if (schedulejson.data.items[j].data[horaroColumns[4]].length >= 0) {
          horaroRunners = schedulejson.data.items[j].data[horaroColumns[4]].split(",");
          for (var i = 0; i < horaroRunners.length; i++) {
            if (horaroRunners[i].substring(0,1) === ' ') {
              horaroRunners[i] = horaroRunners[i].slice(1)
            }
            runArray[4 + i] = horaroRunners[i];
          }
        }
      } catch {
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
      return schedulejson.data.items[currentRun].data[schedulejson.data.columns.indexOf(horaroItems[0])];
    }
  }
};

function methodPick(slug) {
  if (slug.includes('horaro')) {
    method = 'horaro';
    console.log('Found Horaro schedule');
  } else {
    method = 'discord';
    console.log('Found Oengus schedule');
  }
}
