import prompts from 'prompts';

export const questions = prompts([
  {
    type: 'select',
    name: 'framework',
    message: 'Select a framework',
    choices: [
      { title: 'Vite + React + TypeScript', value: 'vite-react-ts' },
      { title: 'Vue + TypeScript', value: 'vue-ts' }
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
      { title: 'deno', value: 'deno' }
    ],
    initial: 2
  },
  // For each of the following, we need to hide options which are reserved for a specific framework. E.g. React Router should not be available for Vue
  {
    type: 'select',
    name: 'routing',
    message: 'Select a routing library',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'React Router', value: 'react-router' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'query',
    message: 'Select a data fetching library',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'Axios', value: 'axios' },
      { title: 'SWR', value: 'swr' },
      { title: 'React Query', value: 'react-query' }
    ],
    initial: 1
  },
  {
    type: 'select',
    name: 'forms',
    message: 'Select a forms library',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'React Hook Form', value: 'react-hook-form' },
      { title: 'Formik', value: 'formik' }
    ],
    initial: 0
  },
  {
    type: 'select',
    name: 'stateManagement',
    message: 'Select a state management library',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'Zustand', value: 'zustand' }
    ],
    initial: 1
  },
  {
    type: 'select',
    name: 'styling',
    message: 'Select a styling solution',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'Tailwind CSS', value: 'tailwindcss' }, // Extended installation steps needed
      { title: 'SASS/SCSS', value: 'sass' }
    ],
    initial: 2
  },
  {
    type: 'select',
    name: 'icons',
    message: 'Select an icon library',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'Lucide', value: 'lucide-icons' } // Different package names for react and vue
    ],
    initial: 1
  },
  // For extras we need to disable the "Skip" option if any other option is selected and vice versa
  {
    type: 'multiselect',
    name: 'extras',
    message: 'Select extra tools to include',
    choices: [
      { title: 'Skip', value: '' },
      { title: 'ESLint + Prettier', value: 'eslint-prettier', selected: true },
      { title: 'Husky + lint-staged', value: 'husky-lint-staged', selected: true },
      { title: 'Vite aliases', value: 'vite-aliases', selected: true },
      { title: 'CLSX', value: 'clsx', selected: true }
    ]
  }
]);
