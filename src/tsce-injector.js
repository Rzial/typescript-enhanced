/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
// Original module method class
const Module = require('module');

// Original compile method
const compile = Module.prototype._compile;

const injections = [
    require('./injections/tsc-module-export-injection')
];

// Custom _compile method
Module.prototype._compile = function (...args) {
    for (let injection of injections) {
        args[0] = injection(args[0], args[1]);
    }

    return compile.apply(this, args);
};
