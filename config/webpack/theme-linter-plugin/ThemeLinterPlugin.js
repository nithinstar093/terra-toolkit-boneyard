const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');
const getThemeConfig = require('../postcss/_getThemeConfig');

/**
 * This plugin provides a post css loader plugin that tracks themeable variables and a webpack plugin that aggregates those
 * results as warnings by the webpack compilation
 */
module.exports = class ThemeLinterPlugin {
  constructor(config) {
    const themeConfig = config || getThemeConfig();

    this.variableInformation = {
      themeableVariables: new Set(),
      themeVariableTracker: {},
    };

    // Set up a tracker for each theme in the config
    const themes = [themeConfig.theme, ...(themeConfig.scoped || [])].filter((theme) => theme !== undefined);
    themes.forEach((theme) => {
      this.variableInformation.themeVariableTracker[theme] = {
        populatedVariables: new Set(),
        duplicateVariableTracker: {},
      };
    });
  }

  loaderPlugin() {
    return postcss.plugin('terra-theme-linter-plugin', () => (
      (root) => {
        // Walk the declarations and flag all values that are var's
        root.walkDecls(decl => {
          postcssValueParser(decl.value).walk(node => {
            if (node.type === 'function' && node.value === 'var') {
              this.variableInformation.themeableVariables.add(node.nodes[0].value);
            }
          });
        });

        // For each theme, walk each rule that is declared as a class for that theme and then walk declarations
        // for that rule and mark the variables as tracked (or duplicate if they've already been added)
        Object.entries(this.variableInformation.themeVariableTracker).forEach(([theme, tracker]) => {
          root.walkRules(RegExp(`.${theme}`), (node) => {
            node.walkDecls(decl => {
              const updatedTracker = tracker;
              updatedTracker.populatedVariables.add(decl.prop);
              updatedTracker.duplicateVariableTracker[decl.prop] = tracker.duplicateVariableTracker[decl.prop] || new Set();
              updatedTracker.duplicateVariableTracker[decl.prop].add(decl.value);
            });
          });
        });
      }
    ));
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise('TerraThemeLinterPlugin', (compilation) => {
      Object.entries(this.variableInformation.themeVariableTracker).forEach(([theme, tracker]) => {
        // Mark variables that are in the list of themeable variables but weren't tracked as a missing warning
        const missingThemeVariables = Array.from(new Set([...this.variableInformation.themeableVariables].filter(x => !tracker.populatedVariables.has(x)))).sort();
        if (missingThemeVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are missing:\n${missingThemeVariables.join('\n')}`);
        }

        // Mark variables that are in the list of populated variables but in the list of themeable variables as a stale warning
        const staleThemeVariables = Array.from(new Set([...tracker.populatedVariables].filter(x => !this.variableInformation.themeableVariables.has(x)))).sort();
        if (staleThemeVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are stale:\n${staleThemeVariables.join('\n')}`);
        }

        const duplicateVariables = Object.entries(tracker.duplicateVariableTracker).filter(([, values]) => values.size > 1).map(([key]) => key);
        // Mark duplicate variables as a duplicate warning
        if (duplicateVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are duplicated:\n${duplicateVariables.sort().join('\n')}`);
        }
      });

      return Promise.resolve();
    });
  }
};
