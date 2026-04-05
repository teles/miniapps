import { describe, expect, it } from 'vitest'
import pomodoroCore from './app.js'

const makePersistedValue = (value) => {
    if (typeof value !== 'object' || value === null) {
        return { as: () => value }
    }
    if (Array.isArray(value)) return value
    const obj = { ...value }
    obj.as = function () { return this }
    return obj
}

const AlpineMocked = {
    $persist: makePersistedValue
}

describe('pomodoro core', () => {
    it('should expose home, archived, done and configs tabs', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        const tabIds = pomodoro.tabs.items.map((tab) => tab.id)

        expect(tabIds).toEqual(['home', 'archived', 'done', 'configs'])
    })

    it('adds pomodoros only when text is not empty', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        const initialLength = pomodoro.pomodoros.length

        pomodoro.new_pomodoro_text = '  '
        pomodoro.add()
        expect(pomodoro.pomodoros.length).toBe(initialLength)

        pomodoro.new_pomodoro_text = 'Valid task'
        pomodoro.add()
        expect(pomodoro.pomodoros.length).toBe(initialLength + 1)
    })

    it('archives a pomodoro from home action instead of deleting it', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        pomodoro.new_pomodoro_text = 'Archive me'
        pomodoro.add()

        const beforeHome = pomodoro.pomodoros.length
        const beforeArchived = pomodoro.pomodoros_archived.length
        const target = pomodoro.pomodoros.find((item) => item.text === 'Archive me')

        pomodoro.handle_button_timer_click(target, 'archive')

        expect(pomodoro.pomodoros.length).toBe(beforeHome - 1)
        expect(pomodoro.pomodoros_archived.length).toBe(beforeArchived + 1)
        expect(pomodoro.pomodoros_archived.some((item) => item.text === 'Archive me')).toBe(true)
    })

    it('restores and deletes pomodoros from archived tab', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        pomodoro.new_pomodoro_text = 'To restore'
        pomodoro.add()
        pomodoro.new_pomodoro_text = 'To delete'
        pomodoro.add()

        pomodoro.handle_button_timer_click(
            pomodoro.pomodoros.find((item) => item.text === 'To restore'),
            'archive'
        )
        pomodoro.handle_button_timer_click(
            pomodoro.pomodoros.find((item) => item.text === 'To delete'),
            'archive'
        )

        const archivedToRestore = pomodoro.pomodoros_archived.find((item) => item.text === 'To restore')
        const archivedToDelete = pomodoro.pomodoros_archived.find((item) => item.text === 'To delete')

        pomodoro.restore_archived(archivedToRestore)
        pomodoro.delete_archived(archivedToDelete)

        expect(pomodoro.pomodoros.some((item) => item.text === 'To restore')).toBe(true)
        expect(pomodoro.pomodoros_archived.some((item) => item.text === 'To restore')).toBe(false)
        expect(pomodoro.pomodoros_archived.some((item) => item.text === 'To delete')).toBe(false)
        expect(pomodoro.pomodoros.some((item) => item.text === 'To delete')).toBe(false)
    })

    it('moves pomodoro to done when break is finished and timer is clicked', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        pomodoro.new_pomodoro_text = 'Finish me'
        pomodoro.add()

        const task = pomodoro.pomodoros.find((item) => item.text === 'Finish me')
        pomodoro.shared.transition_pomodoro(task, 'breaking_finished')

        pomodoro.handle_timer_click(task)

        expect(pomodoro.pomodoros.some((item) => item.text === 'Finish me')).toBe(false)
        expect(pomodoro.pomodoros_done.some((item) => item.text === 'Finish me')).toBe(true)

        const doneTask = pomodoro.pomodoros_done.find((item) => item.text === 'Finish me')
        expect(doneTask.stage).toBe('done')
        expect(doneTask.state).toBe('done')
    })

    it('keeps a stable render key while editing text', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        pomodoro.new_pomodoro_text = 'Editable task'
        pomodoro.add()

        const item = pomodoro.pomodoros.find((entry) => entry.text === 'Editable task')
        const keyBefore = pomodoro.get_pomodoro_key(item, 0)

        item.text = 'Editable task updated'
        const keyAfter = pomodoro.get_pomodoro_key(item, 0)

        expect(keyAfter).toBe(keyBefore)
    })

    it('generates unique stable keys for legacy pomodoros without id', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        const sameTimestamp = '2026-04-05T20:00:00.000Z'
        const itemA = { text: 'Legacy A', stage: 'focus_paused', started_at: sameTimestamp }
        const itemB = { text: 'Legacy B', stage: 'focus_paused', started_at: sameTimestamp }

        pomodoro.pomodoros = [itemA, itemB]

        const keyA = pomodoro.get_pomodoro_key(itemA, 0)
        const keyB = pomodoro.get_pomodoro_key(itemB, 1)

        expect(keyA).not.toBe(keyB)
        expect(pomodoro.get_pomodoro_key(itemA, 0)).toBe(keyA)
        expect(pomodoro.get_pomodoro_key(itemB, 1)).toBe(keyB)
    })

    it('filters invalid entries from visible pomodoros', () => {
        const pomodoro = pomodoroCore(AlpineMocked)
        pomodoro.pomodoros = [
            null,
            undefined,
            'invalid',
            { text: 'Valid item', stage: 'focus_paused' }
        ]

        const visible = pomodoro.get_visible_pomodoros()

        expect(visible).toHaveLength(1)
        expect(visible[0].text).toBe('Valid item')
    })
})
