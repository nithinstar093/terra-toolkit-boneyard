const getThemeConfig = require('../postcss/_getThemeConfig');
const ThemeableVariableCollectorPlugin = require('../postcss/ThemeableVariableCollectorPlugin');
const ThemeableVariableLinterPlugin = require('../themeable-variable-linter-webpack-plugin/ThemeableVariableLinterWebpackPlugin');
const ThemeableVariableInformation = require('./ThemeableVariableInformation');

class ThemeableVariableInformationLinter {
  constructor(config) {
    const themeConfig = config || getThemeConfig();

    // Set up a tracker for each theme in the config
    const themes = [themeConfig.theme, ...(themeConfig.scoped || [])].filter((theme) => theme !== undefined);
    this.themeableVariableInformation = new ThemeableVariableInformation(themes);
  }

  themeableVariableCollectorPlugin() {
    return ThemeableVariableCollectorPlugin(this.themeableVariableInformation);
  }

  themeableVariableLinterPlugin() {
    return new ThemeableVariableLinterPlugin(this.themeableVariableInformation);
  }
}

module.exports = ThemeableVariableInformationLinter;
