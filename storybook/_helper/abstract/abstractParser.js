/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


export default class abstractParser {

  /**
   * Retrieves values from the provided data object based on the specified category,
   * inclusion of null values, and exclusion criteria.
   *
   * @param {Object} data - The data object containing key-value pairs.
   * @param {string} [category="all"] - The category to filter keys. Defaults to "all", which includes all keys.
   * @param {boolean} [withNull=false] - Determines whether to include a null (empty string) value in the result.
   * @param {Array<string>} [exclude=[]] - An array of prefixes to filter out keys from the result.
   * @returns {Array<*>} An array of values matching the filter criteria.
   */
  static gets = (data, category = "all", withNull = false, exclude = []) => {
    let arrayValues = [];
    if(withNull)
    {
      arrayValues.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      if(key.startsWith(category) || (category === "all"))
      {
        if(exclude.length > 0)
        {
          let add = true;
          exclude.forEach(element => {
            if(key.startsWith(element))
            {
              add = false;
            }
          });
          if(add === true) {
            arrayValues.push(value);
          }
        }
        else
        {
          arrayValues.push(value);
        }
      }
    })
    return arrayValues
  };

  /**
   * Extracts the keys from the `default` property of the provided data object
   * and returns them in an array. Optionally includes a null/empty string value
   * as the first element of the array.
   *
   * @param {Object} data - The input object containing a `default` property,
   * which is expected to be an object with key-value pairs.
   * @param {boolean} [withNull=false] - Determines whether to include an empty
   * string as the first element in the resulting array.
   * @returns {Array<string>} An array of keys from the `default` object
   * of the provided data, with an optional empty string as the first element.
   */
  static getsKey = (data, withNull = false) => {
    let arrayValues = [];
    if(withNull)
    {
      arrayValues.push("");
    }
    [].forEach.call(Object.entries(data.default), ([key, value]) => {
      arrayValues.push(key)
    })
    return arrayValues
  };

}