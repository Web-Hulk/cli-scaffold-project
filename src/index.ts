#!/usr/bin/env node
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

program
    .name('cli-frameworks-setup')
    .description('Scaffold Vite + React + TS')
    .version('1.0.0');

program
    .command("init <project-name>")
    .description("Initialize new project: Vite + React + TypeScript")
    .action(async (projectName) => {
        const responses = await questions;
        console.log('Responses: ', responses);

        const { framework, packageManager, extras } = responses;
        const spinner = ora(`Initializing project ${projectName}`).start();

        try {
            const targetDir = path.resolve(process.cwd(), projectName);

            if (fs.existsSync(targetDir)) {
                spinner.fail(`Catalog ${projectName} already exists!`);
                process.exit(1);
            }

            if (framework === 'vite-react-ts') {
                await execa(packageManager, ["create", "vite", projectName, "--template", "react-ts"], { stdio: 'inherit'});
            } else if (framework === 'vue-ts') {
                 await execa(packageManager, ["create", "vite", projectName, "--template", "vue-ts"], { stdio: 'inherit'});
            }

            spinner.succeed('Project initialized.');

            process.chdir(targetDir);

            if (extras.includes('eslint-prettier')) {
                // Add ESLint and Prettier
                const spinnerESLint = ora('Setting up ESLint and Prettier...').start();
                try {
                    await execa(packageManager, [
                        "add", "-D",
                        "eslint",
                        "eslint-config-prettier",
                        "eslint-import-resolver-typescript",
                        "eslint-plugin-import",
                        "eslint-plugin-jsx-a11y",
                        "eslint-plugin-prettier",
                        "eslint-plugin-react",
                        "eslint-plugin-react-hooks",
                        "eslint-plugin-react-refresh",
                        "@eslint/js",
                        "prettier",
                        "typescript-eslint",
                        "@typescript-eslint/eslint-plugin",
                        "@typescript-eslint/parser", 
                    ], {stdio: 'inherit'});
                    await execa(packageManager, ["rm", "-D", "globals"], {stdio: 'inherit'});

                    await fs.writeFile('eslint.config.js', eslintConfig, 'utf8');
                    await fs.writeFile(".prettierrc", prettierConfig, "utf8");
                    await fs.writeFile(".prettierignore", prettierIgnoreConfig, "utf8")

                    // Package.json scripts
                    const packageJsonPath = path.join(targetDir, 'package.json');
                    const packageJson = await fs.readJson(packageJsonPath);

                    packageJson.scripts = {
                        ...packageJson.scripts,
                        "lint": "eslint . --ext .ts,.tsx",
                        "format": "prettier --write .",
                    }

                    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
                    spinnerESLint.succeed('Prettier and ESLint configured.');
                } catch (error) {
                    spinnerESLint.fail("Error setting up ESLint and Prettier.");
                    console.error(error);
                }
            } 
            
            if (extras.includes('husky-lint-staged')) {
                // Husky and lint-staged
                const spinnerHusky = ora('Setting up Husky and lint-staged...').start();
                try {
                    await execa(packageManager, ["add", "-D", "husky"], { stdio: 'inherit' });
                    await execa(packageManager, ["exec", "husky", "init"], { stdio: 'inherit' });
                    await execa(packageManager, ["add", "-D", "lint-staged"], { stdio: 'inherit' });
    
                    await fs.writeFile(".husky/pre-commit", huskyHookConfig, { mode: 0o755 });
    
                    const packageJsonPath = path.join(targetDir, 'package.json');
                    const packageJson = await fs.readJson(packageJsonPath);
    
                    packageJson['lint-staged'] = {
                        "*/**/*.{ts,tsx}": [
                            "eslint --fix",
                            "prettier --write"
                        ]
                    }
    
                    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
                    spinnerHusky.succeed('Husky and lint-staged configured.');
                } catch (error) {
                    spinnerHusky.fail("Error installing Husky.");
                    console.error(error);
                }
            } 
            
            if (extras.includes('vite-aliases')) {
                // Add Aliases
                const spinnerAlias = ora("Setting up Vite aliases...").start();
    
                try {
                    await execa(packageManager, ["add", "-D", "vite-tsconfig-paths"], { stdio: 'inherit' });
                    
                    await fs.writeFile("vite.config.ts", viteConfig, "utf8");
    
                    // tsconfig.app.json
                    const tsconfigPath = path.join(targetDir, 'tsconfig.app.json')
                    await fs.writeFile(tsconfigPath, tsconfigAppJson, 'utf8');
                    spinnerAlias.succeed("Vite aliases configured.");
                } catch (error) {
                    spinnerAlias.fail("Error setting up Vite aliases.");
                    console.error(error);
                }
            }

            if (extras.includes('clsx')) {
                const spinnerCLSX = ora('Installing CLSX...').start();

                try {
                    await execa(packageManager, ["add", "-D", "clsx"], { stdio: 'inherit' });
                    spinnerCLSX.succeed('CLSX installed.');
                } catch (error) {
                    spinnerCLSX.fail("Error installing CLSX.");
                    console.error(error);
                }
            }

            console.log(`cd ${projectName}`);
            console.log(`${packageManager} install`);
            console.log(`${packageManager} run dev`);
        } catch (error) {
            spinner.fail("Error initializing project.");
            console.error(error);
            process.exit(1);
        }
    })

program.parse(process.argv);