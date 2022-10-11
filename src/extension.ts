// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from 'lodash';
import { ClassProvider } from './class-provider';
import { CLASS_CDN, TRIGGER_CHARS } from './constants';
import CssExtractor from './css-extractor';
import Fetcher from './fetcher';

const disposables: vscode.Disposable[] = [];
let classAutocompleteItems: string[] = [];

const htmlProvider = new ClassProvider(/class=["|']([\w- ]*$)/);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    await hydrateClasses();
    registerProviders(disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {
    unregisterProviders(disposables);
}

async function hydrateClasses() {
    console.debug(`HYDRATE`);

    const cssAst = await Fetcher.fetchStyleSheet(CLASS_CDN);
    const classes = CssExtractor.extract(cssAst);

    classAutocompleteItems = _.uniq(classes);
    htmlProvider.setAutocompleteItems(classAutocompleteItems);
}

function registerProviders(disposables: vscode.Disposable[]) {
    // TODO: Allow configuration for which file extensions to register for
    // TODO: Support JS files and CSS files
    disposables.push(vscode.languages.registerCompletionItemProvider(`html`, htmlProvider, ...TRIGGER_CHARS));
}

function unregisterProviders(disposables: vscode.Disposable[]) {
    disposables.forEach((disposable) => disposable.dispose());
    disposables.length = 0;
}
