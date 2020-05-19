import moment from 'moment';

export function formatDateTimeToDayStartOrEnd(type: 'start' | 'end', dateTime: string | moment.Moment): Date {
  const error = new Error('Type or Date-Time Error');
  if (!type || !dateTime) throw error;

  if (type === 'start') {
    return moment(dateTime).startOf('day').toDate();
  }

  if (type === 'end') {
    return moment(dateTime).startOf('day').add(23, 'hour').add(59, 'minute').add(59, 'second').toDate();
  }

  throw error;
}

export function formatDateRangeTime(startField: string, expireField: string): { start: Date; end: Date } {
  return {
    start: formatDateTimeToDayStartOrEnd('start', startField),
    end: formatDateTimeToDayStartOrEnd('end', expireField),
  };
}

export function formatFieldsToMoment(item: any, { fields }: { fields: string[] }) {
  if (!fields || (fields && fields.length === 0)) return item;

  fields.forEach((field) => {
    // eslint-disable-next-line no-param-reassign
    item[field] = item[field] ? moment(item[field]) : null;
  });

  return item;
}
