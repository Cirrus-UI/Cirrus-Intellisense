import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    CompletionList,
    Position,
    ProviderResult,
    Range,
    TextDocument,
} from 'vscode';

export class ClassProvider implements CompletionItemProvider {
    private classRegex: RegExp;
    private classAutocompleteItems: string[] = [];

    constructor(classRegex: RegExp) {
        this.classRegex = classRegex;
    }

    public provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        // Get current cursor
        const start: Position = new Position(position.line, 0);
        const range: Range = new Range(start, position);
        const text: string = document.getText(range); // Get selection

        // If we are not on a class attribute matching the given regex, exit
        const rawClasses = text.match(this.classRegex);;
        
        if (!rawClasses || rawClasses.length === 1) {
            return [];
        }

        // TODO: Get completion items
        const completionItems = this.classAutocompleteItems.map((className) => {
            const completionItem = new CompletionItem(className, CompletionItemKind.Variable);

            completionItem.filterText = className;
            completionItem.insertText = className;
            return completionItem;
        });

        // TODO: Remove classes already in use

        return completionItems;
    }

    public setAutocompleteItems(items: string[]) {
        this.classAutocompleteItems = items;
    }
}
