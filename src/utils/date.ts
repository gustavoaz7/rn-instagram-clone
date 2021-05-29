import { pluralizeWithS } from './string';

const MINUTE_IN_SEC = 60;
const HOUR_IN_SEC = 60 * MINUTE_IN_SEC;
const DAY_IN_SEC = 24 * HOUR_IN_SEC;
const WEEK_IN_SEC = 7 * DAY_IN_SEC;

export const dateToString = (date: Date, short = false): string => {
  const diff = Math.round((Date.now() - date.getTime()) / 1000);

  if (diff < MINUTE_IN_SEC) {
    return short ? `${diff} s` : 'Just now';
  }

  if (diff < HOUR_IN_SEC) {
    const minutes = Math.floor(diff / MINUTE_IN_SEC);
    return `${minutes} ${
      short ? `m` : `${pluralizeWithS('minute', minutes)} ago`
    }`;
  }

  if (diff < DAY_IN_SEC) {
    const hours = Math.floor(diff / HOUR_IN_SEC);
    return `${hours} ${short ? `h` : `${pluralizeWithS('hour', hours)} ago`}`;
  }

  if (diff < DAY_IN_SEC * 30) {
    const days = Math.floor(diff / DAY_IN_SEC);
    return `${days} ${short ? `d` : `${pluralizeWithS('day', days)} ago`}`;
  }

  if (short) {
    const weeks = Math.floor(diff / WEEK_IN_SEC);
    return `${weeks} w`;
  }

  return date.toDateString();
};
