export async function apiHandler(url = '') {
  // regexp to match a valid url
  const re =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const urlMatch = new RegExp(re);

  // lowercase url for consistency
  url = url.toLowerCase();

  if (url.match(urlMatch) !== null) {
    // valid url

    // if url is http replace with https
    if (url.indexOf('http') === 0 && url.indexOf('https') !== 0) {
      url = url.replace('http', 'https');
    }

    if (url.includes('oengus')) {
      // Oengus example URL: https://oengus.io/marathon/bsg2021
      // API example URL: https://oengus.io/api/marathons/bsg2021/schedule

      // if url contains api > don't modify

      const slugs = url.split('/'); // get the slugs
      const fetchUrl = `https://oengus.io/api/marathons/${slugs[4]}/schedule`;

      const data = await window.backend.fetchApi(fetchUrl);

      console.log(data);
      console.log(typeof data);

      return JSON.parse(data);
    }

    if (url.includes('horaro')) {
      // HORARO example URL: https://horaro.org/uksg/uksgwin21
      // API example URL: https://horaro.org/-/api/v1/events/uksg/schedules/uksgwin21

      const slugs = url.split('/');
      const fetchUrl = `https://horaro.org/-/api/v1/events/${slugs[2]}/schedules/${slugs[3]}`;

      const data = await window.backend.fetchApi(fetchUrl);

      console.log(data);

      return JSON.parse(data);
    }
  } else {
    // non valid url
    // try url as a slug for horao
  }

  // do regex stuff to url
  // see if Oengus url
  // see if Horaro  url
  // upgrade http to https
  // add https if needed (check for /)
  // default (slug) to oengus > could also try to fetch both and see what happens
  // feedback: please enter a valid url or slug
}
