import prompts from "prompts";

export const questions = prompts([
    {
        type: 'select',
        name: 'framework',
        message: 'Select a framework',
        choices: [
            {title: 'Vite + React + TypeScript', value: 'vite-react-ts' },
            {title: 'Vue + TypeScript', value: 'vue-ts' },
        ],
        initial: 0
    },
    {
        type: 'select',
        name: 'packageManager',
        message: 'Select a package manager',
        choices: [
            { title: 'npm', value: 'npm' },
            { title: 'yarn', value: 'yarn' },
            { title: 'pnpm', value: 'pnpm' },
            { title: 'bun', value: 'bun' },
            { title: 'deno', value: 'deno' },
        ],
        initial: 2
    },
    {
        type: 'multiselect',
        name: 'extras',
        message: 'Select extra tools to include',
        choices: [
            { title: 'ESLint + Prettier', value: 'eslint-prettier' },
            { title: 'Husky + lint-staged', value: 'husky-lint-staged' },
            { title: 'Vite aliases', value: 'vite-aliases' },
            // Tailwind
            // CLSX
            { title: 'CLSX', value: 'clsx' },
            // Axios
            // React Router
        ]
    }
]);