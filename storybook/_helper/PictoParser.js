/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as data from './../../../../../assets/export/picto.json';

/**
 * PictoParser is a utility class designed for parsing and retrieving
 * data relating to pictograms based on their categories.
 *
 * Static Methods:
 * - `gets`: Retrieves font data based on the specified category, null inclusion, and exclusions.
 * - `getsKey`: Retrieves font keys, optionally including null values.
 */
export class PictoParser {

  /**
   * Retrieves an array of items filtered by category and optionally includes a null value.
   *
   * @param {string} [category="all"] - The category to filter items by. Defaults to "all" which includes items from all categories.
   * @param {boolean} [withNull=false] - Whether to include a null value in the returned array. Defaults to false.
   * @returns {Array} An array of items filtered by the specified category, optionally including a null value.
   */
  static gets = (category = "all", withNull = false) => {
    var pictosArray = [];
    if(withNull)
    {
      pictosArray.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      if(value.category === category || category === "all")
      {
        pictosArray.push(value);
      }
    })
    return pictosArray
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
  static getsKey = (category = "all", withNull = false) => {
    var pictosArray = [];
    if(withNull)
    {
      pictosArray.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      if(value.category === category || category === "all")
      {
        pictosArray.push(key)
      }
    })
    return pictosArray
  };

}