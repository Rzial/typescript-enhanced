/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

/**
 * This method looks for the 'tsc.js' file at the typescript package and tries to find the line that executes the
 * compiler substituting it for an 'module.exports' so we can inject more features on 'tsc.js' in a external way.
 *
 * @param {string} content
 * @param {string} path
 * @return {string}
 */
module.exports = function(content, path) {
    if (path.endsWith('typescript/lib/tsc.js')) {
        return content.replace(/^.*ts\.sys\.args.*$/mg, 'module.exports = ts;');
    }

    return content;
};
