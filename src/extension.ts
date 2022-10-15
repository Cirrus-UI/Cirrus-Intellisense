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

const disposables: vscode.Disposable[] = [];
let classAutocompleteItems: string[] = [];

// Providers
const htmlProvider = new ClassProvider(/class=["|']([\w- ]*$)/);

// Status bar item
const statusBarItem = new StatusBarItem(Command.Sync);
let syncing = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    await hydrate();
    registerProviders(context, disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
    unregisterProviders(disposables);
}

async function hydrate() {
    try {
        console.debug(`HYDRATE`);
        statusBarItem.setStatus(StatusBarItemIcon.LOADING, `Syncing latest version of Cirrus...`)
    
        const cssAst = await Fetcher.fetchStyleSheet(CLASS_CDN);
        const classes = CssExtractor.extract(cssAst);
    
        classAutocompleteItems = _.uniq(classes);
        htmlProvider.setAutocompleteItems(classAutocompleteItems);

        statusBarItem.setStatus(StatusBarItemIcon.DO_ACTION, `Cirrus synced. Click to sync again`);
    } catch (err) {
        statusBarItem.setStatus(StatusBarItemIcon.ERROR, `Error syncing classes for Cirrus. Click again to retry.`);
        console.error(`Error hydrating Cirrus classes`, err);
    }
}

function registerProviders(context: vscode.ExtensionContext, disposables: vscode.Disposable[]) {
    // TODO: Allow configuration for which file extensions to register for
    // TODO: Support JS files and CSS files
    vscode.workspace
        .getConfiguration()
        ?.get<string[]>(ExtensionConfig.HtmlLanguages)
        ?.forEach((language) => {
            disposables.push(vscode.languages.registerCompletionItemProvider(language, htmlProvider, ...TRIGGER_CHARS));
        });

    context.subscriptions.push(vscode.commands.registerCommand(Command.Sync, async () => {
        if (syncing) {
            return;
        }

        syncing = true;
        try {
            await hydrate();
        } catch (err) {
            console.error(`Cirrus Intellisense`, err);
        } finally {
            syncing = false;
        }
    }));
}

function unregisterProviders(disposables: vscode.Disposable[]) {
    disposables.forEach((disposable) => disposable.dispose());
    disposables.length = 0;
}
