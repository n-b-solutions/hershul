import { HDate } from '@hebcal/core';
import {
  AdapterFormats,
  AdapterUnits,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
  PickersTimezone,
} from '@mui/x-date-pickers';
import { buildWarning } from '@mui/x-date-pickers/internals';
import defaultDayjs, { QUnitType } from 'dayjs';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import { formatJewishDateInHebrew, toHebrewJewishDate, toJewishDate } from 'jewish-date';

defaultDayjs.extend(customParseFormatPlugin);
defaultDayjs.extend(localizedFormatPlugin);
defaultDayjs.extend(isBetweenPlugin);
defaultDayjs.extend(weekOfYearPlugin);
defaultDayjs.extend(advancedFormatPlugin);
defaultDayjs.extend(utcPlugin);
defaultDayjs.extend(timezonePlugin);

export const WEEK_DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

interface Opts {
  locale?: string;
  /** Make sure that your dayjs instance extends customParseFormat and advancedFormat */
  instance?: typeof defaultDayjs;
  formats?: Partial<AdapterFormats>;
}

type Dayjs = defaultDayjs.Dayjs;
type Constructor<TDate extends Dayjs> = (...args: Parameters<typeof defaultDayjs>) => TDate;

const localeNotFoundWarning = buildWarning([
  'Your locale has not been found.',
  'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale',
  "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
  'fallback on English locale',
]);

const withLocale = <TDate extends Dayjs>(dayjs: any, locale?: string): Constructor<TDate> =>
  !locale ? dayjs : (...args) => dayjs(...args).locale(locale);

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  YY: { sectionType: 'year', contentType: 'digit', maxLength: 2 },
  YYYY: { sectionType: 'year', contentType: 'digit', maxLength: 4 },

  // Month
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  D: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  DD: 'day',
  Do: { sectionType: 'day', contentType: 'digit-with-letter' },

  // Day of the week
  d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
  dd: { sectionType: 'weekDay', contentType: 'letter' },
  ddd: { sectionType: 'weekDay', contentType: 'letter' },
  dddd: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  HH: 'hours',
  h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  hh: 'hours',

  // Minutes
  m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
  mm: 'minutes',

  // Seconds
  s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
  ss: 'seconds',
};

const defaultFormats: AdapterFormats = {
  normalDateWithWeekday: 'ddd, MMM D',
  normalDate: 'D MMMM',
  shortDate: 'MMM D',
  monthAndDate: 'MMMM D',
  dayOfMonth: 'D',
  year: 'YYYY',
  month: 'MMMM',
  monthShort: 'MMM',
  monthAndYear: 'MMMM YYYY',
  weekday: 'dddd',
  weekdayShort: 'ddd',
  minutes: 'mm',
  hours12h: 'hh',
  hours24h: 'HH',
  seconds: 'ss',
  fullTime: 'LT',
  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',
  fullDate: 'll',
  fullDateWithWeekday: 'dddd, LL',
  fullDateTime: 'lll',
  fullDateTime12h: 'll hh:mm A',
  fullDateTime24h: 'll HH:mm',
  keyboardDate: 'L',
  keyboardDateTime: 'L LT',
  keyboardDateTime12h: 'L hh:mm A',
  keyboardDateTime24h: 'L HH:mm',
  meridiem: 'A',
};

const MISSING_UTC_PLUGIN = [
  'Missing UTC plugin',
  'To be able to use UTC or timezones, you have to enable the `utc` plugin',
  'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-utc',
].join('\n');

const MISSING_TIMEZONE_PLUGIN = [
  'Missing timezone plugin',
  'To be able to use timezones, you have to enable both the `utc` and the `timezone` plugin',
  'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-timezone',
].join('\n');

export class AdapterHebDate<TDate extends Dayjs = Dayjs> implements MuiPickersAdapter<TDate> {
  rawDayJsInstance: typeof defaultDayjs;

  lib = 'dayjs';

  dayjs: Constructor<TDate>;

  locale?: string;

  formats: AdapterFormats;

  formatTokenMap = formatTokenMap;

  isMUIAdapter = true;

  isTimezoneCompatible = false;

  escapedCharacters = { start: "'", end: "'" };

  constructor({ locale, formats, instance }: Opts = {}) {
    this.rawDayJsInstance = instance || defaultDayjs;
    this.dayjs = withLocale(this.rawDayJsInstance, locale);
    this.locale = locale;
    this.formats = Object.assign({}, defaultFormats, formats);
  }

  public is12HourCycleInCurrentLocale = () =>
    /* istanbul ignore next */
    /A|a/.test(this.rawDayJsInstance.Ls[this.locale || 'en']?.formats?.LT!);

