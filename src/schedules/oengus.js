const fetch = require("node-fetch");
var schedulejson;


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

module.exports = {
    apiCall: function (slug) {
        console.log("Fetching schedule data from " + slug);
        getJSON("https://oengus.io/api/marathon/" + slug + "/schedule").then(data => {
          schedulejson = data;
          module.exports.schedule = schedulejson;
        }).catch(error => {
          console.error(error);
        });
      }
};
