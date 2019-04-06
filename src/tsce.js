/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
require('./tsce-injector');

// Require the injected version of the module
const ts = require('typescript/lib/tsc');

module.exports = ts;
