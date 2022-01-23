import { DateTime } from 'neo4j-driver';

export const parseDate = (neo4jDateTime: DateTime<number>): Date => {
  const { year, month, day, hour, minute, second, nanosecond } = neo4jDateTime;
  const date = new Date(
    year,
    month - 1, // neo4j dates start at 1, js dates start at 0
    day,
    hour,
    minute,
    second,
    nanosecond / 1000000, // js dates use milliseconds
  );

  return date;
};
