const ts = require('typescript/lib/tsc');

/**
 *
 * @param {*} options
 * @returns {function(*=): *}
 */
module.exports = function (options) {
    /**
     *
     * @param {TransformationContext} context
     * @returns {function(*): *}
     */
    return function (context) {
        return ts.chainBundle(transformSourceFile);

        /**
         *
         * @param {SourceFile} sourceFile
         */
        function transformSourceFile(sourceFile) {
            if (sourceFile === null) {
                return sourceFile;
            }

            return ts.visitEachChild(sourceFile, childVisitor, context);

            /**
             *
             * @param node
             * @returns {*|undefined}
             */
            function childVisitor(node) {
                return ts.isStringLiteral(node)
                    ? stringLiteralVisitor(node)
                    : ts.visitEachChild(node, childVisitor, context);
            }

            /**
             *
             * @param node
             * @returns {StringLiteral}
             */
            function stringLiteralVisitor(node) {
                if (node.text) {
                    return ts.createLiteral('Hello World!');
                }

                return node;
            }
        }
    }
};
