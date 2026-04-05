export const TABS_CLASSES = {
    header: 'text-sm font-medium text-center text-[#6F6E69] border-b border-[#CECDC3]',
    list: 'flex flex-wrap -mb-px',
    item: 'mr-2 flex',
    trigger: 'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer',
    active: 'text-[#205EA6] border-[#205EA6] active',
    inactive: 'border-transparent hover:text-[#575653] hover:border-[#B7B5AC]'
}

export function createTabsState(Alpine, { defaultTab, tabItems, persist = true, key }) {
    if (!persist || typeof Alpine?.$persist !== 'function') {
        return {
            active: defaultTab,
            items: tabItems
        }
    }

    // Persist only the active tab ID (a string) — never persist the items array.
    // Alpine's initInterceptors processes `active` in-place, replacing the interceptor
    // with the persisted string value while leaving `items` untouched.
    const persistedActive = Alpine.$persist(defaultTab).as(key + '_active_tab')

    return {
        active: persistedActive,
        items: tabItems
    }
}

export default TABS_CLASSES
