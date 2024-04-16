const oengus = require('./schedules/oengus');
const horaro = require('./schedules/horaro');
const timeConverter = require('./timeConverter');
const colors = require('colors/safe');
const settingsFile = require('./settings.js');

var horaroItems;
var runArray = [];
var method = "oengus";
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
    for (var i = 0; i < 8; i++) {
      runArray[i] = ''; //Make sure that all files are emptied before written to again
    }
    if (method === 'oengus') { //Only oengus stuff here
      if (schedulejson.lines[j].gameName !== null) {
        runArray[0] = schedulejson.lines[j].gameName;
        if (schedulejson.lines[j].categoryName !== null) {
          runArray[1] = schedulejson.lines[j].categoryName;
        } else {
          runArray[1] = '';
        }
        runArray[2] = timeConverter.parseDuration(schedulejson.lines[j].estimate);
        if (schedulejson.lines[j].console !== null) {
          runArray[3] = schedulejson.lines[j].console;
        } else {
          runArray[3] = '';
        }
        for (var l = 0; l < 4; l++) {
          runArray[4 + l] = '';
          try { //Doesn't error the program if run has <4 runners in it
            runArray[4 + l] = schedulejson.lines[j].runners[l].displayName;
          } catch (err) {}
        }
        currentRun = runArray[0]; //gameName is set to currentRun
      } else {
        console.log(colors.magenta('This might be a setup block, so nothing is written'));
      }
    } else if (method === 'horaro') { //Horaro stuff often
      //Since Horaro can have random orders for name, game, category etc, I scan all
      //names for the columns and assign them in the correct order here. Estimate is set.
      horaroItems = settingsFile.horaroItems;
      horaroColumns[0] = schedulejson.data.columns.indexOf(horaroItems[0]);
      horaroColumns[1] = schedulejson.data.columns.indexOf(horaroItems[1]);
      horaroColumns[2] = ''; //Estimate gets defined staticly.
      horaroColumns[3] = schedulejson.data.columns.indexOf(horaroItems[2]);
      horaroColumns[4] = schedulejson.data.columns.indexOf(horaroItems[3]);
      for (var i = 0; i < horaroColumns.length; i++) {
        if (horaroColumns[i] === -1) {
          horaroColumns[i] = 0; //If a field is empty (most often category name), this is done to not crash the program
        }
      }
      //write to runArray for outside use
      runArray[0] = schedulejson.data.items[j].data[horaroColumns[0]];
      if (schedulejson.data.items[j].data[horaroColumns[1]] !== null) {
        runArray[1] = schedulejson.data.items[j].data[horaroColumns[1]];
      } else {
        runArray[1] = '';
      }
      runArray[2] = timeConverter.parseDuration(schedulejson.data.items[j].length);
      if (schedulejson.data.items[j].data[horaroColumns[3]] === null) {
        runArray[3] = ' ';
      } else {
        runArray[3] = schedulejson.data.items[j].data[horaroColumns[3]];
      }
      try { //This separates users first before it writes them.
        if (schedulejson.data.items[j].data[horaroColumns[4]] === null) {} else if (schedulejson.data.items[j].data[horaroColumns[4]].length >= 0) {
          horaroRunners = schedulejson.data.items[j].data[horaroColumns[4]].split(",");
          for (var i = 0; i < horaroRunners.length; i++) {
            if (horaroRunners[i].substring(0, 1) === ' ') {
              horaroRunners[i] = horaroRunners[i].slice(1)
            }
            runArray[4 + i] = horaroRunners[i];
          }
        }
      } catch {
        runArray[4] = ''; //If there's no runners, it just gets set to empty
      }
      currentRun = runArray[0]; //gameName is set to currentRun
    }
  },
  call: function(slug) { //Init input from program.
    methodPick(slug); //Checks if schedule is Oengus or Horaro
    if (method === 'oengus') {
      oengus.apiCall(slug) //Calls json data to be retrieved
      setTimeout(function() { //Give time to do an API call
        schedulejson = oengus.schedule; //All json gets put here.
        scheduleLength = schedulejson.lines.length; //Amount of runs.
        module.exports.runArray = runArray; //Export stuff
        module.exports.scheduleLength = scheduleLength;
        module.exports.currentRun = currentRun;
        module.exports.schedulejson = schedulejson;
      }, 2000)
    } else if (method === 'horaro') {
      horaro.apiCall(slug); //Exactly the same as above but horaro
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
  getRun: function(currentRun) { //This one returns the gamename
    if (method === 'oengus') {
      return schedulejson.lines[currentRun].gameName;
    } else if (method === 'horaro') { //Long value since horaro doesn't have a static order
      horaroItems = settingsFile.horaroItems;
      return schedulejson.data.items[currentRun].data[schedulejson.data.columns.indexOf(horaroItems[0])];
    }
  }
};

function methodPick(slug) { //Checks whether the input is horaro or oengus
  if (slug.includes('horaro')) { //The method is literally "is it a horaro url lol"
    method = 'horaro';
    console.log('Found Horaro schedule');
  } else {
    method = 'oengus';
    console.log('Found Oengus schedule');
  }
  module.exports.method = method;
}
