var fs = require('fs');
const readline = require("readline-sync");
const fetch = require("node-fetch");

//Text files
const folderName = "textfiles";
const txtRunner = './' + folderName + '/runner.txt';
const txtGame = './' + folderName + '/game.txt';
const txtCategory = './' + folderName + '/category.txt';
const txtEstimate = './' + folderName + '/estimate.txt';
const txtConsole = './' + folderName + '/console.txt';
const txtArray = [txtRunner, txtGame, txtCategory, txtEstimate, txtConsole];
var runArray = [];

var userinput = "";
var slug = "";
let schedulejson;
var currentRun = 0;

const getJSON = async url => {
  try {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
      throw new Error(response.statusText);
    const data = await response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
  } catch (error) {
    return error;
  }
}

slug = readline.question('Please post the oengus slug for the marathon: ');
apiCall(slug);
setTimeout(function() {
  initFiles();
  while (true) {
    userinput = readline.question('Current run number: ' + currentRun + '\nClick n for next ');
    if (userinput == 'n') {
      console.log("Switching to next run")
      writeToFiles(currentRun);
      currentRun++;
    }
  }
}, 3000);

function writeToFiles(j) {
  putData(j);
  for (var i = 0; i < txtArray.length; i++) {
    console.log(txtArray[i] + ' -> ' + runArray[i]);
    fs.writeFileSync(txtArray[i], runArray[i], (err) => {
      if (err) throw err;
      console.log("bla");
    });
  }
}

function putData(j) {
  if (schedulejson.lines[j].runners.length > 0) {
    runArray[0] = schedulejson.lines[j].runners[0].username;
  } else {
    runArray[0] = '';
  }
  runArray[1] = schedulejson.lines[j].gameName;
  runArray[2] = schedulejson.lines[j].categoryName;
  runArray[3] = schedulejson.lines[j].estimate;
  runArray[4] = schedulejson.lines[j].console;
}

function apiCall(slug) { //Reads the CSV, writes data to lines. Also adds the length of the marathon to tableLength;
  console.log("Fetching schedule data from " + slug);
  getJSON("https://oengus.io/api/marathon/" + slug + "/schedule").then(data => {
    schedulejson = data;
  }).catch(error => {
    console.error(error);
  });
}

function initFiles() {
  if (!fs.existsSync('./' + folderName)) {
    fs.mkdirSync(folderName);
    console.log('Created Folder!')
  }
  try {
    if (fs.existsSync(txtCategory)) {
      console.log("No files are created, files already exist.")
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
