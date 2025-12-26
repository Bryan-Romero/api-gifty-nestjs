// ============================================
// PRETTIER CONFIGURATION FOR NESTJS
// ============================================

module.exports = {
  // ─────────────────────────────────────────
  // QUOTES AND SEMICOLONS
  // ─────────────────────────────────────────
  singleQuote: true,
  // ✓ Use single quotes: 'text' instead of "text"
  // NestJS uses single quotes by convention

  semi: true,
  // ✓ Add semicolon at the end of statements
  // NestJS officially uses semicolons (different from Next.js)

  // ─────────────────────────────────────────
  // LINE LENGTH AND SPACING
  // ─────────────────────────────────────────
  printWidth: 120,
  // ✓ Maximum line length before wrapping
  // 120 characters is a good balance for backend code

  tabWidth: 2,
  // ✓ Number of spaces per indentation level
  // Standard 2 spaces

  useTabs: false,
  // ✓ Use spaces instead of tabs
  // Maintains consistency across different editors

  bracketSpacing: true,
  // ✓ Add spaces inside object braces
  // { foo: bar } instead of {foo: bar}

  // ─────────────────────────────────────────
  // COMMAS AND PARENTHESES
  // ─────────────────────────────────────────
  trailingComma: 'all',
  // ✓ Add trailing commas in arrays, objects, parameters, etc.
  // Makes it easier to add/remove lines without modifying the previous one
  // Better for Git diffs

  arrowParens: 'always',
  // ✓ Always use parentheses in arrow functions
  // (x) => x instead of x => x
  // More consistent and clear

  // ─────────────────────────────────────────
  // LINE BREAKS
  // ─────────────────────────────────────────
  endOfLine: 'lf',
  // ✓ Use Line Feed (Unix/Linux/Mac)
  // Avoids issues between operating systems

  // ─────────────────────────────────────────
  // PLUGINS
  // ─────────────────────────────────────────
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  // ✓ Plugin to automatically sort and organize imports
  // Keeps imports clean and consistent

  // ─────────────────────────────────────────
  // IMPORT ORDERING
  // ─────────────────────────────────────────
  importOrder: [
    '^@nestjs/(.*)$',
    // 1️⃣ First: NestJS imports (@nestjs/common, @nestjs/core, etc.)

    '<THIRD_PARTY_MODULES>',
    // 2️⃣ Second: External libraries (express, typeorm, class-validator, etc.)

    '^@/(.*)$',
    // 3️⃣ Third: Internal modules with aliases (@/modules, @/config, etc.)

    '^[./]',
    // 4️⃣ Fourth: Relative imports (./service, ../dto, etc.)
  ],

  importOrderSeparation: true,
  // ✓ Add blank line between each import group
  // Improves visual readability

  importOrderSortSpecifiers: true,
  // ✓ Sort imports alphabetically within each line
  // import { B, A, C } becomes import { A, B, C }

  // ─────────────────────────────────────────
  // PARSER PLUGINS (Required for NestJS)
  // ─────────────────────────────────────────
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  // ✓ Enables TypeScript and decorator syntax parsing
  // Required for NestJS decorators like @Controller, @Injectable, etc.
};
