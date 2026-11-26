/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Entry point of the administration: the design system, then the admin components.
export * from './index';

import * as admin from './components/admin';
admin.adminPage.listen();

export {
  admin
};
