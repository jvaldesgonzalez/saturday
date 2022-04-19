import { DateTime } from 'neo4j-driver-core';

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

export const makeDate = (jsDate: Date): DateTime<number> => {
  return new DateTime(
    jsDate.getFullYear(),
    jsDate.getMonth() + 1,
    jsDate.getDate(),
    jsDate.getHours(),
    jsDate.getMinutes(),
    jsDate.getSeconds(),
    jsDate.getMilliseconds() * 1000000,
    jsDate.getTimezoneOffset(),
  );
};
