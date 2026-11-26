/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const isValidDate = (date) =>
  date instanceof Date && !Number.isNaN(date.getTime());

export const getDaysOfMonth = (year, month) => {
  const result = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return result;
};

export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1);

export const getLastDayOfMonth = (year, month) =>
  new Date(year, month + 1, 0);

export const getMonths = (locale, format = "long") =>
  Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString(locale, { month: format })
  );

export const getWeekdays = (locale, format = "long") =>
  Array.from({ length: 7 }, (_, i) =>
    new Date(2000, 0, i + 3).toLocaleDateString(locale, { weekday: format })
  );
// +3 pour stabiliser sur semaine ISO (évite problèmes fuseaux)

export const getDayOfWeekIndex = (date) => {
  const day = date.getDay();
  return day === 0 ? 7 : day; // ISO 1-7
};

export const dateFromDatetime = (datetime) =>
  new Date(
    datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate()
  );

export const formatDateShort = (date, locale) =>
  date.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const formatDateLong = (date, locale) =>
  date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatToISO = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];
};

export const padDatePart = (date, type = "day") => {
  switch (type) {
    case "day":
      return String(date.getDate()).padStart(2, "0");
    case "month":
      return String(date.getMonth() + 1).padStart(2, "0");
    case "year":
      return date.getFullYear();
    default:
      return null;
  }
};

export const parseDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "string") {
    if (value.toLowerCase() === "now") {
      return new Date();
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const reelValue = (date, type = "day") => {
  if(type === "day")
    return date.getDate() > 9 ? date.getDate() : "0"+date.getDate();
  if(type === "month")
    return (date.getMonth()+1) > 9 ? (date.getMonth()+1) : "0"+(date.getMonth()+1);
  if(type === "year")
    return date.getFullYear();
};

export const datePatternFromLocale = (locale) => {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(
    new Date(2000, 11, 31)
  );

  return parts
    .map((p) => {
      if (p.type === "day") return "dd";
      if (p.type === "month") return "MM";
      if (p.type === "year") return "yyyy";
      return p.value;
    })
    .join("");
};

export const isValidTime = (time) => {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return regex.test(time);
};

export const timeToString = (hour = null, minute = null, second = null) => {
  let hourFinal = hour !== null ? hour.toString().padStart(2, "0") : "00";
  let minuteFinal = minute !== null ? minute.toString().padStart(2, "0") : "00";
  let secondFinal = second !== null ? second.toString().padStart(2, "0") : "00";
  return `${hourFinal}:${minuteFinal}:${secondFinal}`;
};
