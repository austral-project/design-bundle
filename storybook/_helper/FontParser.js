/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as data from './../../../../../assets/export/fonts.json';
import abstractParser from "./abstract/abstractParser";

/**
 * The `FontParser` class extends the functionality of the `abstractParser` class and provides
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
export class FontParser extends abstractParser {

  static gets = (category = "all", withNull = false, exclude = []) => {
    return super.gets(data, category, withNull, exclude);
  }

  static getsKey = (withNull = false) => {
    return super.getsKey(data, withNull);
  }

}