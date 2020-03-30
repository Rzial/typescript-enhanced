/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
/**
 * Enables the common section for enhancements in the tsconfig.json file.
 *
 * @param {*} ts
 */
module.exports = function(ts) {
    // Copied from the tsc.js source because its not exposed
    ts.diag = function(code, category, key, message, reportsUnnecessary) {
        return {code: code, category: category, key: key, message: message, reportsUnnecessary: reportsUnnecessary};
    };

    // Creates a message for the tsce --init command
    ts.Diagnostics.Enhancement_Options = ts.diag(100000,
        ts.DiagnosticCategory.Message, 'Enhancement_Options_100000', 'Enhancement Options');
};
