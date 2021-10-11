import { currentDeck } from '../store';

export async function apiHandler(url = '') {
  // regexp to match a valid url
  const re =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const urlMatch = new RegExp(re);

  // lowercase url for consistency
  url = url.toLowerCase();

  if (url.match(urlMatch) !== null) {
    // valid url

    // upgrade url from http to https
    if (url.indexOf('http') === 0 && url.indexOf('https') !== 0) {
      url = url.replace('http', 'https');
    }

    if (url.includes('oengus')) {
      // Oengus example URL: https://oengus.io/marathon/bsg2021
      // API example URL: https://oengus.io/api/marathons/bsg2021/schedule

      let fetchUrl = url;
      // if url doesn't contain api > modify to api url
      if (!url.includes('/api/')) {
        const slugs = url.split('/'); // get the slugs
        fetchUrl = `https://oengus.io/api/marathons/${slugs[4]}/schedule`;
      }

      let data = await window.backend.fetchApi(fetchUrl);
      data = JSON.parse(data);

      let tempDeck = [];
      data.lines.forEach((el) => {
        let runners = el.runners.map((el) => {
          return el.username;
        });

        tempDeck.push({
          name: runners.join(', '),
          game: el.gameName,
          category: el.categoryName,
        });
      });

      currentDeck.set(tempDeck);

      return data;
    }

    if (url.includes('horaro')) {
      // HORARO example URL: https://horaro.org/uksg/uksgwin21
      // API example URL: https://horaro.org/-/api/v1/events/uksg/schedules/uksgwin21

      let fetchUrl = url;

      if (!url.includes('/api/')) {
        const slugs = url.split('/');
        fetchUrl = `https://horaro.org/-/api/v1/events/${slugs[3]}/schedules/${slugs[4]}`;
      }

      let data = await window.backend.fetchApi(fetchUrl);
      data = JSON.parse(data);

      // lowercase column values
      const columns = data.data.columns.map((el) => el.toLowerCase());

      // get data indexes
      const runnerIndex = columns.indexOf('runner');
      const gameIndex = columns.indexOf('game');
      const categoryIndex = columns.indexOf('category');

      let tempDeck = [];
      data.data.items.forEach((el) => {
        tempDeck.push({
          name: el.data[runnerIndex],
          game: el.data[gameIndex],
          category: el.data[categoryIndex],
        });
      });

      currentDeck.set(tempDeck);

      return data;
    }
  } else {
    // non valid url
    // try url as a slug for oengus
  }

  // add https if needed (check for /)
  // default (slug) to oengus > could also try to fetch both and see what happens
  // user feedback: please enter a valid url or slug
}
