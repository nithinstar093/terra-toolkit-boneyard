const namesAndLocationsOfVariables = (variables) => variables.map(variable => `${variable.name}(${variable.location})`);

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
      Object.entries(this.themeableVariableInformation.themes).forEach((theme) => {
        const missingVariablesForTheme = this.themeableVariableInformation.missingVariablesForTheme(theme);
        if (missingVariablesForTheme.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are missing:\n${namesAndLocationsOfVariables(missingVariablesForTheme).join('\n')}`);
        }

        const unusedVariablesForTheme = this.themeableVariableInformation.unusedVariablesForTheme(theme);
        if (unusedVariablesForTheme.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are unused:\n${namesAndLocationsOfVariables(unusedVariablesForTheme).join('\n')}`);
        }

        const duplicateVariablesForTheme = this.themeableVariableInformation.duplicateVariablesForTheme(theme);
        if (duplicateVariablesForTheme.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are duplicated:\n${namesAndLocationsOfVariables(duplicateVariablesForTheme).join('\n')}`);
        }
      });

      return Promise.resolve();
    });
  }
};
