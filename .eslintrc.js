// ============================================
// ESLINT CONFIGURATION FOR NESTJS
// ============================================

module.exports = {
  // ─────────────────────────────────────────
  // PARSER CONFIGURATION
  // ─────────────────────────────────────────
  parser: '@typescript-eslint/parser',
  // ✓ Use TypeScript ESLint parser
  // Allows ESLint to understand TypeScript syntax

  parserOptions: {
    project: 'tsconfig.json',
    // ✓ Path to TypeScript config file
    // Enables type-aware linting rules

    tsconfigRootDir: __dirname,
    // ✓ Root directory for tsconfig resolution
    // Ensures correct path resolution in monorepos

    sourceType: 'module',
    // ✓ Use ECMAScript modules (import/export)
    // Standard for modern TypeScript/Node.js projects
  },

  // ─────────────────────────────────────────
  // PLUGINS
  // ─────────────────────────────────────────
  plugins: ['@typescript-eslint/eslint-plugin'],
  // ✓ TypeScript-specific linting rules
  // Provides rules for TypeScript best practices

  // ─────────────────────────────────────────
  // EXTENDED CONFIGURATIONS
  // ─────────────────────────────────────────
  extends: [
    'plugin:@typescript-eslint/recommended',
    // ✓ Recommended TypeScript rules
    // Base set of TypeScript linting rules

    'plugin:prettier/recommended',
    // ✓ Integrates Prettier with ESLint
    // Runs Prettier as an ESLint rule and reports differences
    // Must be last to override other formatting rules
  ],

  // ─────────────────────────────────────────
  // PROJECT SETTINGS
  // ─────────────────────────────────────────
  root: true,
  // ✓ Stop ESLint from searching parent directories
  // This is the root config for this project

  env: {
    node: true,
    // ✓ Enable Node.js global variables and scope
    // Allows use of Node.js globals like 'process', 'Buffer', etc.

    jest: true,
    // ✓ Enable Jest global variables
    // Allows use of Jest globals like 'describe', 'test', 'expect', etc.
  },

  // ─────────────────────────────────────────
  // IGNORE PATTERNS
  // ─────────────────────────────────────────
  ignorePatterns: ['.eslintrc.js'],
  // ✓ Files to ignore during linting
  // Prevents linting this config file itself

  // ─────────────────────────────────────────
  // CUSTOM RULES
  // ─────────────────────────────────────────
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    // ✓ Allow usage of 'any' type
    // Disabled because sometimes 'any' is necessary for flexibility
    // Consider enabling this for stricter type safety

    '@typescript-eslint/no-floating-promises': 'warn',
    // ✓ Warn about unhandled promises
    // Helps catch forgotten await keywords or missing .catch()
    // Important for async error handling

    '@typescript-eslint/no-unsafe-argument': 'warn',
    // ✓ Warn when passing 'any' typed values as arguments
    // Helps maintain type safety throughout the codebase

    'prettier/prettier': 'off',
    // ✓ Disable Prettier errors in ESLint
    // Prettier will still format on save via editor settings
    // This prevents annoying inline errors while coding

    // 'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // ✓ Run Prettier as ESLint rule
    // endOfLine: 'auto' - Automatically detect line endings
    // Prevents issues between different operating systems (Windows vs Unix)
  },
};
