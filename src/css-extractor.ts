import * as css from "css";

export default class CssExtractor {
    private static classRegex = /[.]([\w-]+)/g;

    public static extract(ast: css.Stylesheet): string[] {
        const classes: string[] = [];

        // Keep matching with the class selector until the end
        const addRule = (rule: css.Rule) => {
            rule.selectors?.forEach((selector: string) => {
                let item = this.classRegex.exec(selector);
                while (item) {
                    classes.push(item[1]);
                    item = this.classRegex.exec(selector);
                }
            });
        };

        // Go through CSS AST
        ast.stylesheet?.rules.forEach((rule: css.Rule & css.Media) => {
            if (rule.type === 'rule') {
                addRule(rule);
            }

            if (rule.type === 'media') {
                // Search inside media queries
                rule.rules?.forEach((rule: css.Rule) => addRule(rule));
            }
        });

        return classes;
    }
}