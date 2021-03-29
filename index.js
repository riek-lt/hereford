//pkg index.js --output marswi

const folderName = "textfiles";
module.exports.folderName = folderName;

//Declaring all other source files or libraries
var fs = require('fs');
const readline = require("readline-sync");
const fetch = require("node-fetch");
const colors = require('colors/safe');
const timeConverter = require('./src/timeConverter');
const data = require('./src/data');
const settingsFile = require('./src/settings.js');
const twitchSync = require('./src/twitchSync.js');
const deck = require('./src/deck.js');


//Text files
const txtRunner1 = './' + folderName + '/runner1.txt';
const txtRunner2 = './' + folderName + '/runner2.txt';
const txtRunner3 = './' + folderName + '/runner3.txt';
const txtRunner4 = './' + folderName + '/runner4.txt';
const txtGame = './' + folderName + '/game.txt';
const txtCategory = './' + folderName + '/category.txt';
const txtEstimate = './' + folderName + '/estimate.txt';
const txtConsole = './' + folderName + '/console.txt';
const txtArray = [txtGame, txtCategory, txtEstimate, txtConsole, txtRunner1, txtRunner2, txtRunner3, txtRunner4];

var userinput = ""; //User Input
var userinputsub = ""; //Second user input for (silent) jumps. Not necessary
var slug = ""; //input for what schedule
var safety = 0; //Is a backup for the run number for if something goes wrong
var currentRun = 0; // Current run number state
var savedRun = ""; //String for current game name. Used for save feature
var finishSaveCheck = false; //??
var helpString = colors.green('"n"') + '  for next run\n' +
  colors.green('"p"') + '  for previous run\n' +
  colors.green('"sj"') + ' to silent jump to a run without changing text\n' +
  colors.green('"sn"') + ' to "silent next" to the next run \n' +
  colors.green('"j"') + '  to jump to a run\n' +
  colors.green('"s"') + '  to go to the start of the marathon\n' +
  colors.green('"u"') + '  to update made changes to the schedule\n' +
  colors.green('"rs"') + ' to reload the data from settings.txt';

// Start of program
slug = readline.question('Please post the oengus slug OR full horaro URL for the marathon: ');
data.call(slug); //Gets all data from the schedule
setTimeout(function() { //Gives time to do an API call
  initFiles();
  console.log(helpString); //Shows commands
  mainLogic();
  setInterval(function() { //This loops through the program
    mainLogic();
  }, 2 * 1000); //2 seconds interval for the interval
}, 3000); //3 seconds for that API call timeout

function mainLogic() {
  console.log('Current run number: ' + colors.green(currentRun));
  userinput = readline.question('Next command? (h for help) ');
  switch (userinput) {
    case 'n':
      console.log("Switching to next run");
      currentRun++;
      writeToFiles(currentRun + 1, 'plus'); //Writes everything to file
      break;
    case 'p':
      console.log("switching to previous run");
      currentRun--;
      writeToFiles(currentRun - 1, 'min');
      break;
    case 'h':
      console.log(helpString);
      break;
    case 's':
      console.log("Restarting the marathon")
      currentRun = 0;
      writeToFiles(0, 1); //Starts at the start of the marathon.
      break;
    case 'sj':
      userinputsub = readline.question('What run do you want to jump to silently (input a number)\nMax is ' + data.scheduleLength + ': ');
      try {
        safety = currentRun; //Backups current run number in case there's an error
        currentRun = parseInt(userinputsub);
        console.log('SJ successful. Current run is ' + colors.cyan(data.getRun(currentRun)));
      } catch (err) {
        currentRun = safety;
        console.error(colors.red('An error occured. Rolling back...'));
      }
      break;
    case 'sn': //Goes to next run without writing
      currentRun++;
      console.log('"silent next" successful. Current run is ' + colors.cyan(data.getRun(currentRun)));
      break;
    case 'j':
      safety = currentRun;
      userinputsub = readline.question('What run do you want to jump to (input a number)\nMax is ' + data.scheduleLength + ': ');
      try {
        currentRun = parseInt(userinputsub);
        writeToFiles(currentRun, currentRun + 1);
      } catch (err) {
        currentRun = safety;
        console.error(colors.red('An error occured. Rolling back...'));
      }
      break;
    case 'u': //Update data
      data.call(slug);
      break;
    case 'l': //Load from save file, just as the check upon program boot
      savefileChecker();
      break;
    case 'rs': //Reloads settings.txt
      settingsFile.readSave();
      console.log('Reloaded savefile');
      break;
  }
}


function writeToFiles(j, k) { //Writes to files. j= run number, k = unused
  if (typeof j == 'number') { //Is j a number variable?
    if (j > data.scheduleLength) { //Checks if input is bigger than amount of runs
      console.log('Input is bigger than marathon is long, aborting.')
      currentRun = safety;
    } else {
      data.putData(currentRun); //Gets all the data loaded in runArray
      for (var i = 0; i < txtArray.length; i++) {
        if (data.runArray[i] != '') { //Primarily used to not display empty player 2/3/4, but are written
          console.log(colors.yellow(txtArray[i]) + colors.cyan(' -> ') + colors.green(data.runArray[i]));
        }
        fs.writeFileSync(txtArray[i], data.runArray[i], (err) => {
          if (err) throw err;
          console.log("bla");
        });
      }
      if (settingsFile.twitchSync) { //Program to write game to the Twitch channel via API
        twitchSync.writeGame(data.getRun(currentRun));
      }
    }
  }
}

function initFiles() {
  if (!fs.existsSync('./settings.txt')) { //If settings doesn't exist, make one
    settingsFile.create();
  }
  settingsFile.readSave();
  if (!fs.existsSync('./' + folderName)) { //If folder doesn't exist, make one
    fs.mkdirSync(folderName);
    console.log('Created Folder!')
  }
  try {
    if (fs.existsSync(txtCategory)) { //Program checks if txtCategory exists, otherwise makes it. Not best way ofc
      console.log("No files are created, files already exist.")
      savefileChecker();
    } else {
      for (var i = 0; i < txtArray.length; i++) {
        fs.writeFile(txtArray[i], ' ', function(err) {
          if (err) throw err;
        });
      }
      console.log('Files are created successfully.');
      currentRun = 0;
      writeToFiles(0, 1);
    }
  } catch (err) {
    console.error(err);
  }
  deck.create();
}

function askFirstRun() {
  console.log('Start at first run? ' + colors.green('y') + ' will write to text files  (' + colors.green('y') + '/' + colors.green('n') + ')');
  userinput = readline.question(' ');
  if (userinput == 'y') {
    writeToFiles(0, 1);
  }
}

function savefileChecker() {
  savedRun = fs.readFileSync(txtGame); //Reads current txtGame.txt
  for (var i = 0; i < data.scheduleLength; i++) {
    if (data.getRun(i) == savedRun) { //For every run in the marathon, see if a run with the same name is in
      finishSaveCheck = true;
      console.log('Found run in this marathon (' + colors.red(data.getRun(i)) + ') that equals the previous last run. Do you want to resume where you left off? (' + colors.green('y') + '/' + colors.green('n') + ')');
      userinput = readline.question('')
      if (userinput == 'y') {
        currentRun = i;
      } else {
        askFirstRun();
      }
    }
  }
  if (finishSaveCheck) {} else {
    console.log('No similar run found');
    askFirstRun();
  }
}
