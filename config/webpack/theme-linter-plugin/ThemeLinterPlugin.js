const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');
const Logger = require('../../../scripts/utils/logger');

const CONFIG = 'terra-theme.config.js';

module.exports = class ThemeLinterPlugin {
  constructor(config) {
    // Retrieve theme config.
    let themeConfig = {};
    if (config) {
      themeConfig = config;
    } else {
      const defaultConfig = path.resolve(process.cwd(), CONFIG);
      if (fs.existsSync(defaultConfig)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        themeConfig = require(defaultConfig);
      }
    }

    this.variableInformation = {
      themeableVariables: new Set(),
      themeToPopulatedVariables: {},
    };
    [themeConfig.theme, ...(themeConfig.scoped || [])].forEach((theme) => {
      this.variableInformation.themeToPopulatedVariables[theme] = new Set();
    });
  }

  loaderPlugin() {
    return postcss.plugin('theme-linter-plugin', () => (
      (root) => {
        root.walkDecls(decl => {
          postcssValueParser(decl.value).walk(node => {
            if (node.type === 'function' && node.value === 'var') {
              this.variableInformation.themeableVariables.add(node.nodes[0].value);
            }
          });
        });

        Object.entries(this.variableInformation.themeToPopulatedVariables).forEach(([theme, populatedVariables]) => {
          root.walkRules(RegExp(`.${theme}`), (node) => {
            node.walkDecls(decl => {
              populatedVariables.add(decl.prop);
            });
          });
        });
      }
    ));
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise('ThemeLinterPlugin', () => {
      Object.entries(this.variableInformation.themeToPopulatedVariables).forEach(([theme, populatedVariables]) => {
        const missingThemeVariables = new Set([...this.variableInformation.themeableVariables].filter(x => !populatedVariables.has(x))).entries().sort();

        if (missingThemeVariables.length > 0) {
          Logger.warn(`The following themeable variables are missing for ${theme}: ${missingThemeVariables}`);
        }
      });

      return Promise.resolve();
    });
  }
};
