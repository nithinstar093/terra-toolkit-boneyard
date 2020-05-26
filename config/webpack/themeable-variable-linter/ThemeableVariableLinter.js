const getThemeConfig = require('../postcss/_getThemeConfig');
const ThemeableVariableCollectorPlugin = require('../postcss/ThemeableVariableCollectorPlugin');
const ThemeableVariableLinterPlugin = require('../themeable-variable-linter-webpack-plugin/ThemeableVariableLinterWebpackPlugin');

class ThemeableVariableInformationLinter {
  constructor(config) {
    const themeConfig = config || getThemeConfig();

    this.themeableVariableInformation = {
      themeableVariables: new Set(),
      themeableVariableTracker: {},
    };

    // Set up a tracker for each theme in the config
    const themes = [themeConfig.theme, ...(themeConfig.scoped || [])].filter((theme) => theme !== undefined);
    themes.forEach((theme) => {
      this.themeableVariableInformation.themeableVariableTracker[theme] = {
        populatedVariables: new Set(),
        duplicateVariableTracker: {},
      };
    });
  }

  themeableVariableCollectorPlugin() {
    return ThemeableVariableCollectorPlugin(this.themeableVariableInformation);
  }

  themeableVariableLinterPlugin() {
    return new ThemeableVariableLinterPlugin(this.themeableVariableInformation);
  }
}

module.exports = ThemeableVariableInformationLinter;
