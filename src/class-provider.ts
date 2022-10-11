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
    private splitChar: string; // Used to delimit class names
    private autoCompleteClasses: string[] = [];

    constructor(classRegex: RegExp, splitChar: string = " ") {
        this.classRegex = classRegex;
        this.splitChar = splitChar;
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
        const rawClasses = text.match(this.classRegex);
        
        if (!rawClasses || rawClasses.length === 1) {
            return [];
        }

        // Get classes already used in selector
        const usedClasses = new Set(rawClasses[1].split(this.splitChar));

        // Filter out used classes from class list
        const unusedClasses = this.autoCompleteClasses.filter(item => !usedClasses.has(item));
        const completionItems = unusedClasses.map((className) => {
            const completionItem = new CompletionItem(className, CompletionItemKind.Variable);

            completionItem.filterText = className;
            completionItem.insertText = className;
            return completionItem;
        });

        return completionItems;
    }

    public setAutocompleteItems(items: string[]) {
        this.autoCompleteClasses = items;
    }
}
