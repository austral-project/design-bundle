/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class abstractHook {

  static _hooks = new Map();

  /**
   * Register a hook callback
   */
  static register(name, callback) {
    if (!this._hooks.has(name)) {
      this._hooks.set(name, []);
    }

    if (typeof callback === 'function') {
      this._hooks.get(name).push(callback);
    }
  }

  /**
   * Run all hooks for a given name
   *
   * @param {string} name
   * @param {Object} payload
   * @returns {Promise<Object|false>}
   */
  static async run(name, payload = {}) {
    if (!this._hooks.has(name)) {
      return payload;
    }

    const hooks = this._hooks.get(name);
    let context = { ...payload };

    for (const hook of hooks) {
      const result = await hook(context);

      if (result === false) {
        return false;
      }

      if (result && typeof result === 'object') {
        context = {
          ...context,
          ...result,
        };
      }
    }

    return context;
  }

  /**
   * Optional: clear hooks (tests / hot reload)
   */
  static clear(name = null) {
    if (name) {
      this._hooks.delete(name);
    } else {
      this._hooks.clear();
    }
  }
}