  public getCurrentLocaleCode = () => this.locale || 'en';

  public getFormatHelperText = (format: string) => {
    // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
    var localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?)|./g;
    return format
      .match(localFormattingTokens)!
      .map((token) => {
        var firstCharacter = token[0];
        if (firstCharacter === 'L') {
          /* istanbul ignore next */
          return (
            this.rawDayJsInstance.Ls[this.locale || 'en']?.formats[
              token as keyof Partial<{
                LT: string;
                LTS: string;
                L: string;
                LL: string;
                LLL: string;
                LLLL: string;
              }>
            ] ?? token
          );
        }
        return token;
      })
      .join('')
      .replace(/a/gi, '(a|p)m')
      .toLocaleLowerCase();
  };

  public parseISO = (isoString: string) => this.dayjs(isoString);

  public toISO = (value: Dayjs) => value.toString();

  public parse = (value: any, format: string) => {
    if (value === '') {
      return null;
    }

    return this.dayjs(value, format, this.locale, true);
  };

  public date = (value?: any) => {
    if (value === null) {
      return null;
    }

    return this.dayjs(value);
  };

  public toJsDate = (value: Dayjs) => value.toDate();

  public isValid = (value: any) => this.dayjs(value).isValid();

  public isNull = (date: Dayjs | null) => date === null;

  public getDiff = (date: TDate, comparing: TDate, units?: AdapterUnits) => date.diff(comparing, units as QUnitType);

  public isAfter = (date: TDate, value: TDate) => date.isAfter(value);

  public isBefore = (date: TDate, value: TDate) => date.isBefore(value);

  public isAfterDay = (value: TDate, comparing: Dayjs) => {
    const date = this.dayjs(value);
    if (!this.hasUTCPlugin()) {
      return date.isAfter(comparing, 'day');
    }

    return !this.isSameDay(date, comparing) && date.utc() > comparing.utc();
  };

  public isBeforeDay = (value: TDate, comparing: Dayjs) => {
    const date = this.dayjs(value);
    if (!this.hasUTCPlugin()) {
      return date.isBefore(comparing, 'day');
    }

    return !this.isSameDay(date, comparing) && date.utc() < comparing.utc();
  };

  public isBeforeYear = (date: Dayjs, value: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const JValue = new HDate(value.toDate());
    return JDate.getFullYear() < JValue.getFullYear();
  };

  public isAfterYear = (date: Dayjs, value: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const JValue = new HDate(value.toDate());
    return JDate.getFullYear() > JValue.getFullYear();
  };

  public startOfDay = (date: TDate) => date.startOf('day') as TDate;

  public endOfDay = (date: TDate) => date.endOf('day') as TDate;

  public format = (date: TDate, formatKey: keyof AdapterFormats) => {
    const jewishDate = toJewishDate(this.dayjs(date).toDate());
    const jewishDateInHebrew = toHebrewJewishDate(jewishDate);
    switch (formatKey) {
      case 'monthShort':
        return jewishDateInHebrew.monthName;
      case 'year':
        return jewishDateInHebrew.year;
      case 'weekday':
      case 'dayOfMonth':
        return jewishDateInHebrew.day;
      case 'monthAndYear':
        return `${jewishDateInHebrew.monthName} ${jewishDateInHebrew.year}`;
      default:
        return formatJewishDateInHebrew(jewishDate);
    }
  };

  private hasUTCPlugin = () => typeof defaultDayjs.utc !== 'undefined';

  private hasTimezonePlugin = () => typeof defaultDayjs.tz !== 'undefined';

  public formatByString = (date: Dayjs, formatString: string) => this.dayjs(date).format(formatString);

  public formatNumber = (numberToFormat: string) => numberToFormat;

  public getHours = (date: Dayjs) => date.hour();

  public addSeconds = (date: TDate, count: number) =>
    count < 0 ? (date.subtract(Math.abs(count), 'second') as TDate) : (date.add(count, 'second') as TDate);

  public addMinutes = (date: Dayjs, count: number) =>
    count < 0 ? (date.subtract(Math.abs(count), 'minute') as TDate) : (date.add(count, 'minute') as TDate);

  public addHours = (date: Dayjs, count: number) =>
    count < 0 ? (date.subtract(Math.abs(count), 'hour') as TDate) : (date.add(count, 'hour') as TDate);

  public addDays = (date: Dayjs, count: number) => {
    const JDate = new HDate(date.toDate());
    const JDateAfterAdd = count < 0 ? JDate.subtract(Math.abs(count), 'day') : JDate.add(count, 'day');
    return this.dayjs(JDateAfterAdd.greg());
  };

  public addWeeks = (date: Dayjs, count: number) => {
    const JDate = new HDate(date.toDate());
    const JDateAfterAdd = count < 0 ? JDate.subtract(Math.abs(count), 'week') : JDate.add(count, 'week');
    return this.dayjs(JDateAfterAdd.greg());
  };

  public addMonths = (date: Dayjs, count: number) => {
    const JDate = new HDate(date.toDate());
    const JDateAfterAdd = count < 0 ? JDate.subtract(Math.abs(count), 'month') : JDate.add(count, 'month');
    return this.dayjs(JDateAfterAdd.greg());
  };

  public addYears = (date: Dayjs, count: number) => {
    const JDate = new HDate(date.toDate());
    const JDateAfterAdd = count < 0 ? JDate.subtract(Math.abs(count), 'year') : JDate.add(count, 'year');
    return this.dayjs(JDateAfterAdd.greg());
  };

  public setMonth = (value: TDate, month: number) => {
    const date = this.dayjs(value);
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(JDate.getDate(), month, JDate.getFullYear());
    return this.dayjs(newJDate.greg());
  };

  public setHours = (date: Dayjs, count: number) => date.set('hour', count) as TDate;

  public getMinutes = (date: Dayjs) => date.minute();

  public setMinutes = (date: Dayjs, count: number) => date.set('minute', count) as TDate;

  public getSeconds = (date: Dayjs) => date.second();

  public setSeconds = (date: Dayjs, count: number) => date.set('second', count) as TDate;

  public getMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    return JDate.getMonth();
  };

  public getDate = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    return JDate.getDate();
  };

  public setDate = (date: Dayjs, count: number) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(count, JDate.getMonth(), JDate.getFullYear());
    return this.dayjs(newJDate.greg());
  };

  public getDaysInMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    return JDate.daysInMonth();
  };

  public isSameDay = (date: Dayjs, comparing: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const JComparing = new HDate(comparing.toDate());
    return JDate.isSameDate(JComparing);
  };

  public isSameMonth = (date: Dayjs, comparing: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const JComparing = new HDate(comparing.toDate());
    return this.isSameYear(date, comparing) && JDate.getMonth() === JComparing.getMonth();
  };

  public isSameYear = (date: Dayjs, comparing: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const JComparing = new HDate(comparing.toDate());
    return JDate.getFullYear() === JComparing.getFullYear();
  };

  public isSameHour = (date: Dayjs, comparing: Dayjs) => date.isSame(comparing, 'hour');

  public getMeridiemText = (ampm: 'am' | 'pm') => (ampm === 'am' ? 'AM' : 'PM');

  public startOfYear = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(1, 7, JDate.getFullYear());
    return this.dayjs(newJDate.greg());
  };

  public endOfYear = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(29, 6, JDate.getFullYear());
    return this.dayjs(newJDate.greg());
  };

  public startOfMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(1, JDate.getMonth(), JDate.getFullYear());
    return this.dayjs(newJDate.greg()) as TDate;
  };

  public endOfMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(JDate.daysInMonth(), JDate.getMonth(), JDate.getFullYear());
    return this.dayjs(newJDate.greg()) as TDate;
  };

  public startOfWeek = (date: Dayjs) => date.startOf('week') as TDate;

  public endOfWeek = (date: Dayjs) => date.endOf('week') as TDate;

  public getNextMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = JDate.add(1, 'month');
    return this.dayjs(newJDate.greg());
  };

  public getPreviousMonth = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    const newJDate = JDate.subtract(1, 'month');
    return this.dayjs(newJDate.greg());
  };

  public getMonthArray = (date: Dayjs) => {
    const firstMonth = this.startOfYear(date);
    const monthArray = [firstMonth];

    const JDate = new HDate(date.toDate());
    const monthsInYear = HDate.monthsInYear(JDate.getFullYear());

    while (monthArray.length < monthsInYear) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public getYear = (date: Dayjs) => {
    const JDate = new HDate(date.toDate());
    return JDate.getFullYear();
  };

  public setYear = (date: Dayjs, year: number) => {
    const JDate = new HDate(date.toDate());
    const newJDate = new HDate(JDate.getDate(), JDate.getMonth(), year);
    return this.dayjs(newJDate.greg());
  };

  public mergeDateAndTime = (date: TDate, time: TDate) =>
    date.hour(time.hour()).minute(time.minute()).second(time.second()) as TDate;

  public getWeekdays = () => WEEK_DAYS;

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
    }

    return this.dayjs(value).isSame(comparing);
  };

  public getWeekArray = (date: TDate) => {
    const start = this.startOfMonth(date).startOf('week');
    const end = this.endOfMonth(date).endOf('week');

    let count = 0;
    let current = start;
    const nestedWeeks: TDate[][] = [];

    while (current.isBefore(end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current as TDate);

      current = current.add(1, 'day') as TDate;
      count += 1;
    }

    return nestedWeeks;
  };

  public getYearRange = (start: TDate, end: TDate) => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years: TDate[] = [];

    let current = startDate;
    while (current.isBefore(endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };

  public isWithinRange = (date: TDate, [start, end]: [TDate, TDate]) => date.isBetween(start, end, null, '[]');

  public getTimezone = (value: TDate | null): string => {
    const date = this.dayjs(value);
    if (this.hasTimezonePlugin()) {
      // @ts-ignore
      const zone = date.$x?.$timezone;

      if (zone) {
        return zone;
      }
    }

    if (this.hasUTCPlugin() && date.isUTC()) {
      return 'UTC';
    }

    return 'system';
  };

  public setTimezone = (value: TDate, timezone: PickersTimezone): TDate => {
    if (this.getTimezone(value) === timezone) {
      return value;
    }

    if (timezone === 'UTC') {
      /* istanbul ignore next */
      if (!this.hasUTCPlugin()) {
        throw new Error(MISSING_UTC_PLUGIN);
      }

      return value.utc() as TDate;
    }

    // We know that we have the UTC plugin.
    // Otherwise, the value timezone would always equal "system".
    // And it would be caught by the first "if" of this method.
    if (timezone === 'system') {
      return value.local() as TDate;
    }

    if (!this.hasTimezonePlugin()) {
      if (timezone === 'default') {
        return value as TDate;
      }

      /* istanbul ignore next */
      throw new Error(MISSING_TIMEZONE_PLUGIN);
    }

    return defaultDayjs.tz(value, this.cleanTimezone(timezone)) as TDate;
  };

  private cleanTimezone = (timezone: string) => {
    switch (timezone) {
      case 'default': {
        return undefined;
      }
      case 'system': {
        return defaultDayjs.tz.guess();
      }
      default: {
        return timezone;
      }
    }
  };

  private createTZDate = (value: string | undefined, timezone: PickersTimezone): Dayjs => {
    /* istanbul ignore next */
    if (!this.hasUTCPlugin()) {
      throw new Error(MISSING_UTC_PLUGIN);
    }

    /* istanbul ignore next */
    if (!this.hasTimezonePlugin()) {
      throw new Error(MISSING_TIMEZONE_PLUGIN);
    }

    const keepLocalTime = value !== undefined && !value.endsWith('Z');
    return defaultDayjs(value).tz(this.cleanTimezone(timezone), keepLocalTime);
  };

  dateWithTimezone<T extends string | null | undefined>(value: T, timezone: string): DateBuilderReturnType<T, TDate> {
    return this.createTZDate(value ?? undefined, timezone) as DateBuilderReturnType<T, TDate>;
  }

  private adjustOffset = (value: Dayjs) => {
    if (!this.hasTimezonePlugin()) {
      return value;
    }

    const timezone = this.getTimezone(value as TDate);
    if (timezone !== 'UTC') {
      const fixedValue = value.tz(this.cleanTimezone(timezone), true);
      // @ts-ignore
      if ((fixedValue.$offset ?? 0) === (value.$offset ?? 0)) {
        return value;
      }

      return fixedValue;
    }

    return value;
  };

  private getLocaleFormats = () => {
    const locales = defaultDayjs.Ls;
    const locale = this.locale || 'en';

    let localeObject = locales[locale];

    if (localeObject === undefined) {
      localeNotFoundWarning();
      localeObject = locales.en;
    }

    return localeObject.formats;
  };

  expandFormat = (format: string) => {
    const localeFormats = this.getLocaleFormats();

    // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
    const t = (formatBis: string) =>
      formatBis.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_: string, a: string, b: string) => a || b.slice(1));

    return format.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_: string, a: string, b: string) => {
      const B = b && b.toUpperCase();
      return (
        a ||
        localeFormats[b as keyof typeof localeFormats] ||
        t(localeFormats[B as keyof typeof localeFormats] as string)
      );
    });
  };

  getMilliseconds(value: TDate): number {
    return value.millisecond();
  }

  setMilliseconds(value: TDate, milliseconds: number): TDate {
    return this.adjustOffset(value.set('millisecond', milliseconds)) as TDate;
  }

  getWeekNumber(value: TDate): number {
    return value.week();
  }
}
