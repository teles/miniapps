import {
    createModalState,
    createOpenedModalState,
    DESIGN_SYSTEM_COLORS,
    DESIGN_SYSTEM_ICONS
} from '../../packages/design-system/index.js'

const stageDefinitions = [
    {
        name: 'focus_paused',
        styles: {
            base: 'bg-gray-50 border-gray-200 text-gray-500',
            progress_bg: 'bg-gray-100',
            progress_bar: 'bg-gray-500',
            timer_action: 'bg-gray-500',
            timer: 'bg-gray-400 text-gray-100'
        },
        state: 'paused',
        cycle: 'focus',
        on_timer_click: 'focus_running',
        button: 'archive'
    },
    {
        name: 'focus_running',
        styles: {
            base: 'bg-yellow-50 border-yellow-200 text-yellow-500',
            progress_bg: 'bg-yellow-100',
            progress_bar: 'bg-yellow-500',
            timer_action: 'bg-yellow-500',
            timer: 'bg-yellow-400 text-yellow-100'
        },
        state: 'running',
        cycle: 'focus',
        on_timer_click: 'focus_paused',
        on_timer_click_away: 'focus_paused',
        on_countdown: 'focus_finished',
        button: 'archive'
    },
    {
        name: 'focus_finished',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        state: 'paused',
        cycle: 'focus',
        on_timer_click: 'breaking_running',
        button: 'archive'
    },
    {
        name: 'breaking_running',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        state: 'running',
        cycle: 'breaking',
        on_timer_click_away: 'breaking_paused',
        on_timer_click: 'breaking_paused',
        on_countdown: 'breaking_finished',
        button: 'archive'
    },
    {
        name: 'breaking_paused',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        state: 'paused',
        cycle: 'breaking',
        on_timer_click: 'breaking_running',
        on_countdown: 'breaking_finished',
        button: 'archive'
    },
    {
        name: 'breaking_finished',
        styles: {
            base: 'bg-green-50 border-green-200 text-green-500',
            progress_bg: 'bg-green-100',
            progress_bar: 'bg-green-500',
            timer_action: 'bg-green-500',
            timer: 'bg-green-400 text-green-100'
        },
        state: 'paused',
        cycle: 'breaking',
        on_timer_click: 'done',
        button: 'archive'
    },
    {
        name: 'archived',
        styles: {
            base: 'bg-green-50 border-green-200 text-green-500',
            progress_bg: 'bg-green-100',
            progress_bar: 'bg-green-500',
            timer_action: 'bg-green-500',
            timer: 'bg-green-400 text-green-100'
        },
        state: 'paused',
        cycle: 'focus',
        on_timer_click: 'done',
        button: 'archive'
    }
]

const secondsFocus = 25 * 60
const secondsBreaking = 5 * 60

const todayKey = () => new Date().toDateString()

const createStages = () => stageDefinitions.map((definition) => {
    const stage = {
        ...definition,
        styles: { ...definition.styles }
    }

    const appendix = {
        timer_icon: {
            paused: 'play',
            running: 'pause'
        }[stage.state],
        timer_property: {
            focus: 'time_left',
            breaking: 'breaking_left'
        }[stage.cycle],
        timer_initial: {
            focus: secondsFocus,
            breaking: secondsBreaking
        }[stage.cycle],
        button_style: {
            archive: 'bg-amber-500',
            remove: 'bg-red-500'
        }[stage.button],
        button_callback: {
            archive: 'archive',
            remove: 'remove'
        }[stage.button],
        button_icon: {
            archive: 'archive',
            remove: 'trash'
        }[stage.button]
    }

    stage.styles = { ...stage.styles, button: appendix.button_style || 'bg-amber-500' }

    return {
        ...stage,
        ...appendix
    }
})

