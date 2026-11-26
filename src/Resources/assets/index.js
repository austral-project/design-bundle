/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// ----------------------------
// Core
// ----------------------------
export { default as Config } from './core/Config';
export { default as Loader } from './core/Loader';
export { default as LibLoader } from './core/LibLoader';
export { default as Request } from './core/Request';
export { default as Response } from './core/Response';
export { default as DomEventManager } from './core/events';
export { A11yHelpers, FocusManager, ModalFocusTrap } from './core/accessibility';

// Abstracts
export { default as abstractModule } from './core/abstract/abstractModule';
export { default as abstractHook } from './core/abstract/abstractHook';
export { default as abstractComponent } from './core/abstract/abstractComponent';
export { default as abstractField } from './core/abstract/abstractField';

export { Hook, RequestHook, ResponseHook, ComponentHook } from './core/hooks';


// ----------------------------
// Debug
// ----------------------------
export { default as Debug } from './debug/Debug';

// ----------------------------
// Dom
// ----------------------------
export { default as Button } from './dom/Button';
export { default as Input } from './dom/Input';
export { default as ElementHtml } from './dom/ElementHtml';
export { default as IconRegistry } from './dom/IconRegistry';

//
// ----------------------------
// Utils
// ----------------------------
import * as utils from './utils';
export {
  // Dom
  // Utils
  utils
}

import * as modules from './modules';
import * as components from './components';
//
// ----------------------------
// Export
// ----------------------------
export {
  // Modules
  modules,

  // Components
  components,
};
