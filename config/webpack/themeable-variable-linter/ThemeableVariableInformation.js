class ThemeableVariableInformation {
  constructor(themes) {
    this.themes = themes;
    this.variables = {};
    this.perThemeVariableTracker = {};

    themes.forEach((theme) => {
      this.perThemeVariableTracker[theme] = {};
    });
  }

  addDeclaredVariable(variable) {
    this.variables[variable.name] = variable;
  }

  addValuedVariableForTheme(variable, theme) {
    this.perThemeVariableTracker[theme][variable.name] = this.perThemeVariableTracker[theme][variable.name] || [];
    this.perThemeVariableTracker[theme][variable.name].push(variable);
  }

  missingVariablesForTheme(theme) {
    return Object.entries(this.variables).filter(([name]) => (
      !Object.keys(this.perThemeVariableTracker[theme]).includes(name)
    ).map(([, variable]) => variable)).sort((variable) => variable.name);
  }

  unusedVariablesForTheme(theme) {
    return Object.entries(this.perThemeVariableTracker[theme]).filter(([name]) => (
      !Object.keys(this.variables).includes(name)
    )).reduce((accumulatedVariables, [, variables]) => (
      accumulatedVariables.concat(variables)
    ), []).sort((variable) => variable.name);
  }

  duplicateVariablesForTheme(theme) {
    return Object.values(this.perThemeVariableTracker[theme]).filter((variables) => (
      variables.length > 0
    )).reduce((accumulatedVariables, variables) => (
      accumulatedVariables.concat(variables)
    ), []).sort((variable) => variable.name);
  }
}

module.exports = ThemeableVariableInformation;
