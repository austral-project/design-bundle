/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

export const getNewPosition = (position, offset, arr) => {
  const realOffset = Math.abs(offset) % arr.length;
  return (position - realOffset >= 0) ? position - realOffset : arr.length - (realOffset - position);
};

export const formatNumber = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatMoney = (amount, decimals = 2, decimalSep = ",", thousandSep = " ") => {
  const sign = amount < 0 ? "-" : "";
  const absAmount = Math.abs(+amount || 0);
  const intPart = Math.floor(absAmount).toString();
  const decPart = absAmount.toFixed(decimals).slice(-decimals);

  const offset = intPart.length % 3;
  const thousands = intPart
    .slice(offset)
    .replace(/(\d{3})(?=\d)/g, `$1${thousandSep}`);

  const formatted = offset
    ? intPart.slice(0, offset) + thousandSep + thousands
    : thousands;

  return sign + formatted + (decimals ? decimalSep + decPart : "");
};
