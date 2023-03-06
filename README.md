# Cirrus Intellisense for Visual Studio Code

Adds all the classes for [Cirrus CSS](https://github.com/Spiderpig86/Cirrus/tree/master) right at your finger tips.

## Installation

<a href="https://marketplace.visualstudio.com/items?itemName=Spiderpig86.cirrus-intellisense/"><strong>Install for Visual Studio Code »</strong></a>

After you've successfully installed Cirrus Intellisense, open up a file with a file extension it supports (e.g. `.html`) to get started!

## Features

### Autocompletion

![](https://raw.githubusercontent.com/Cirrus-UI/Cirrus-Intellisense/main/images/Intellisense-AutoComplete.jpg)

Fast auto-completion for class names right at your finger tips.

### Multi-langage Support

![](https://raw.githubusercontent.com/Cirrus-UI/Cirrus-Intellisense/main/images/Intellisense-Languages.jpg)

Autocompletion for a large variety of languages ranging from Sass, React, and many more. By default, Cirrus Intellisense supports the following languages right out the box:

- HTML
- Vue (requires [octoref.vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur))
- Razor
- Laravel Blade
- Handlebars
- Twig
- Django Template
- PHP
- Markdown
- Embedded Ruby (requires [rebornix.Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby))
- EJS
- Svelte
- CSS
- Sass
- Scss
- Less
- JavaScript
- JSX
- TSX

You can always add your own languages via the configuration if needed.

### Version Switching (Coming Soon)

The ability to switch between Cirrus versions is coming soon. You can easily work with the version of Cirrus outside of the latest release.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

### `cirrus-intellisense.html-languages`

List of file extensions to enable Cirrus Intellisense to run on for HTML-based languages. This activates for text around the `class` attribute.

### `cirrus-intellisense.css-languages`

List of file extensions to enable Cirrus Intellisense to run on for CSS-based languages. This activates for text after the `@extend` keyword.

### `cirrus-intellisense.js-languages`

List of file extensions to enable Cirrus Intellisense to run on for JS-based languages. This activates for text around the `class` or `className` attributes.

## Commands

### `cirrus-intellisense.sync`

To re-fetch Cirrus classes from the server, you can run the `cirrus-intellisense.sync` command. You can run the command pressing `Ctrl+Shift+P` (or `Cmd+Shift+P`) and typing `Resync and cache Cirrus class definitions` and pressing `Enter`.

You can also trigger this command by clicking on the small cloud icon at the bottom left of VsCode.

## Known Issues

*TBA*

