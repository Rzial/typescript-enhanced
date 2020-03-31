/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
const semver = require('semver');

/**
 * Injection for version >= 2.8.0 and version < 3.7.0
 * @param {String} content
 * @return {String}
 */
function injectA(content) {
    const originalStatement = 'ts.executeCommandLine(ts.sys.args);';
    const replacedStatement = 'ts.executeTSCE = function() {\n' +
        '    ' + originalStatement.replace(/\n/gm, '\n    ') + '\n' +
        '};\n' +
        '\n' +
        'module.exports = ts;';

    return content.replace(originalStatement, replacedStatement);
}

/**
 * Injection for and version >= 3.7.0 and version < 3.8.0
 * @param {String} content
 * @return {String}
 */
function injectB(content) {
    const originalStatement = 'ts.executeCommandLine(ts.sys, {\n' +
        '    onCompilerHostCreate: ts.noop,\n' +
        '    onCompilationComplete: ts.noop,\n' +
        '    onSolutionBuilderHostCreate: ts.noop,\n' +
        '    onSolutionBuildComplete: ts.noop\n' +
        '}, ts.sys.args);';

    const replacedStatement = 'ts.executeTSCE = function() {\n' +
        '    ' + originalStatement.replace(/\n/gm, '\n    ') + '\n' +
        '};\n' +
        '\n' +
        'module.exports = ts;';

    return content.replace(originalStatement, replacedStatement);
}

/**
 * Injection for version >= 3.8.0
 * @param {String} content
 * @return {String}
 */
function injectC(content) {
    const originalStatement = 'ts.executeCommandLine(ts.sys, ts.noop, ts.sys.args);';
    const replacedStatement = 'ts.executeTSCE = function() {\n' +
        '    ' + originalStatement.replace(/\n/gm, '\n    ') + '\n' +
        '};\n' +
        '\n' +
        'module.exports = ts;';

    return content.replace(originalStatement, replacedStatement);
}

/**
 * This method looks for the 'tsc.js' file at the typescript package and tries to find the line that executes the
 * cli substituting it for an 'module.exports' so we can inject more features on 'tsc.js' in a external way.
 *
 * @param {string} content
 * @param {string} path
 * @return {string}
 */
module.exports = function(content, path) {
    if (path.endsWith('typescript/lib/tsc.js')) {
        const {version} = require(path.replace('lib/tsc.js', 'package.json'));

        if (semver.satisfies(version, '>=3.8.0')) {
            return injectC(content);
        }

        if (semver.satisfies(version, '>=3.7.0 <3.8.0')) {
            return injectB(content);
        }

        if (semver.satisfies(version, '>=2.8.0 <3.7.0')) {
            return injectA(content);
        }

        throw new Error('\'tsce\' doesn\'t support this version of typescript.');
    }

    return content;
};
