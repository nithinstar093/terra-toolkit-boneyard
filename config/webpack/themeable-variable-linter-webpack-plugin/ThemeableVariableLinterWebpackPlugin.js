/**
 * This plugin provides a post css loader plugin that tracks themeable variables and a webpack plugin that aggregates those
 * results as warnings by the webpack compilation
 */
module.exports = class ThemeableVariableLinterPlugin {
  constructor(themeableVariableInformation) {
    this.themeableVariableInformation = themeableVariableInformation;
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise('TerraThemeableVariableLinterPlugin', (compilation) => {
      Object.entries(this.themeableVariableInformation.themeableVariableTracker).forEach(([theme, tracker]) => {
        // Mark variables that are in the list of themeable variables but weren't tracked as a missing warning
        const missingThemeVariables = Array.from(new Set([...this.themeableVariableInformation.themeableVariables].filter(x => !tracker.populatedVariables.has(x)))).sort();
        if (missingThemeVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are missing:\n${missingThemeVariables.join('\n')}`);
        }

        // Mark variables that are in the list of populated variables but in the list of themeable variables as a stale warning
        const staleThemeVariables = Array.from(new Set([...tracker.populatedVariables].filter(x => !this.themeableVariableInformation.themeableVariables.has(x)))).sort();
        if (staleThemeVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are unused:\n${staleThemeVariables.join('\n')}`);
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
