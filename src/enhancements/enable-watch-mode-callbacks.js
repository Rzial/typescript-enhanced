/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
const { spawnSync } = require('child_process');
const { dirname, resolve } = require('path');

/**
 * Enables the "onWatchSuccess" and "onWatchFail" properties on the tsconfig.json. It requires the version 2.8.0 of
 * typescript package because before that version, the "createWatchProgram" don't exists.
 *
 * @param ts
 */
module.exports = function (ts) {
    // Creates a message for the tsce --init command
    ts.Diagnostics.On_Watch_Success_Description = ts.diag(100004,
        ts.DiagnosticCategory.Message, "On_Watch_Success_Description_100004",
        "Command that will be called on watch when the compilation process ends succesfully.");

    ts.Diagnostics.On_Watch_Fail_Description = ts.diag(100006,
        ts.DiagnosticCategory.Message, "On_Watch_Fail_Description_100006",
        "Command that will be called on watch when the compilation process fails.");

    // Adds an option to tsconfig.json to enable this enhacement
    ts.optionDeclarations = ts.optionDeclarations.concat([
        {
            name: "onWatchSuccess",
            type: "string",
            category: ts.Diagnostics.Enhancement_Options,
            description: ts.Diagnostics.On_Watch_Success_Description
        },
        {
            name: "onWatchFail",
            type: "string",
            category: ts.Diagnostics.Enhancement_Options,
            description: ts.Diagnostics.On_Watch_Fail_Description
        }
    ]);

    // Config path
    const { options: { project } } = ts.parseCommandLine(ts.sys.args);
    const configPath = dirname(resolve(ts.normalizePath(project || ts.sys.getCurrentDirectory())));

    // Hook on createProgram
    const createWatchProgram = ts.createWatchProgram;
    ts.createWatchProgram = function (...args) {
        let hadProgram = false, hadErrors = false, watchProcessed = false, compilerOptions = false;

        const [host] = args;
        const afterProgramCreate = host.afterProgramCreate;
        const onWatchStatusChange = host.onWatchStatusChange;

        host.afterProgramCreate = function (...args) {
            const [builderProgram] = args;
            const program = builderProgram.getProgramOrUndefined();

            hadProgram = !!program;
            hadErrors = program && !ts.getPreEmitDiagnostics(program).length;
            watchProcessed = false;
            compilerOptions = program.getCompilerOptions();

            return afterProgramCreate(...args);
        };

        host.onWatchStatusChange = function (...args) {
            const result = onWatchStatusChange(...args);

            if (!watchProcessed && hadProgram) {
                watchProcessed = true;

                const { onWatchSuccess, onWatchFail } = compilerOptions;

                if (onWatchSuccess && hadErrors) {
                    const [ onWatchSuccessCommand, ...onWatchSuccessArgs] = onWatchSuccess.split(' ');
                    spawnSync(onWatchSuccessCommand, onWatchSuccessArgs, { cwd: configPath, stdio: 'inherit' });
                }

                if (onWatchFail && !hadErrors) {
                    const [ onWatchFailCommand, ...onWatchFailArgs] = onWatchFail.split(' ');
                    spawnSync(onWatchFailCommand, onWatchFailArgs, { cwd: configPath, stdio: 'inherit' });
                }
            }

            return result;
        };

        return createWatchProgram(...args);
    };
};
