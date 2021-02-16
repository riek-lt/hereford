//pkg index.js --output marswi
var fs = require('fs');
const readline = require("readline-sync");
const fetch = require("node-fetch");
const colors = require('colors/safe');
const timeConverter = require('./timeConverter');
// const discord = require('./discord');
const data = require('./data');

//Text files
const folderName = "textfiles";
const txtRunner = './' + folderName + '/runner.txt';
const txtGame = './' + folderName + '/game.txt';
const txtCategory = './' + folderName + '/category.txt';
const txtEstimate = './' + folderName + '/estimate.txt';
const txtConsole = './' + folderName + '/console.txt';
const txtArray = [txtRunner, txtGame, txtCategory, txtEstimate, txtConsole];
// var runArray = [];

var userinput = "";
var userinputsub = "";
var slug = "";
// var schedulejson;
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

slug = readline.question('Please post the oengus slug for the marathon: ');
data.call(slug);
setTimeout(function() {
  initFiles();
  // askFirstRun();
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
          var safety = currentRun;
          currentRun = parseInt(userinputsub);
          console.log('SJ successful. Current run is ' + colors.cyan(data.currentRun));
        } catch (err) {
          currentRun = safety;
          console.error(err);
        }
        break;
      case 'sn':
        currentRun++;
        console.log('"silent next" successful. Current run is ' + colors.cyan(data.currentRun));
        break;
      case 'j':
        userinputsub = readline.question('What run do you want to jump to (input a number)\nMax is ' + data.scheduleLength + ': ');
        try {
          var safety = currentRun;
          currentRun = parseInt(userinputsub);
          writeToFiles(currentRun, currentRun + 1);
        } catch (err) {
          currentRun = safety;
          console.error(err);
        }
        break;
      case 'u':
        schedulejson = discord.apiCall(slug);
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
  // if (k == 'plus') {
  //   currentRun = currentRun + 1;
  // } else if (k == 'min') {
  //   currentRun = currentRun - 1;
  // } else if (typeof k == 'number') {
  //   currentRun = k;
  //   console.log('Changed to ' + currentRun);
  // } else {
  //   console.log(colors.red('NO CHANGING'));
  // }
}

// function putData(j) {
//   if (schedulejson.lines[j].runners.length > 0) {
//     runArray[0] = schedulejson.lines[j].runners[0].username;
//   } else {
//     runArray[0] = '';
//   }
//   runArray[1] = schedulejson.lines[j].gameName;
//   runArray[2] = schedulejson.lines[j].categoryName;
//   runArray[3] = timeConverter.parseDuration(schedulejson.lines[j].estimate);
//   runArray[4] = schedulejson.lines[j].console;
// }

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
  console.log('Start at first run? (' + colors.green('y') + '/' + colors.green('n') + ')');
  userinput = readline.question(' ');
  if (userinput == 'y') {
    writeToFiles(0, 1);
  }
}

function savefileChecker() {
  savedRun = fs.readFileSync(txtGame);
  for (var i = 0; i < data.scheduleLength; i++) {
    if (data.schedulejson.lines[i].gameName == savedRun) {
      finishSaveCheck = true;
      console.log('Found run in this marathon (' + colors.red(data.schedulejson.lines[i].gameName) + ') that equals the previous last run. Do you want to resume where you left off? (' + colors.green('y') + '/' + colors.green('n') + ')');
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
