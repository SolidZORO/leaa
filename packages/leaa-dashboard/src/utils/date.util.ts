import moment from 'moment';

export const formatDateTimeToDayStartOrEnd = (type: 'start' | 'end', dateTime: string | moment.Moment): Date => {
  const error = new Error('Type or Date-Time Error');
  if (!type || !dateTime) throw error;

  if (type === 'start') {
    return moment(dateTime).startOf('day').toDate();
  }

  if (type === 'end') {
    return moment(dateTime).startOf('day').add(23, 'hour').add(59, 'minute').add(59, 'second').toDate();
  }

  throw error;
};

export const formatDateRangeTime = (startField: string, expireField: string): { start: Date; end: Date } => ({
  start: formatDateTimeToDayStartOrEnd('start', startField),
  end: formatDateTimeToDayStartOrEnd('end', expireField),
});
