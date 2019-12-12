import moment from 'moment';
import htmlToText from 'html-to-text';
import { FindManyOptions } from 'typeorm';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

type IFormatArgs = FindManyOptions & ItemsArgs;

const formatArgs = <T>(args: T & IFormatArgs): T & IFormatArgs => {
  if (!args) {
    throw Error('missing format args');
  }

  const nextArgs = {
    ...args,
  };

  if (args.pageSize) {
    nextArgs.take = args.pageSize;
  }

  if (args.pageSize && args.page && args.page > 0) {
    const queryPage = args.page - 1 > 0 ? args.page - 1 : 0;

    nextArgs.skip = queryPage * args.pageSize;
  }

  if (args.orderBy) {
    nextArgs.order = { [args.orderBy]: 'ASC' };
  }

  if (args.orderBy && args.orderSort) {
    const isDesc = args.orderSort.toUpperCase() === 'DESC';

    nextArgs.order = { [args.orderBy]: isDesc ? 'DESC' : 'ASC' };
  }

  return nextArgs;
};

const formatDateRangeTime = <T>(args: T, startField: string, expireField: string): T => {
  if (!args) {
    throw Error('missing format args');
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

const formatHtmlToText = (content?: string, title?: string): string => {
  const resultTitle = `${title || ''}\n\n`;
  let resultText = '';

  if (content) {
    // @see https://github.com/werk85/node-html-to-text
    resultText = htmlToText.fromString(content, { wordwrap: false, ignoreHref: true });
  }

  return resultTitle + resultText;
};

const formatFormInitialData = (
  form: any,
  item: any,
  param: { timeFields?: string[] } = { timeFields: undefined },
): any => {
  form.setFieldsValue(item);

  const times = [{ name: 'released_at', value: moment(item.released_at) }];

  // field type or date
  form.setFields(times);
};

export const formatUtil = {
  formatArgs,
  formatDateRangeTime,
  formatHtmlToText,
  formatFormInitialData,
};
