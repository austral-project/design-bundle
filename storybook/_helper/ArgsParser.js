/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * A utility class for parsing and transforming arguments.
 */
export class ArgsParser {

  /**
   * Flattens a nested object into a single-level object. If a property in the object is an
   * object itself, its keys are prefixed with the parent key followed by a dot (.) and added
   * to the flattened result. Only string, boolean, and number values are directly added without flattening.
   *
   * @param {Object} args - The object to be flattened. Can contain nested objects as values.
   * @returns {Object} - A new object with all keys at the top level, where nested object keys
   *                     are concatenated with their parent keys using a dot notation.
   */
  static flat = (args) => {
    const parsedArgs = {};
    for (const [key, value] of Object.entries(args)) {
      if (['string', 'boolean', 'number'].includes(typeof value)) {
        parsedArgs[key] = value;
      } else {
        for (const innerKey in value) parsedArgs[`${key}.${innerKey}`] = value[innerKey];
      }
    }
    return parsedArgs;
  };

  /**
   * Expands a nested object structure from a flattened key-value representation.
   *
   * @param {Object} args - An object where keys may include dot notation to represent nested properties.
   * @return {Object} A reconstructed object with nested structures derived from the dot-notated keys of the input.
   */
  static expand(args) {
    const parsedArgs = {};
    for (const [key, value] of Object.entries(args)) {
      const parsedKeys = key.split('.');
      if (parsedKeys.length === 1) {
        parsedArgs[key] = value;
      } else {
        const [parentKey, prop] = parsedKeys;
        parsedArgs[parentKey] = parsedArgs[parentKey] ?? {};
        parsedArgs[parentKey][prop] = value[prop];
      }
    }
    return parsedArgs;
  }
}