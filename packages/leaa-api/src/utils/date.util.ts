import moment from 'moment';

const formatDateRangeTime = <T>(args: T, startField: string, expireField: string): T => {
  if (!args) {
    throw Error('Missing Format Args');
  }

  const nextArgs = {
    ...args,
  };

  if (startField) {
    // @ts-ignore
    nextArgs[startField] = moment(args[startField])
      .startOf('day')
      .toDate();
  }

  if (expireField) {
    // @ts-ignore
    nextArgs[expireField] = moment(args[expireField])
      .startOf('day')
      .add(23, 'hour')
      .add(59, 'minute')
      .add(59, 'second')
      .toDate();
  }

  return nextArgs;
};

export const dateUtil = {
  formatDateRangeTime,
};
