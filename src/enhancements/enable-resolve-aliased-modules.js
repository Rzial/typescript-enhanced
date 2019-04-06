/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
/**
 * Enables the "resolveAliasedModules" property on the tsconfig.json. It requires the version 2.3.0 of the typescript
 * package because before that version, the emit method of the programs didn't handle them.
 *
 * @param ts
 */
module.exports = function (ts) {
    // Creates a message for the tsce --init command
    ts.Diagnostics.Resolve_Aliased_Modules_Description = ts.diag(100001,
        ts.DiagnosticCategory.Message, "Resolve_Aliased_Modules_Description_100001",
        "Re-maps in the emited output all the module resolution configured in 'path'.");

    // Adds an option to tsconfig.json to enable this enhacement
    ts.optionDeclarations = ts.optionDeclarations.concat([
        {
            name: "resolveAliasedModules",
            type: "boolean",
            isTSConfigOnly: true,
            category: ts.Diagnostics.Enhancement_Options,
            description: ts.Diagnostics.Resolve_Aliased_Modules_Description
        }
    ]);

    // Hook on createProgram
    const createProgram = ts.createProgram;
    ts.createProgram = function (...args) {
        const program = createProgram.apply(this, args);
        const emit = program.emit;

        const {resolveAliasedModules = false} = program.getCompilerOptions();

        if (resolveAliasedModules) {
            // Hook on emit
            program.emit = function (...args) {
                const [,,,, transformers] = args;

                const resolveAliasedModulesTransformer =
                    require('../transformers/resolve-aliased-modules-transformer.js');

                // Adds the transformer as the last trasformer executed before
                args[4] = {
                    before: transformers && Array.isArray(transformers.before)
                        ? [
                            ...transformers.before,
                            resolveAliasedModulesTransformer
                        ]
                        : [resolveAliasedModulesTransformer]
                };

                return emit.apply(this, args);
            };
        }

        return program;
    };
};
