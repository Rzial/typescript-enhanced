/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
/**
 * Enables the "customTransformers" property on the tsconfig.json. It requires the version 2.3.0 of the typescript
 * package because before that version, the emit method of the programs didn't handle them.
 *
 * @param ts
 */
const {dirname, resolve} = require('path');

module.exports = function(ts) {
    // Creates a message for the tsce --init command
    ts.Diagnostics.Custom_Transformers_Description = ts.diag(100002,
        ts.DiagnosticCategory.Message, 'Custom_Transformers_Description_100002',
        'Enables the use of custom transformers during the build process.');

    // Adds an option to tsconfig.json to enable this enhacement
    ts.optionDeclarations = ts.optionDeclarations.concat([
        {
            name: 'customTransformers',
            type: 'list',
            element: {
                name: 'customTransformers',
                type: 'object',
            },
            isTSConfigOnly: true,
            category: ts.Diagnostics.Enhancement_Options,
            description: ts.Diagnostics.Custom_Transformers_Description,
        },
    ]);

    // Hook on createProgram
    const createProgram = ts.createProgram;
    ts.createProgram = function(...args) {
        const program = createProgram.apply(this, args);
        const emit = program.emit;

        // Hook on emit
        program.emit = function(...args) {
            const [,,,, transformers] = args;
            const customTransformers = getCustomTransformers(program);

            // Add the transformers
            args[4] = {
                before: transformers && Array.isArray(transformers.before)
                    ? [
                        ...customTransformers.before,
                        ...transformers.before,
                    ]
                    : customTransformers.before,
                after: transformers && Array.isArray(transformers.after)
                    ? [
                        ...transformers.after,
                        ...customTransformers.after,
                    ]
                    : customTransformers.after,
            };

            return emit.apply(this, args);
        };

        return program;
    };

    /**
     * Load the custom transformer from a file/module and give them his options
     *
     * @param {Array | String} transformerModules
     * @return {Array}
     */
    function loadCustomTransformers(transformerModules) {
        const {options: {project}} = ts.parseCommandLine(ts.sys.args);
        const configPath = project
            ? dirname(resolve(ts.normalizePath(project)))
            : resolve(ts.normalizePath(ts.sys.getCurrentDirectory()));

        return Array.isArray(transformerModules)
            ? transformerModules
                .map(({module, options}) => {
                    // TODO: Handle errors
                    return require(module.startsWith('./') || module.startsWith('../') || module.startsWith('/')
                        ? configPath + '/' + module
                        : module)(options);
                })
            : [];
    }

    /**
     * Obtains the custom transformers from the project configuration file
     *
     * @param {*} program
     * @return {{before: Array, after: Array}}
     */
    function getCustomTransformers(program) {
        const {customTransformers = []} = program.getCompilerOptions();

        return {
            before: loadCustomTransformers(customTransformers
                .filter(({type}) => type === 'before')),

            after: loadCustomTransformers(customTransformers
                .filter(({type}) => type === 'after')),
        };
    }
};
