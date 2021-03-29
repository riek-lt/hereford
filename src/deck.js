var fs = require('fs');
const index = require('../index.js');

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
const deckArray = [currentGame, currentCategory, currentRunner, nextGame, nextCategory, nextRunner, next2Game, next2Category, next2Runner, next3Game, next3Category, next3Runner];

module.exports = {
  create: function() {
    if (!fs.existsSync('./' + folderName + '/deck')) { //If folder doesn't exist, make one
      fs.mkdirSync(folderName + '/deck');
    }
    try {
      if (fs.existsSync()) { //Program checks if currentGame exists, otherwise makes it. Not best way ofc
      } else {
        for (var i = 0; i < deckArray.length; i++) {
          fs.writeFile(deckArray[i], ' ', function(err) {
            if (err) throw err;
          });
        }
        console.log('Deck Files are created successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  }
}
