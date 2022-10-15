import * as vscode from 'vscode';

export enum StatusBarItemIcon {
    DO_ACTION = 'cloud',
    LOADING = 'loading~spin',
    ERROR = 'alert',
}

/**
 * Manage status bar actions and display for extension.
 */
export class StatusBarItem {
    public statusBarItem: vscode.StatusBarItem;
    private timeout: NodeJS.Timer | null;
    private STATUS_TIMEOUT_MS = 5000;

    constructor(command: string, alignment?: vscode.StatusBarAlignment, priority?: number) {
        this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
        this.statusBarItem.command = command;
        this.statusBarItem.show();
        this.timeout = null;
    }

    public setStatus(icon: string, text: string, autoHide = true): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.statusBarItem.text = `$(${icon}) ${text}`;
        this.statusBarItem.tooltip = undefined;

        if (autoHide) {
            this.timeout = setTimeout(() => {
                this.statusBarItem.text = `$(${icon})`;
                this.statusBarItem.tooltip = text;
            }, this.STATUS_TIMEOUT_MS);
        }
    }
}