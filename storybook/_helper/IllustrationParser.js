/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as data from './../../../../../assets/export/illustrations.json';
import abstractParser from "./abstract/abstractParser";

/**
 * The `IllustrationParser` class extends the functionality of the `abstractParser` class and provides
 * static methods for handling font-related data operations. This parser facilitates fetching
 * font categories and keys while allowing custom filters.
 *
 * Inherits from:
 * - `abstractParser`
 *
 * Static Methods:
 * - `gets`: Retrieves font data based on the specified category, null inclusion, and exclusions.
 * - `getsKey`: Retrieves font keys, optionally including null values.
 */
export class IllustrationParser extends abstractParser {

  static gets = (withNull = false) => {
    var illustrationsArray = [];
    if(withNull)
    {
      illustrationsArray.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      illustrationsArray.push(value.url);
    })
    return illustrationsArray
  };

  /**
   * Retrieves an array of keys from the data default object based on the specified category.
   * Optionally includes a null value in the resulting array.
   *
   * @param {string} [category="all"] - The category to filter keys by. Defaults to "all" to include all categories.
   * @param {boolean} [withNull=false] - If true, the resulting array will include a null value at the beginning.
   * @returns {string[]} An array of keys from the data default object that match the specified category,
   *                     optionally including a null value as the first entry.
   */
  static getsKey = (withNull = false) => {
    var illustrationsArray = [];
    if(withNull)
    {
      illustrationsArray.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      illustrationsArray.push(key)
    })
    return illustrationsArray
  };

}