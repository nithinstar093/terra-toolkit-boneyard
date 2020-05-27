const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');
const ThemeableVariableDeclaration = require('../themeable-variable-linter/ThemeableVariableDeclaration');
const ThemeableVariableValue = require('../themeable-variable-linter/ThemeableVariableValue');

module.exports = postcss.plugin('terra-themeable-variable-collector-plugin', (themeableVariableInformation) => (
  (root) => {
    // Walk the declarations and flag all values that are var's
    root.walkDecls(decl => {
      postcssValueParser(decl.value).walk(node => {
        if (node.type === 'function' && node.value === 'var') {
          themeableVariableInformation.addDeclaredVariable(new ThemeableVariableDeclaration(node.nodes[0].value, root.source.input.from));
        }
      });
    });

    // For each theme, walk each rule that is declared as a class for that theme and then walk declarations
    // for that rule and mark the variables as tracked (or duplicate if they've already been added)
    themeableVariableInformation.themes.forEach((theme) => {
      root.walkRules(RegExp(`.${theme}`), (node) => {
        node.walkDecls(decl => {
          themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue(decl.prop, decl.value, root.source.input.from), theme);
        });
      });
    });
  }
));
