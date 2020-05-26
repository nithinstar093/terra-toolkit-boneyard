const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');

module.exports = postcss.plugin('terra-themeable-variable-collector-plugin', (themeableVariableInformation) => (
  (root) => {
    // Walk the declarations and flag all values that are var's
    root.walkDecls(decl => {
      postcssValueParser(decl.value).walk(node => {
        if (node.type === 'function' && node.value === 'var') {
          themeableVariableInformation.themeableVariables.add(node.nodes[0].value);
        }
      });
    });

    // For each theme, walk each rule that is declared as a class for that theme and then walk declarations
    // for that rule and mark the variables as tracked (or duplicate if they've already been added)
    Object.entries(themeableVariableInformation.themeableVariableTracker).forEach(([theme, tracker]) => {
      root.walkRules(RegExp(`.${theme}`), (node) => {
        node.walkDecls(decl => {
          const updatedTracker = tracker;
          updatedTracker.populatedVariables.add(decl.prop);
          // Duplicate variables are tracked by tracking all of their values. If we end up with more than one item in the set there's a problem
          updatedTracker.duplicateVariableTracker[decl.prop] = tracker.duplicateVariableTracker[decl.prop] || new Set();
          updatedTracker.duplicateVariableTracker[decl.prop].add(decl.value);
        });
      });
    });
  }
));
