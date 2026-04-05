export const TABS_CLASSES = {
    header: 'text-sm font-medium text-center text-gray-500 border-b border-gray-200',
    list: 'flex flex-wrap -mb-px',
    item: 'mr-2 flex',
    trigger: 'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer',
    active: 'text-blue-600 border-blue-600 active',
    inactive: 'border-transparent hover:text-gray-600 hover:border-gray-300'
}

export function createTabsState(Alpine, { defaultTab, tabItems, persist = true }) {
    if (!persist) {
        return {
            active: defaultTab,
            items: tabItems
        }
    }

    const state = Alpine.$persist({
        active: defaultTab
    })

    state.items = tabItems

    if (!tabItems.some((tab) => tab.id === state.active)) {
        state.active = defaultTab
    }

    return state
}

export default TABS_CLASSES
