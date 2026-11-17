/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class Debug  {

  /**
   * @param a
   */
  static log(a) {
    for(var i = 0; i < arguments.length; i++ )
    {
      console.log(arguments[i]);
    }
  }

  static startGroup(groupName = null) {
    console.groupCollapsed(groupName)
  }

  static stopGroup() {
    console.groupEnd();
  }
}