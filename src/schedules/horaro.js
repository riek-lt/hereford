const fetch = require("node-fetch");
var schedulejson;
var slug1, slug2;
var slugA = [];


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

//API example URL: https://horaro.org/-/api/v1/events/bsgmarathon/schedules/bsgo3
//HORARO example url https://horaro.org/uksg/uksgwin21
module.exports = {
  apiCall: function(slug) {
    console.log("Fetching schedule data from " + slug);
    if (slug.includes('http')) {
      urlCut(slug);
    }
    getJSON("https://horaro.org/-/api/v1/events/" + slugA[1] + "/schedules/" + slugA[2]).then(data => {
      schedulejson = data;
      module.exports.schedule = schedulejson;
    }).catch(error => {
      console.error(error);
    });
  }
};

function urlCut(slug) {
  str = slug.substring(10)
slugA = str.split("/");
}
