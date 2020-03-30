/**
 * This file is part of the typescript-enhanced package.
 *
 * (c) Pedro Pérez Furio <rzial.p@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

const ts = require('typescript/lib/tsc');
const {relative, dirname} = require('path');

/**
 * Custom transformer that modifies the module specifier making it emit the resolved module instead the aliased one.
 *
 * @param {TransformationContext} context
 * @return {function(*): *}
 */
module.exports = function(context) {
    return ts.chainBundle(transformSourceFile);

    /**
     *
     * @param {SourceFile} sourceFile
     * @return {SourceFile}
     */
    function transformSourceFile(sourceFile) {
        if (sourceFile === null) {
            return sourceFile;
        }

        const {resolvedModules} = sourceFile;

        return ts.visitEachChild(sourceFile, childVisitor, context);

        /**
         *
         * @param {Node} node
         * @return {*|undefined}
         */
        function childVisitor(node) {
            return ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
                ? moduleDeclarationVisitor(node)
                : ts.visitEachChild(node, childVisitor, context);
        }

        /**
         *
         * @param {Node} node
         * @return {ImportDeclaration | ExportDeclaration}
         */
        function moduleDeclarationVisitor(node) {
            if (node.moduleSpecifier) {
                const moduleName = node.moduleSpecifier.text;
                const moduleDefinition = resolvedModules.get(moduleName);

                if (moduleDefinition && isAliasedImport(moduleName, moduleDefinition)) {
                    const modulePath = moduleDefinition.resolvedFileName;
                    const moduleRelativePath = ('./' + relative(dirname(sourceFile.fileName), modulePath))
                        .replace(new RegExp('\\' + moduleDefinition.extension + '$'), '');

                    const replacedNode = ts.getMutableClone(node);
                    replacedNode.moduleSpecifier = ts.createStringLiteral(moduleRelativePath);

                    return replacedNode;
                }
            }

            return node;
        }

        /**
         *
         * @param {string} moduleName
         * @param {ResolvedModule} moduleDefinition
         * @return {boolean}
         */
        function isAliasedImport(moduleName, {isExternalLibraryImport}) {
            return moduleName && !(isExternalLibraryImport
                    // Absolute import
                    || moduleName.startsWith('/')
                    // Relative import
                    || moduleName.startsWith('./')
                    || moduleName.startsWith('../'));
        }
    }
};
