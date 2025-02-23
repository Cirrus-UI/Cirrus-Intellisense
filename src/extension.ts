// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from 'lodash';
import { ClassProvider } from './class-provider';
import { CLASS_CDN, TRIGGER_CHARS } from './constants';
import CssExtractor from './css-extractor';
import Fetcher from './fetcher';
import { ExtensionConfig } from './config';
import { StatusBarItem, StatusBarItemIcon } from './status-bar-item';
import { Command } from './commands';
import { ProviderSyntax } from './provider-languages';

const disposables: vscode.Disposable[] = [];
let classAutocompleteItems: string[] = [];
let backslashless: string[] = [];

// Providers
const CSS_LIKE_PROVIDERS = new Map<ProviderSyntax, ClassProvider>([
    [ProviderSyntax.CSS, new ClassProvider(/@extend ([.\w- ]*$)/, `.`)],
]);
const OTHER_PROVIDERS = new Map<ProviderSyntax, ClassProvider>([
    [ProviderSyntax.HTML, new ClassProvider(/class=["|']([\w- ]*$)/)],
    [ProviderSyntax.REACT, new ClassProvider(/className=["|']([\w- ]*$)/)],
    [ProviderSyntax.JAVASCRIPT, new ClassProvider(/class=["|']([\w- ]*$)/)],
]);

// Status bar item
const statusBarItem = new StatusBarItem(Command.Sync);
let syncing = false;

export async function activate(context: vscode.ExtensionContext) {
    await hydrate([...CSS_LIKE_PROVIDERS.values()], [...OTHER_PROVIDERS.values()]);
    registerProviders(context, disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
    unregisterProviders(disposables);
}

async function hydrate(cssLikeProviders: ClassProvider[], otherProviders: ClassProvider[]) {
    try {
        console.debug(`HYDRATE`);
        statusBarItem.setStatus(StatusBarItemIcon.LOADING, `Syncing latest version of Cirrus...`);

        const cssAst = await Fetcher.fetchStyleSheet(CLASS_CDN);
        const classes = CssExtractor.extract(cssAst);

        classAutocompleteItems = _.uniq(classes);
        // For other languages not CSS-based, we need to remove all the backslashes
        backslashless = classAutocompleteItems.map(c => c.replaceAll(`\\`, ``));

        console.log(classAutocompleteItems);

        cssLikeProviders.forEach((provider) => provider.setAutocompleteItems(classAutocompleteItems));
        otherProviders.forEach((provider) => provider.setAutocompleteItems(backslashless));

        statusBarItem.setStatus(StatusBarItemIcon.DO_ACTION, `Cirrus synced. Click to sync again`);
    } catch (err) {
        statusBarItem.setStatus(StatusBarItemIcon.ERROR, `Error syncing classes for Cirrus. Click again to retry.`);
        console.error(`Error hydrating Cirrus classes`, err);
    }
}

function registerProviders(context: vscode.ExtensionContext, disposables: vscode.Disposable[]) {
    vscode.workspace
        .getConfiguration()
        ?.get<string[]>(ExtensionConfig.HtmlLanguages)
        ?.forEach((language) => {
            disposables.push(
                vscode.languages.registerCompletionItemProvider(
                    language,
                    OTHER_PROVIDERS.get(ProviderSyntax.HTML)!,
                    ...TRIGGER_CHARS
                )
            );
        });

    vscode.workspace
        .getConfiguration()
        ?.get<string[]>(ExtensionConfig.CssLanaguages)
        ?.forEach((language) => {
            disposables.push(
                vscode.languages.registerCompletionItemProvider(
                    language,
                    CSS_LIKE_PROVIDERS.get(ProviderSyntax.CSS)!,
                    ...TRIGGER_CHARS
                )
            );
        });

    vscode.workspace
        .getConfiguration()
        ?.get<string[]>(ExtensionConfig.JavaScriptLanguages)
        ?.forEach((language) => {
            disposables.push(
                vscode.languages.registerCompletionItemProvider(
                    language,
                    OTHER_PROVIDERS.get(ProviderSyntax.REACT)!,
                    ...TRIGGER_CHARS
                ),
                vscode.languages.registerCompletionItemProvider(
                    language,
                    OTHER_PROVIDERS.get(ProviderSyntax.JAVASCRIPT)!,
                    ...TRIGGER_CHARS
                )
            );
        });

    context.subscriptions.push(
        vscode.commands.registerCommand(Command.Sync, async () => {
            if (syncing) {
                return;
            }

            syncing = true;
            try {
                await hydrate([...CSS_LIKE_PROVIDERS.values()], [...OTHER_PROVIDERS.values()]);
            } catch (err) {
                console.error(`Cirrus Intellisense`, err);
            } finally {
                syncing = false;
            }
        })
    );
}

function unregisterProviders(disposables: vscode.Disposable[]) {
    disposables.forEach((disposable) => disposable.dispose());
    disposables.length = 0;
}