export default function createPomodoroSharedContext(Alpine) {
    const stages = createStages()
    const stagesMap = stages.reduce((total, stage) => {
        total[stage.name] = stage
        return total
    }, {})

    const getStageByName = (stageName) => stagesMap[stageName]
    const getStageState = (stageName) => {
        const stage = getStageByName(stageName)
        return stage ? stage.state : 'paused'
    }

    const getPausedStageName = (stageName) => {
        const stage = getStageByName(stageName)
        if (!stage) {
            return 'focus_paused'
        }

        if (stage.state !== 'running') {
            return stage.name
        }

        return stage.cycle === 'breaking' ? 'breaking_paused' : 'focus_paused'
    }

    const buildPomodoro = (text, stageName = 'focus_paused') => ({
        text,
        stage: stageName,
        state: getStageState(stageName),
        is_editing: false,
        time_left: secondsFocus,
        breaking_left: secondsBreaking,
        started_at: new Date(),
        finished_at: null
    })

    return {
        icons: DESIGN_SYSTEM_ICONS,
        theme_colors: DESIGN_SYSTEM_COLORS,
        stages,
        stages_map: stagesMap,
        configs: Alpine.$persist({
            running_first: false,
            start_anytime: true
        }),
        daily_count: Alpine.$persist({
            date: todayKey(),
            count: 0
        }),
        modal: createModalState(),
        pomodoros: Alpine.$persist([
            buildPomodoro('Buy tomatos', 'focus_paused'),
            buildPomodoro('Defeat Thanos and save the entire universe', 'focus_paused'),
            buildPomodoro('Wash dishes', 'focus_paused')
        ]),
        pomodoros_archived: Alpine.$persist([]),
        pomodoros_done: Alpine.$persist([]),
        _intervals: [],
        new_pomodoro_placeholder: 'Something you can do in a pomodoro',
        get_stage_by_pomodoro(pomodoro) {
            return getStageByName(pomodoro.stage)
        },
        get_stage_state(stageName) {
            return getStageState(stageName)
        },
        build_pomodoro(text, stageName = 'focus_paused') {
            return buildPomodoro(text, stageName)
        },
        transition_pomodoro(pomodoro, nextStageName) {
            pomodoro.stage = nextStageName
            pomodoro.state = getStageState(nextStageName)
        },
        pause_other_running_pomodoros(activePomodoro) {
            this.pomodoros
                .filter((item) => item !== activePomodoro)
                .forEach((item) => {
                    const stage = this.get_stage_by_pomodoro(item)
                    const nextStageName = stage.on_timer_click_away || item.stage
                    this.transition_pomodoro(item, nextStageName)
                })
        },
        mark_pomodoro_done(pomodoro) {
            const donePomodoro = {
                ...pomodoro,
                stage: 'done',
                state: 'done',
                is_editing: false,
                finished_at: new Date(),
                done_at: new Date()
            }

            this.pomodoros_done.push(donePomodoro)
            this.pomodoros = this.pomodoros.filter((item) => item !== pomodoro)
        },
        archive_pomodoro(pomodoro) {
            const archivedPomodoro = {
                ...pomodoro,
                stage: getPausedStageName(pomodoro.stage),
                state: 'paused',
                is_editing: false,
                archived_at: new Date()
            }

            this.pomodoros_archived.push(archivedPomodoro)
            this.pomodoros = this.pomodoros.filter((item) => item !== pomodoro)
        },
        restore_archived_pomodoro(pomodoro) {
            const restoredPomodoro = {
                ...pomodoro,
                stage: getPausedStageName(pomodoro.stage),
                state: 'paused',
                is_editing: false
            }

            delete restoredPomodoro.archived_at

            this.pomodoros.push(restoredPomodoro)
            this.pomodoros_archived = this.pomodoros_archived.filter((item) => item !== pomodoro)
        },
        delete_archived_pomodoro(pomodoro) {
            this.pomodoros_archived = this.pomodoros_archived.filter((item) => item !== pomodoro)
        },
        remove(pomodoro) {
            const stage = this.get_stage_by_pomodoro(pomodoro)
            if (stage && stage.state === 'paused') {
                this.pomodoros = this.pomodoros.filter((item) => item !== pomodoro)
            }
        },
        register_interval(id) {
            this._intervals.push(id)
        },
        open_modal(modal = {}) {
            this.modal = createOpenedModalState(modal, () => this.close_modal())
        },
        close_modal() {
            this.modal = createModalState()
        },
        get_today_count() {
            if (this.daily_count.date !== todayKey()) {
                this.daily_count.date = todayKey()
                this.daily_count.count = 0
            }
            return this.daily_count.count
        },
        increment_daily_count() {
            if (this.daily_count.date !== todayKey()) {
                this.daily_count.date = todayKey()
                this.daily_count.count = 0
            }
            this.daily_count.count++
        },
        notify(title, body) {
            if (typeof window === 'undefined' || !('Notification' in window)) {
                return
            }

            const send = () => new Notification(title, { body })

            if (Notification.permission === 'granted') {
                send()
                return
            }

            if (Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        send()
                    }
                })
            }
        }
    }
}
