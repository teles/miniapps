import { createTabsState } from '../components/index.js'

export default function createMiniappShell(Alpine, { defaultTab, tabItems, key }) {
    return {
        tabs: createTabsState(Alpine, {
            defaultTab,
            tabItems,
            persist: true,
            key
        })
    }
}
