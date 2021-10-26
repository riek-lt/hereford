export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
}

// convert iso 8601 curation to object
export function convertISO8601duration(isoString = '') {
  const re =
    /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  const match = isoString.match(re);

  return {
    years: match[2] ? match[2] : 0,
    months: match[3] ? match[3] : 0,
    weeks: match[4] ? match[4] : 0,
    days: match[5] ? match[5] : 0,
    hours: match[6] ? match[6] : 0,
    minutes: match[7] ? match[7] : 0,
    seconds: match[8] ? match[8] : 0,
  };
}

export function formatTime(time, format) {
  // TODO make something that ensures the format is valid and otherwhise default to something
  const order = format.split(':');

  let outputArr = [];
  order.forEach((el) => {
    if (el.charAt(0) == 'h') {
      outputArr.push(`${time.hours.toString().padStart(el.length, '0')}`);
    } else if (el.charAt(0) == 'm') {
      outputArr.push(`${time.minutes.toString().padStart(el.length, '0')}`);
    } else if (el.charAt(0) == 's') {
      outputArr.push(`${time.seconds.toString().padStart(el.length, '0')}`);
    }
  });

  return outputArr.join(':');
}
