var fs = require('fs');
const index = require('../index.js');
const data = require('./data.js');

const folderName = index.folderName;
const currentGame = './' + folderName + '/deck/currentGame.txt';
const currentCategory = './' + folderName + '/deck/currentCategory.txt';
const currentRunner = './' + folderName + '/deck/currentRunner.txt';
const next1Game = './' + folderName + '/deck/next1Game.txt';
const next1Category = './' + folderName + '/deck/next1Category.txt';
const next1Runner = './' + folderName + '/deck/next1Runner.txt';
const next2Game = './' + folderName + '/deck/next2Game.txt';
const next2Category = './' + folderName + '/deck/next2Category.txt';
const next2Runner = './' + folderName + '/deck/next2Runner.txt';
const next3Game = './' + folderName + '/deck/next3Game.txt';
const next3Category = './' + folderName + '/deck/next3Category.txt';
const next3Runner = './' + folderName + '/deck/next3Runner.txt';
const deckArray = [currentGame, currentCategory, currentRunner, next1Game, next1Category, next1Runner, next2Game, next2Category, next2Runner, next3Game, next3Category, next3Runner];
const scheduleLength = data.scheduleLength;
var schedulejson = data.schedulejson;
const horaroItems = ['Game', 'Category', 'Runners']
var deckruns = [];
var horaroColumns = [];

module.exports = {
  create: function() {
    if (!fs.existsSync('./' + folderName + '/deck')) { //If folder doesn't exist, make one
      fs.mkdirSync(folderName + '/deck');
    }
    try {
      if (fs.existsSync()) { //Program checks if currentGame exists, otherwise makes it. Not best way ofc
      } else {
        for (var i = 0; i < deckArray.length; i++) {
          fs.writeFile(deckArray[i], '', function(err) {
            if (err) throw err;
          });
        }
        console.log('Deck Files are created successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  },
  fill: function(currentRun) {
    schedulejson = data.schedulejson;
    for (var i = 0; i < 12; i++) {
      deckruns[i] = '';
    }
    if (data.method === 'oengus') {
      try {
        for (var i = 0; i < 4; i++) {
          if ((currentRun + i) < data.scheduleLength) {
            if (schedulejson.lines[currentRun + i].gameName !== null) {
              deckruns[(i * 3) + 0] = schedulejson.lines[currentRun + i].gameName;
            }
            if (schedulejson.lines[currentRun + i].categoryName !== null) {
              deckruns[(i * 3) + 1] = schedulejson.lines[currentRun + i].categoryName;
            }
            if (schedulejson.lines[currentRun + i].runners[0] !== null) {
              try {
                deckruns[(i * 3) + 2] = schedulejson.lines[currentRun + i].runners[0].username;
              } catch (err) {}
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else if (data.method === 'horaro') {
      horaroColumns[0] = schedulejson.data.columns.indexOf(horaroItems[0]);
      horaroColumns[1] = schedulejson.data.columns.indexOf(horaroItems[1]);
      horaroColumns[2] = schedulejson.data.columns.indexOf(horaroItems[2]);
      for (var i = 0; i < horaroColumns.length; i++) {
        if (horaroColumns[i] === -1) {
          horaroColumns[i] = 0; //If a field is empty (most often category name), this is done to not crash the program
        }
      }
      for (var i = 0; i < 4; i++) {
        if ((currentRun + i) < data.scheduleLength) {
          deckruns[(i * 3) + 0] = schedulejson.data.items[currentRun + i].data[horaroColumns[0]];
          deckruns[(i * 3) + 1] = schedulejson.data.items[currentRun + i].data[horaroColumns[1]];
          deckruns[(i * 3) + 2] = schedulejson.data.items[currentRun + i].data[horaroColumns[2]];
        }
      }
    }
    writeToFiles();
  }
}

function writeToFiles() {
  for (var i = 0; i < 12; i++) {
    try {
      fs.writeFileSync(deckArray[i], deckruns[i], (err) => {
        if (err) throw err;
        console.log("bla");
      });
    } catch (err) {}
  }
}

function clearFiles() {
  for (var i = 0; i < 12; i++) {
    deckruns[i] = ''; //Make sure that all files are emptied before written to again
  }
}
