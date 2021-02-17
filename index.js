//pkg index.js --output marswi
var fs = require('fs');
const readline = require("readline-sync");
const fetch = require("node-fetch");
const colors = require('colors/safe');
const timeConverter = require('./timeConverter');
const data = require('./data');

//Text files
const folderName = "textfiles";
const txtRunner1 = './' + folderName + '/runner1.txt';
const txtRunner2 = './' + folderName + '/runner2.txt';
const txtRunner3 = './' + folderName + '/runner3.txt';
const txtRunner4 = './' + folderName + '/runner4.txt';
const txtGame = './' + folderName + '/game.txt';
const txtCategory = './' + folderName + '/category.txt';
const txtEstimate = './' + folderName + '/estimate.txt';
const txtConsole = './' + folderName + '/console.txt';
const txtArray = [txtRunner, txtGame, txtCategory, txtEstimate, txtConsole];

var userinput = "";
var userinputsub = "";
var slug = "";
var safety = 0;
var currentRun = 0;
var savedRun = "";
var finishSaveCheck = false;
var helpString = colors.green('"n"') + '  for next run\n' +
  colors.green('"p"') + '  for previous run\n' +
  colors.green('"sj"') + ' to silent jump to a run without changing text\n' +
  colors.green('"sn"') + ' to "silent next" to the next run \n' +
  colors.green('"j"') + '  to jump to a run\n' +
  colors.green('"s"') + '  to go to the start of the marathon\n' +
  colors.green('"u"') + '  to update made changes to the schedule';

slug = readline.question('Please post the oengus slug OR full horaro URL for the marathon: ');
data.call(slug);
setTimeout(function() {
  initFiles();
  console.log(helpString);
  while (true) {
    console.log('Current run number: ' + colors.green(currentRun));
    userinput = readline.question('Next command? (h for help) ');
    switch (userinput) {
      case 'n':
        console.log("Switching to next run");
        currentRun++;
        writeToFiles(currentRun + 1, 'plus');
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
        writeToFiles(0, 1);
        currentRun = 0;
        break;
      case 'sj':
        userinputsub = readline.question('What run do you want to jump to silently (input a number)\nMax is ' + data.scheduleLength + ': ');
        try {
          safety = currentRun;
          currentRun = parseInt(userinputsub);
          console.log('SJ successful. Current run is ' + colors.cyan(data.getRun(currentRun)));
        } catch (err) {
          currentRun = safety;
          // console.error(err);
          console.error(colors.red('An error occured. Rolling back...'));
        }
        break;
      case 'sn':
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
      case 'u':
        data.call(slug);
        break;
      case 'l':
        savefileChecker();
        break;
    }
  }
}, 3000);


function writeToFiles(j, k) {
  if (typeof j == 'number') {
    if (j > data.scheduleLength) {
      console.log('Input is bigger than marathon is long, aborting.')
      currentRun = safety;
    } else {
      data.putData(currentRun);
      for (var i = 0; i < txtArray.length; i++) {
        console.log(colors.yellow(txtArray[i]) + colors.cyan(' -> ') + colors.green(data.runArray[i]));
        fs.writeFileSync(txtArray[i], data.runArray[i], (err) => {
          if (err) throw err;
          console.log("bla");
        });
      }
    }
  }
}

function initFiles() {
  if (!fs.existsSync('./' + folderName)) {
    fs.mkdirSync(folderName);
    console.log('Created Folder!')
  }
  try {
    if (fs.existsSync(txtCategory)) {
      console.log("No files are created, files already exist.")
      savefileChecker();
    } else {
      for (var i = 0; i < txtArray.length; i++) {
        fs.writeFile(txtArray[i], ' ', function(err) {
          if (err) throw err;
        });
      }
      console.log('Files are created successfully.');
    }
  } catch (err) {
    console.error(err);
  }
}

function askFirstRun() {
  console.log('Start at first run? '+ colors.green('y') +' will write to text files  (' + colors.green('y') + '/' + colors.green('n') + ')');
  userinput = readline.question(' ');
  if (userinput == 'y') {
    writeToFiles(0, 1);
  }
}

function savefileChecker() {
  savedRun = fs.readFileSync(txtGame);
  for (var i = 0; i < data.scheduleLength; i++) {
    if (data.getRun(i) == savedRun) {
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
