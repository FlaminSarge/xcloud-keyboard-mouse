/* eslint-disable max-len */
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true, // Treat .js files as nodejs scripts
      },
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/ignore': ['react-native'],
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/errors', // Enables rules for order of imports etc.
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    'max-len': ['error', { code: 120 }],
    'import/order': [
      'error',
      {
        groups: [
          ['external', 'builtin'],
          ['internal', 'index', 'sibling', 'parent'],
        ],
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-find-dom-node': 'off',
    'react/no-danger': 'error',
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-var-requires': 'off', // Used for assets
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
