#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { execa } from 'execa';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { eslintConfig } from './configs/eslintConfig';
import { huskyHookConfig } from './configs/huskyHookConfig';
import { prettierConfig } from './configs/prettierConfig';
import { prettierIgnoreConfig } from './configs/prettierIgonerConfig';
import { tsconfigAppJson } from './configs/tsconfigAppJson';
import { viteConfig } from './configs/viteConfig';
import { questions } from './questions';

const program = new Command();

const REQUIRED_KEYS = [
  'framework',
  'packageManager',
  'routing',
  'query',
  'forms',
  'stateManagement',
  'styling',
  'icons',
  'extras'
];

program.name('cli-frameworks-setup').description('Scaffold Vite + React + TS').version('1.0.0');

program
  .option('-v, --verbose', 'Show detailed output from package manager')
  .option('-q, --quiet', 'Suppress most output');

program
  .command('init <project-name>')
  .description('Initialize new project: Vite + React + TypeScript')
  .action(async (projectName) => {
    const responses = await questions;
    const { verbose } = program.opts();
    const { framework, packageManager, routing, query, forms, stateManagement, styling, icons, extras } = responses;

    // Let users know that Ctrl+C may not work in all terminals, and recommend using CMD or PowerShell for best results.
    if (REQUIRED_KEYS.some((key) => typeof responses[key as keyof typeof responses] === 'undefined')) {
      console.log('Process canceled by user.');
      process.exit(0);
    }

    const stdioSetting = verbose ? 'inherit' : 'pipe';
    const setEnabled = verbose ? '--verbose' : '--quiet';
    console.log(chalk.bold.blue(`\n${setEnabled} mode is enabled`));

    try {
      const targetDir = path.resolve(process.cwd(), projectName);

      if (fs.existsSync(targetDir)) {
        console.log(chalk.bold.red(`Catalog ${projectName} already exists!`));
        process.exit(1);
      }

      // Add framework
      if (framework === 'vite-react-ts') {
        // You can set stdio to 'inherit' to see the output in real-time
        await execa(packageManager, ['create', 'vite', projectName, '--template', 'react-ts'], { stdio: stdioSetting });
      } else if (framework === 'vue-ts') {
        await execa(packageManager, ['create', 'vite', projectName, '--template', 'vue-ts'], { stdio: stdioSetting });
      }

      process.chdir(targetDir);

      // Add routing
      if (routing.includes('react-router')) {
        const spinnerRouter = ora('Installing React Router...').start();

        try {
          await execa(packageManager, ['add', 'react-router'], { stdio: stdioSetting });
          spinnerRouter.succeed('React Router installed.');
        } catch (error) {
          spinnerRouter.fail('Error installing React Router.');
          console.error(error);
        }
      }

      // Add query
      if (query.includes('axios')) {
        const spinnerQuery = ora('Installing React Query...').start();

        try {
          await execa(packageManager, ['add', 'axios'], { stdio: stdioSetting });
          spinnerQuery.succeed('Axios installed.');
        } catch (error) {
          spinnerQuery.fail('Error installing React Query.');
          console.error(error);
        }
      } else if (query.includes('swr')) {
        const spinnerQuery = ora('Installing SWR...').start();

        try {
          await execa(packageManager, ['add', 'swr'], { stdio: stdioSetting });
          spinnerQuery.succeed('SWR installed.');
        } catch (error) {
          spinnerQuery.fail('Error installing SWR.');
          console.error(error);
        }
      } else if (query.includes('react-query')) {
        const spinnerQuery = ora('Installing React Query...').start();

        try {
          await execa(packageManager, ['add', '@tanstack/react-query'], { stdio: stdioSetting });
          spinnerQuery.succeed('React Query installed.');
        } catch (error) {
          spinnerQuery.fail('Error installing React Query.');
          console.error(error);
        }
      }

      // Add forms
      if (forms.includes('react-hook-form')) {
        const spinnerForms = ora('Installing React Hook Form...').start();

        try {
          await execa(packageManager, ['add', 'react-hook-form'], { stdio: stdioSetting });
          spinnerForms.succeed('React Hook Form installed.');
        } catch (error) {
          spinnerForms.fail('Error installing React Hook Form.');
          console.error(error);
        }
      } else if (forms.includes('formik')) {
        const spinnerForms = ora('Installing Formik...').start();

        try {
          await execa(packageManager, ['add', '-D', 'formik'], { stdio: stdioSetting });
          spinnerForms.succeed('Formik installed.');
        } catch (error) {
          spinnerForms.fail('Error installing Formik.');
          console.error(error);
        }
      }

      // Add state management
      if (stateManagement.includes('zustand')) {
        const spinnerStateManagement = ora('Installing Zustand...').start();

        try {
          await execa(packageManager, ['add', 'zustand'], { stdio: stdioSetting });
          spinnerStateManagement.succeed('Zustand installed.');
        } catch (error) {
          spinnerStateManagement.fail('Error installing Zustand.');
          console.error(error);
        }
      }

      // Add styling
      if (styling.includes('tailwindcss')) {
        const spnnerStyling = ora('Installing Tailwind CSS...').start();

        try {
          await execa(packageManager, ['add', 'tailwindcss', '@tailwindcss/vite'], { stdio: stdioSetting });
          spnnerStyling.succeed('Tailwind installed.');
        } catch (error) {
          spnnerStyling.fail('Error installing Tailwind CSS.');
          console.error(error);
        }
      } else if (styling.includes('sass')) {
        const spnnerStyling = ora('Installing SASS...').start();

        try {
          await execa(packageManager, ['add', 'sass'], { stdio: stdioSetting });
          spnnerStyling.succeed('SASS installed.');
        } catch (error) {
          spnnerStyling.fail('Error installing SASS.');
          console.error(error);
        }
      }

      // Add icons
      if (icons.includes('lucide-icons')) {
        const spinnerIcons = ora('Installing Lucide Icons...').start();

        try {
          await execa(packageManager, ['add', 'lucide-react'], { stdio: stdioSetting });
          spinnerIcons.succeed('Lucide Icons installed.');
        } catch (error) {
          spinnerIcons.fail('Error installing Lucide Icons.');
          console.error(error);
        }
      }

      // Add ESLint and Prettier
      if (extras.includes('eslint-prettier')) {
        const spinnerESLint = ora('Setting up ESLint and Prettier...').start();

        try {
          await execa(
            packageManager,
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
            { stdio: stdioSetting }
          );
          await execa(packageManager, ['rm', '-D', 'globals'], { stdio: stdioSetting });

          await fs.writeFile('eslint.config.js', eslintConfig, 'utf8');
          await fs.writeFile('.prettierrc', prettierConfig, 'utf8');
          await fs.writeFile('.prettierignore', prettierIgnoreConfig, 'utf8');

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
      }

      // Husky and lint-staged
      if (extras.includes('husky-lint-staged')) {
        const spinnerHusky = ora('Setting up Husky and lint-staged...').start();

        try {
          await execa(packageManager, ['add', '-D', 'husky'], { stdio: stdioSetting });
          await execa(packageManager, ['exec', 'husky', 'init'], { stdio: stdioSetting });
          await execa(packageManager, ['add', '-D', 'lint-staged'], { stdio: stdioSetting });

          await fs.writeFile('.husky/pre-commit', huskyHookConfig, { mode: 0o755 });

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
      }

      // Add Aliases
      if (extras.includes('vite-aliases')) {
        const spinnerAlias = ora('Setting up Vite aliases...').start();

        try {
          await execa(packageManager, ['add', '-D', 'vite-tsconfig-paths'], { stdio: stdioSetting });

          await fs.writeFile('vite.config.ts', viteConfig, 'utf8');

          // tsconfig.app.json
          const tsconfigPath = path.join(targetDir, 'tsconfig.app.json');
          await fs.writeFile(tsconfigPath, tsconfigAppJson, 'utf8');
          spinnerAlias.succeed('Vite aliases configured.');
        } catch (error) {
          spinnerAlias.fail('Error setting up Vite aliases.');
          console.error(error);
        }
      }

      // Add CLSX
      if (extras.includes('clsx')) {
        const spinnerCLSX = ora('Installing CLSX...').start();

        try {
          await execa(packageManager, ['add', '-D', 'clsx'], { stdio: stdioSetting });
          spinnerCLSX.succeed('CLSX installed.');
        } catch (error) {
          spinnerCLSX.fail('Error installing CLSX.');
          console.error(error);
        }
      }

      console.log(chalk.bold.green('\nProject initialized.'));

      const nodeModulesPath = path.join(targetDir, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        await fs.remove(nodeModulesPath);
        console.log(chalk.bold.yellow('\nRemoved node_modules to ensure a clean install for the user.'));
      }

      console.log(`\ncd ${projectName}`);
      console.log(`${packageManager} install`);
      console.log(`${packageManager} run dev`);
    } catch (error) {
      console.log(chalk.bold.red('\nError initializing project.'));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
