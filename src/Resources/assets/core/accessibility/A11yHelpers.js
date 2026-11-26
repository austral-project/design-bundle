/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class A11yHelpers {
  static getEnabledElementsSelector() {
    return [
      'a[href]',
      'link[href]',
      'button',
      'textarea',
      'input:not([type="hidden"])',
      'select',
      'object',
      'area'
    ].map(selector => selector + ':not([disabled])');
  }

  static getProtectedElementsSelector() {
    return ['i', 'sup', 'svg', 'hr'];
  }

  static isDisplayed(element) {
    if (!element) return false;
    return window.getComputedStyle(element).display !== "none";
  }

  static getIndex (node) {
    let parent=node.parentElement||node.parentNode, i=-1, child;
    while (parent && (child=parent.childNodes[++i])) if (child===node) return i;
    return -1;
  }

  static getPath (node) {
    let parent, path = [], index = A11yHelpers.getIndex(node);
    (parent=node.parentElement||node.parentNode) && (path=A11yHelpers.getPath(parent));
    index > -1 && path.push(index);
    return path;
  }

  static getNode (path) {
    let node=document.documentElement, i=0, index;
    while ((index=path[++i]) > -1) node= node ? node.childNodes[index] : null;
    return node;
  }
}
