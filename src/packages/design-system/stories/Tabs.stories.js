import { TABS_CLASSES } from '../components/index.js'

export default {
  title: 'Design System/Tabs',
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['home', 'archived', 'settings']
    }
  },
  render: ({ activeTab }) => {
    const item = (id, label) => {
      const stateClass = activeTab === id ? TABS_CLASSES.active : TABS_CLASSES.inactive
      return `<li class="${TABS_CLASSES.item}"><span class="${TABS_CLASSES.trigger} ${stateClass}">${label}</span></li>`
    }

    return `
      <header class="${TABS_CLASSES.header}">
        <ul class="${TABS_CLASSES.list}">
          ${item('home', 'Home')}
          ${item('archived', 'Archived')}
          ${item('settings', 'Settings')}
        </ul>
      </header>
    `
  }
}

export const Playground = {
  args: {
    activeTab: 'home'
  }
}
