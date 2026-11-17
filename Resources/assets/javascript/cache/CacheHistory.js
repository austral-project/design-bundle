/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class CacheHistory {

  constructor() {
    this.cacheHistory = sessionStorage.getItem("cacheHistory") ? JSON.parse(sessionStorage.getItem("cacheHistory")) : {};
  }

  push(dom, path) {
    this.cacheHistory[path] = {
      "dom": dom,
    };
    try {
      sessionStorage.setItem("cacheHistory", JSON.stringify(this.cacheHistory));
    }
    catch (e) {
      this.cacheHistory = {};
      sessionStorage.setItem("cacheHistory", JSON.stringify(this.cacheHistory));
      this.push(dom, path);
    }
  }

  pull(path) {
    if(this.cacheHistory[path] !== undefined)
    {
      return this.cacheHistory[path];
    }
    return false;
  }

  remove(path) {
    if(this.cacheHistory[path] !== undefined)
    {
      delete(this.cacheHistory[path]);
    }
  }
}
export const cacheHistory = new CacheHistory();