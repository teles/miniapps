/** @type {import('@storybook/html-vite').StorybookConfig} */
const config = {
  stories: ['../src/packages/design-system/stories/**/*.stories.js'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}

export default config
