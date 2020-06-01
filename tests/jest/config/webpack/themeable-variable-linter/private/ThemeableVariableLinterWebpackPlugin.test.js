const ThemeableVariableDeclaration = require('../../../../../../config/webpack/themeable-variable-linter/ThemeableVariableDeclaration');
const ThemeableVariableValue = require('../../../../../../config/webpack/themeable-variable-linter/ThemeableVariableValue');
const ThemeableVariableInformation = require('../../../../../../config/webpack/themeable-variable-linter/ThemeableVariableInformation');
const ThemeableVariableLinterWebpackPlugin = require('../../../../../../config/webpack/themeable-variable-linter/private/ThemeableVariableLinterWebpackPlugin');

describe('Theme Variable Linter Webpack Plugin', () => {
  it('pushes warning based on tracked variables', () => {
    const themeableVariableInformation = new ThemeableVariableInformation(['default', 'a', 'b', 'c', 'd']);

    const mockCompilation = {
      warnings: [],
    };

    const mockCompiler = {
      hooks: {
        emit: {
          tapPromise: jest
            .fn()
            .mockImplementation((pluginName, func) => {
              expect(pluginName).toEqual('TerraThemeableVariableLinterPlugin');
              func(mockCompilation);
            }),
        },
      },
    };

    const plugin = new ThemeableVariableLinterWebpackPlugin(themeableVariableInformation);

    themeableVariableInformation.addDeclaredVariable(new ThemeableVariableDeclaration('--var1', { file: `${process.cwd()}/file1.scss`, line: 1, column: 1 }));
    themeableVariableInformation.addDeclaredVariable(new ThemeableVariableDeclaration('--var2', { file: `${process.cwd()}/file2.scss`, line: 2, column: 2 }));
    themeableVariableInformation.addDeclaredVariable(new ThemeableVariableDeclaration('--var3', { file: `${process.cwd()}/file3.scss`, line: 3, column: 3 }));

    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var1', 1, { file: `${process.cwd()}/default/file1.scss`, line: 1, column: 1 }), 'default');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 2, { file: `${process.cwd()}/default/file2.scss`, line: 2, column: 2 }), 'default');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 3, { file: `${process.cwd()}/default/file3.scss`, line: 3, column: 3 }), 'default');

    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var1', 1, { file: `${process.cwd()}/a/file1.scss`, line: 1, column: 1 }), 'a');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 2, { file: `${process.cwd()}/a/file2-1.scss`, line: 2, column: 2 }), 'a');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 3, { file: `${process.cwd()}/a/file2-2.scss`, line: 3, column: 3 }), 'a');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 3, { file: `${process.cwd()}/a/file3-1.scss`, line: 3, column: 3 }), 'a');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 4, { file: `${process.cwd()}/a/file3-2.scss`, line: 4, column: 4 }), 'a');

    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 1, { file: `${process.cwd()}/b/file3.scss`, line: 1, column: 1 }), 'b');

    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var1', 1, { file: `${process.cwd()}/c/file1.scss`, line: 1, column: 1 }), 'c');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 2, { file: `${process.cwd()}/c/file2.scss`, line: 2, column: 2 }), 'c');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 3, { file: `${process.cwd()}/c/file3.scss`, line: 3, column: 3 }), 'c');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var4', 4, { file: `${process.cwd()}/c/file4.scss`, line: 4, column: 4 }), 'c');

    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 2, { file: `${process.cwd()}/d/file2-1.scss`, line: 2, column: 2 }), 'd');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var2', 3, { file: `${process.cwd()}/d/file2-2.scss`, line: 3, column: 3 }), 'd');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 3, { file: `${process.cwd()}/d/file3-1.scss`, line: 3, column: 3 }), 'd');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var3', 4, { file: `${process.cwd()}/d/file3-2.scss`, line: 4, column: 4 }), 'd');
    themeableVariableInformation.addValuedVariableForTheme(new ThemeableVariableValue('--var4', 4, { file: `${process.cwd()}/d/file4.scss`, line: 4, column: 4 }), 'd');

    plugin.apply(mockCompiler);

    expect(mockCompilation.warnings).toMatchSnapshot();
  });
});
