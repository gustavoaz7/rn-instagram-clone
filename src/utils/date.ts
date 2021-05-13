const MINUTE_IN_SEC = 60;
const HOUR_IN_SEC = 60 * MINUTE_IN_SEC;
const DAY_IN_SEC = 24 * HOUR_IN_SEC;

export const dateToString = (date: Date): string => {
  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < MINUTE_IN_SEC) return 'Just now';

  if (diff < HOUR_IN_SEC) {
    const minutes = Math.floor(diff / MINUTE_IN_SEC);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (diff < DAY_IN_SEC) {
    const hours = Math.floor(diff / HOUR_IN_SEC);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (diff < DAY_IN_SEC * 30) {
    const days = Math.floor(diff / DAY_IN_SEC);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  return date.toDateString();
};
