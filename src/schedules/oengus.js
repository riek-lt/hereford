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
    apiCall: function (slug, schedslug) {
        console.log("Fetching schedule data from " + slug + "/" + schedslug);
        getJSON("https://oengus.io/api/v2/marathons/" + slug.split("/")[4] + "/schedules/for-slug/" + slug.split("/")[6]).then(data => {
          schedulejson = data;
          module.exports.schedule = schedulejson;
        }).catch(error => {
          console.error(error);
        });
      }
};
