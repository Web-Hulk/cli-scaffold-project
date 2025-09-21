#!/usr/bin/env node
import { Command } from 'commander';
import { execa } from 'execa';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

const program = new Command();

program.name('cli-frameworks-setup').description('Scaffold Vite + React + TS').version('1.0.0');

program
  .command('hello')
  .description('CLI Test')
  .action(() => {
    console.log('Hello - cli-frameworks-setup works!');
  });

program
  .command('init <project-name>')
  .description('Initialize new project: Vite + React + TypeScript')
  .action(async (projectName) => {
    const spinner = ora(`Initializing project ${projectName}`).start();

    try {
      const targetDir = path.resolve(process.cwd(), projectName);

      if (fs.existsSync(targetDir)) {
        spinner.fail(`Catalog ${projectName} already exists!`);
        process.exit(1);
      }

      // Create project using Vite
      spinner.text = 'Creating project with Vite + React + TS...';
      await execa('pnpm', ['create', 'vite', projectName, '--template', 'react-ts'], { stdio: 'inherit' });
      spinner.succeed('Project Vite + React + TS created.');

      process.chdir(targetDir);

      // Add ESLint and Prettier
      const spinnerESLint = ora('Setting up ESLint and Prettier...').start();
      try {
        await execa(
          'pnpm',
          [
            'add',
            '-D',
            'eslint',
            'eslint-config-prettier',
            'eslint-import-resolver-typescript',
            'eslint-plugin-import',
            'eslint-plugin-jsx-a11y',
            'eslint-plugin-prettier',
            'eslint-plugin-react',
            'eslint-plugin-react-hooks',
            'eslint-plugin-react-refresh',
            '@eslint/js',
            'prettier',
            'typescript-eslint',
            '@typescript-eslint/eslint-plugin',
            '@typescript-eslint/parser'
          ],
          { stdio: 'inherit' }
        );

        await execa('pnpm', ['rm', '-D', 'globals'], { stdio: 'inherit' });

        // ESLint config
        const eslintConfig = `
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    ignores: ['node_modules'],
    files: ['**/*.{ts,tsx}'],
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        react.configs.flat.recommended,
        importPlugin.flatConfigs.recommended,
        jsxA11y.flatConfigs.recommended,
        prettier
    ],
    languageOptions: {
        ecmaVersion: 'latest'
    },
    plugins: {
        'react-hooks': reactHooks
    },
    settings: {
        react: { version: 'detect' },
        'import/resolver': {
        typescript: { project: './tsconfig.json' }
        }
    },
    rules: {
        'no-console': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off'
    }
});
                `.trim();
        await fs.writeFile('eslint.config.js', eslintConfig, 'utf8');

        // Prettier config
        const prettierConfig = `
{
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "none",
    "printWidth": 120,
    "arrowParens": "always",
    "endOfLine": "auto"
}
                `.trim();
        await fs.writeFile('.prettierrc', prettierConfig, 'utf8');

        // Prettier Ignore
        const prettierIgnore = `
node_modules
public
                `.trim();
        await fs.writeFile('.prettierignore', prettierIgnore, 'utf8');

        // Package.json scripts
        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);

        packageJson.scripts = {
          ...packageJson.scripts,
          lint: 'eslint . --ext .ts,.tsx',
          format: 'prettier --write .'
        };

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        spinnerESLint.succeed('Prettier and ESLint configured.');
      } catch (error) {
        spinnerESLint.fail('Error setting up ESLint and Prettier.');
        console.error(error);
      }

      // Husky and lint-staged
      const spinnerHusky = ora('Setting up Husky and lint-staged...').start();
      try {
        await execa('pnpm', ['add', '-D', 'husky'], { stdio: 'inherit' });
        await execa('pnpm', ['exec', 'husky', 'init'], { stdio: 'inherit' });
        await execa('pnpm', ['add', '-D', 'lint-staged'], { stdio: 'inherit' });

        // Husky pre-commit hook
        const huskyHook = `
                    pnpm exec lint-staged
                `.trim();
        await fs.writeFile('.husky/pre-commit', huskyHook, { mode: 0o755 });

        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);

        packageJson['lint-staged'] = {
          '*/**/*.{ts,tsx}': ['eslint --fix', 'prettier --write']
        };

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        spinnerHusky.succeed('Husky and lint-staged configured.');
      } catch (error) {
        spinnerHusky.fail('Error installing Husky.');
        console.error(error);
      }

      // Add Aliases
      const spinnerAlias = ora('Setting up Vite aliases...').start();

      try {
        await execa('pnpm', ['add', '-D', 'vite-tsconfig-paths'], { stdio: 'inherit' });

        // vite.config.ts
        const viteConfig = `
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()]
});
                `.trim();
        await fs.writeFile('vite.config.ts', viteConfig, 'utf8');

        // tsconfig.app.json
        const tsconfigPath = path.join(targetDir, 'tsconfig.app.json');
        const tsconfigAppJson = `
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"]
    }

  },
  "include": ["src"]
} 
                `.trim();
        await fs.writeFile(tsconfigPath, tsconfigAppJson, 'utf8');

        spinnerAlias.succeed('Vite aliases configured.');
      } catch (error) {
        spinnerAlias.fail('Error setting up Vite aliases.');
        console.error(error);
      }

      console.log(`cd ${projectName}`);
      console.log('pnpm install');
      console.log('pnpm run dev');
      console.log('pnpm run lint');
      console.log('pnpm run format');
    } catch (error) {
      spinner.fail('Error initializing project.');
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
