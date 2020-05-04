const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');

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
    const themes = [themeConfig.theme, ...(themeConfig.scoped || [])].filter((theme) => theme !== undefined);
    themes.forEach((theme) => {
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
    compiler.hooks.emit.tapPromise('ThemeLinterPlugin', (compilation) => {
      Object.entries(this.variableInformation.themeToPopulatedVariables).forEach(([theme, populatedVariables]) => {
        const missingThemeVariables = Array.from(new Set([...this.variableInformation.themeableVariables].filter(x => !populatedVariables.has(x)))).sort();

        if (missingThemeVariables.length > 0) {
          compilation.warnings.push(`${theme}.\nThe following variables are missing:\n${missingThemeVariables.join('\n')}`);
        }
      });

      return Promise.resolve();
    });
  }
};
