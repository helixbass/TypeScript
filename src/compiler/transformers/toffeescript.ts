/*@internal*/
namespace ts {
    export function transformToffeescript(context: TransformationContext) {
        const {factory} = context;

        return chainBundle(context, transformSourceFile);

        function transformSourceFile(node: SourceFile) {
            if (node.languageVariant !== LanguageVariant.Toffeescript) {
                return node;
            }

            return visitEachChild(node, visitor, context);
        }

        function visitor(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.UnlessStatement:
                    return visitUnlessStatement(node as UnlessStatement);
                default:
                    return visitEachChild(node, visitor, context);
            }
        }

        function visitUnlessStatement(node: UnlessStatement) {
            return factory.createIfStatement(
                factory.createPrefixUnaryExpression(SyntaxKind.ExclamationToken, visitNode(node.expression, visitor, isExpression)),
                visitNode(node.thenStatement, visitor, isStatement),
                visitNode(node.elseStatement, visitor, isStatement)
            );
        }
    }
}
