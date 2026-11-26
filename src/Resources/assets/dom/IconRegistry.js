/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class IconRegistry {

  constructor() {
    this.icons = new Map();
    this.isLoading = false;
  }

  async loadFromJson(url) {
    if (this.isLoading) return;

    try {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Failed to load icons JSON: ${response.status}`);
      const data = await response.json();
      this.registerMany(data);
      this.loaded = true;
    } catch (e) {
      console.error("[IconRegistry] Failed to load icons JSON:", e);
    }
  }

  register(name, svg) {
    this.icons[name] = svg;
  }

  registerMany(iconsObject) {
    Object.assign(this.icons, iconsObject);
  }

  get(name) {
    return this.icons[name] || null;
  }

  all() {
    return this.icons;
  }

}
export default new IconRegistry();
