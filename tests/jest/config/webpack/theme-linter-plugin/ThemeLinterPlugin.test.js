jest.mock('postcss-value-parser');

const postcssValueParser = require('postcss-value-parser');
const ThemeLinterPlugin = require('../../../../../config/webpack/theme-linter-plugin/ThemeLinterPlugin');

describe('Theme Linter Constructor', () => {
  it('creates the tracker with a filled out config', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b'],
    };
    const plugin = new ThemeLinterPlugin(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with no default in the config', () => {
    const themeConfig = {
      scoped: ['a', 'b'],
    };
    const plugin = new ThemeLinterPlugin(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with no scoped in the config', () => {
    const themeConfig = {
      theme: 'default',
    };
    const plugin = new ThemeLinterPlugin(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with an undefined scoped in the config', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b', undefined],
    };
    const plugin = new ThemeLinterPlugin(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });
});

describe('Theme Linter Loader Plugin', () => {
  it('populates the list of themeable variables', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b'],
    };

    const plugin = new ThemeLinterPlugin(themeConfig);
    const loaderPlugin = plugin.loaderPlugin()();

    const mockVarNode1 = {
      type: 'function',
      value: 'var',
      nodes: [{
        value: '--var1',
      }],
    };

    const mockVarNode2 = {
      type: 'function',
      value: 'var',
      nodes: [{
        value: '--var2',
      }],
    };

    const mockNonVarNode = {
      type: 'function',
      value: 'something other than a var',
      nodes: [{
        value: 'something',
      }],
    };

    const mockNonFunctionNode = {
      type: 'nonfunction',
      value: 'var',
      nodes: [{
        value: 'something',
      }],
    };

    postcssValueParser.mockReturnValue({
      walk: jest
        .fn()
        .mockImplementation(func => {
          func(mockVarNode1);
          func(mockVarNode2);
          func(mockNonVarNode);
          func(mockNonFunctionNode);
        }),
    });

    const mockDeclaration = {
      value: 'declaration value',
    };
    const mockRoot = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDeclaration);
        }),
      walkRules: () => {},
    };

    loaderPlugin(mockRoot);

    expect(plugin.variableInformation).toMatchSnapshot();
    expect(postcssValueParser).toBeCalledWith('declaration value');
  });

  it('populates the list of tracked variables', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b'],
    };

    const plugin = new ThemeLinterPlugin(themeConfig);
    const loaderPlugin = plugin.loaderPlugin()();

    const mockDecl1 = {
      prop: '--var1',
    };

    const mockDecl2 = {
      prop: '--var2',
    };

    const mockDecl2Dup = {
      prop: '--var2',
    };

    const mockDecl3 = {
      prop: '--var3',
    };

    const mockDefaultNode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
          func(mockDecl2);
          func(mockDecl3);
        }),
    };
    const mockANode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
        }),
    };
    const mockBNode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
          func(mockDecl2);
          func(mockDecl2Dup);
          func(mockDecl3);
        }),
    };

    const mockRoot = {
      walkDecls: () => {},
      walkRules: jest
        .fn()
        .mockImplementation((regex, func) => {
          if (String(regex) === String(RegExp('.default'))) {
            func(mockDefaultNode);
          } else if (String(regex) === String(RegExp('.a'))) {
            func(mockANode);
          } else if (String(regex) === String(RegExp('.b'))) {
            func(mockBNode);
          } else {
            throw new Error(`Invalid reg ex passed while walking the nodes: ${regex}`);
          }
        }),
    };

    loaderPlugin(mockRoot);

    expect(plugin.variableInformation).toMatchSnapshot();
  });
});

describe('Theme Linter Plugin', () => {
  it('pushes warning based on tracked variables', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b', 'c', 'd'],
    };

    const mockCompilation = {
      warnings: [],
    };

    const mockCompiler = {
      hooks: {
        emit: {
          tapPromise: jest
            .fn()
            .mockImplementation((pluginName, func) => {
              expect(pluginName).toEqual('TerraThemeLinterPlugin');
              func(mockCompilation);
            }),
        },
      },
    };

    const plugin = new ThemeLinterPlugin(themeConfig);

    // default is set up correctly
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeableVariables.add(item));
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeVariableTracker.default.populatedVariables.add(item));

    // a has dup variables
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeableVariables.add(item));
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeVariableTracker.a.populatedVariables.add(item));
    ['--var2', '--var3'].forEach((item) => plugin.variableInformation.themeVariableTracker.a.duplicateVariables.add(item));

    // b is missing variables
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeableVariables.add(item));
    ['--var3'].forEach((item) => plugin.variableInformation.themeVariableTracker.b.populatedVariables.add(item));

    // c has stale variables
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeableVariables.add(item));
    ['--var1', '--var2', '--var3', '--var4'].forEach((item) => plugin.variableInformation.themeVariableTracker.c.populatedVariables.add(item));

    // d has various problems
    ['--var1', '--var2', '--var3'].forEach((item) => plugin.variableInformation.themeableVariables.add(item));
    ['--var2', '--var3', '--var4'].forEach((item) => plugin.variableInformation.themeVariableTracker.d.populatedVariables.add(item));
    ['--var2', '--var3'].forEach((item) => plugin.variableInformation.themeVariableTracker.d.duplicateVariables.add(item));

    plugin.apply(mockCompiler);

    expect(mockCompilation.warnings).toMatchSnapshot();
  });
});
