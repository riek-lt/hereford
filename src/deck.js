var fs = require('fs');
const index = require('../index.js');
const data = require('./data.js');
const colors = require('colors/safe');

const folderName = index.folderName;

const currentGame = './' + folderName + '/deck/currentGame.txt';
const currentCategory = './' + folderName + '/deck/currentCategory.txt';
const currentRunner = './' + folderName + '/deck/currentRunner.txt';
const currentSlug = './' + folderName + '/deck/currentSlug.txt';

const next1Game = './' + folderName + '/deck/next1Game.txt';
const next1Category = './' + folderName + '/deck/next1Category.txt';
const next1Runner = './' + folderName + '/deck/next1Runner.txt';
const next1Slug = './' + folderName + '/deck/next1Slug.txt';

const next2Game = './' + folderName + '/deck/next2Game.txt';
const next2Category = './' + folderName + '/deck/next2Category.txt';
const next2Runner = './' + folderName + '/deck/next2Runner.txt';
const next2Slug = './' + folderName + '/deck/next2Slug.txt';

const next3Game = './' + folderName + '/deck/next3Game.txt';
const next3Category = './' + folderName + '/deck/next3Category.txt';
const next3Runner = './' + folderName + '/deck/next3Runner.txt';
const next3Slug = './' + folderName + '/deck/next3Slug.txt';

const deckArray = [ currentGame, currentCategory, currentRunner, currentSlug,
                    next1Game, next1Category, next1Runner, next1Slug,
					next2Game, next2Category, next2Runner, next2Slug,
					next3Game, next3Category, next3Runner, next3Slug ];

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
      }
    } catch (err) {
      console.error(err);
    }
  },
  fill: function(currentRun) {
    schedulejson = data.schedulejson;
	
	// deckruns length is 4 X 4 = 16
	// Category, Name, Runner, Slug
	// Current, next1, next2, next3
    for (var i = 0; i < 16; i++) {
      deckruns[i] = '';
    }
    if (data.method === 'oengus') {
      try {
        for (var i = 0; i < 4; i++) {
          if ((currentRun + i) < data.scheduleLength) {
            if (schedulejson.lines[currentRun + i].game !== null) {
              deckruns[(i * 4) + 0] = schedulejson.lines[currentRun + i].game;
            }
            if (schedulejson.lines[currentRun + i].category !== null) {
              deckruns[(i * 4) + 1] = schedulejson.lines[currentRun + i].category;
            }
            if (schedulejson.lines[currentRun + i].runners[0] !== null) {
              try {
                for (var k = 0; k < schedulejson.lines[currentRun + i].runners.length; k++) {
                  deckruns[(i * 4) + 2] += schedulejson.lines[currentRun + i].runners[k].runnerName + ', ';
                }
                deckruns[(i * 4) + 2] = deckruns[(i * 4) + 2].substring(0, deckruns[(i * 4) + 2].length-2);
              } catch (err) {}
            }
			
            if (schedulejson.lines[currentRun + i].runners !== null) {
              try {
                deckruns[(i * 4) + 3] = schedulejson.lines[currentRun + i].game + " - " +
			    						schedulejson.lines[currentRun + i].category + " by " +
			    						schedulejson.lines[currentRun + i].runners[0].runnerName;
			  
			    if (schedulejson.lines[currentRun + i].runners.length > 1) {
                  for (var k = 1; k < schedulejson.lines[currentRun + i].runners.length; k++) {
                    deckruns[(i * 4) + 3] += " vs. " + schedulejson.lines[currentRun + i].runners[k].runnerName;
                  }
			    }
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
          deckruns[(i * 4) + 0] = schedulejson.data.items[currentRun + i].data[horaroColumns[0]];
          deckruns[(i * 4) + 1] = schedulejson.data.items[currentRun + i].data[horaroColumns[1]];
          deckruns[(i * 4) + 2] = schedulejson.data.items[currentRun + i].data[horaroColumns[2]];
        }
      }
    }
    writeToFiles();
  }
}

function writeToFiles() {
  for (var i = 0; i < 16; i++) {
    try {
      fs.writeFileSync(deckArray[i], deckruns[i], (err) => {
        if (err) throw err;
        console.log("bla");
      });
    } catch (err) {}
  }
  console.log(colors.yellow('Deck Files are updated successfully.'));
}

function clearFiles() {
  for (var i = 0; i < 16; i++) {
    deckruns[i] = ''; //Make sure that all files are emptied before written to again
  }
}
