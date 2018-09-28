module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
  ],
  plugins: [
    'babel'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
        ],
      },
      'eslint-import-resolver-typescript': true,

    },
  },
  env: {
    browser: true
  },
  globals: {
    $: false,
    afterAll: true,
    afterEach: true,
    beforeAll: true,
    beforeEach: true,
    describe: true,
    done: true,
    envConfig: false,
    expect: true,
    it: true,
    jest: true,
    pit: true,
    require: false,
    xdescribe: true,
    xit: true
  },
  overrides: {
    files: ['*.ts', '*.tsx'],
    parser: 'typescript-eslint-parser',
    plugins: ['eslint-plugin-typescript'],
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    camelcase: 'warn',
    'generator-star-spacing': 'error',
    'global-require': 0,
    'import/extensions': ['error', { ts: 'never', tsx: 'never', jsx: 'never', json: 'always' }],
    'import/no-named-as-default': 0,
    'max-len': [2, 1000, 2],
    'new-cap': ['error', { capIsNew: false }],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 0,
    'no-confusing-arrow': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 'error',
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react/no-children-prop': 0,
    'react/require-default-props': 0,
    'react/require-extension': [0],
    'import/no-extraneous-dependencies': ["error", { "devDependencies": true }],
    'class-methods-use-this': [0, { exceptMethods: [] }],
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/prefer-default-export': 0,
    'no-console': 'error',
    'no-alert': 'error',
    'func-names': 'error',
    'import/first': 0,
  },
};
