import { describe, expect, it } from 'vitest'
import { createTabsState } from './tabs.js'

// Minimal Alpine mock: $persist(value) returns a value with an .as() chain.
// For strings/primitives, .as() returns the primitive directly (simulating
// what Alpine's interceptor initialization would return).
const makePersisted = (value) => {
    if (typeof value !== 'object' || value === null) {
        return { as: () => value }
    }
    const obj = { ...value }
    obj.as = function () { return this }
    return obj
}
const Alpine = { $persist: makePersisted }

const pomodoroTabs = [
    { id: 'home', label: 'Home' },
    { id: 'archived', label: 'Archived' },
    { id: 'done', label: 'Done' },
    { id: 'configs', label: 'Configs' }
]

const emojiTabs = [
    { id: 'home', label: 'Home' }
]

describe('createTabsState', () => {
    it('sets active to defaultTab', () => {
        const state = createTabsState(Alpine, { defaultTab: 'home', tabItems: pomodoroTabs, key: 'pomodoro' })
        expect(state.active).toBe('home')
    })

    it('exposes the provided tabItems on items', () => {
        const state = createTabsState(Alpine, { defaultTab: 'home', tabItems: pomodoroTabs, key: 'pomodoro' })
        expect(state.items).toBe(pomodoroTabs)
    })

    it('persists only the active tab ID, not the items array', () => {
        // With the new approach, .as() on a string $persist returns the string directly.
        // Items are never stored in the persisted state.
        const state = createTabsState(Alpine, { defaultTab: 'home', tabItems: emojiTabs, key: 'emoji-remover' })
        // active is the raw persisted value (string in tests via mock)
        expect(state.active).toBe('home')
        // items come directly from tabItems, never from persistence
        expect(state.items).toBe(emojiTabs)
    })

    it('two apps with different keys get independent state', () => {
        const pomodoroState = createTabsState(Alpine, { defaultTab: 'home', tabItems: pomodoroTabs, key: 'pomodoro' })
        const emojiState = createTabsState(Alpine, { defaultTab: 'home', tabItems: emojiTabs, key: 'emoji-remover' })

        expect(pomodoroState.items.map(t => t.id)).toEqual(['home', 'archived', 'done', 'configs'])
        expect(emojiState.items.map(t => t.id)).toEqual(['home'])
    })

    it('active tab can be changed', () => {
        const state = createTabsState(Alpine, { defaultTab: 'home', tabItems: pomodoroTabs, key: 'pomodoro' })
        state.active = 'archived'
        expect(state.active).toBe('archived')
    })

    it('without persist returns plain object with defaultTab', () => {
        const state = createTabsState(Alpine, { defaultTab: 'done', tabItems: pomodoroTabs, persist: false, key: 'pomodoro' })
        expect(state.active).toBe('done')
        expect(state.items).toBe(pomodoroTabs)
    })

    it('without $persist function falls back gracefully', () => {
        const NoPeristAlpine = {}
        const state = createTabsState(NoPeristAlpine, { defaultTab: 'home', tabItems: pomodoroTabs, persist: true, key: 'pomodoro' })
        expect(state.active).toBe('home')
        expect(state.items).toBe(pomodoroTabs)
    })
})
