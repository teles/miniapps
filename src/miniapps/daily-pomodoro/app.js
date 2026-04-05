import {
    BUTTON_CLASSES,
    MODAL_CLASSES,
    TABS_CLASSES,
    TOOLTIP_CLASSES,
    createMiniappShell
} from '../../packages/design-system/index.js'
import createPomodoroSharedContext from './shared-context.js'
import createPomodoroTabs from './tabs/index.js'

export default function (Alpine) {
    const tabControllers = createPomodoroTabs()

    return {
        shell: createMiniappShell(Alpine, {
            defaultTab: 'home',
            tabItems: tabControllers.items
        }),
        shared: createPomodoroSharedContext(Alpine),
        design_system: {
            button: BUTTON_CLASSES,
            tabs: TABS_CLASSES,
            modal: MODAL_CLASSES,
            tooltip: TOOLTIP_CLASSES
        },
        tab_controllers: tabControllers,
        tab_state: {
            home: tabControllers.home.state,
            archived: tabControllers.archived.state,
            done: tabControllers.done.state,
            configs: tabControllers.configs.state
        },
        _timer_targets: new WeakSet(),
        get tabs() {
            return this.shell.tabs
        },
        get icons() {
            return this.shared.icons
        },
        get stages() {
            return this.shared.stages
        },
        get stages_map() {
            return this.shared.stages_map
        },
        get configs() {
            return this.shared.configs
        },
        get modal() {
            return this.shared.modal
        },
        get pomodoros() {
            return this.shared.pomodoros
        },
        set pomodoros(value) {
            this.shared.pomodoros = value
        },
        get pomodoros_archived() {
            return this.shared.pomodoros_archived
        },
        set pomodoros_archived(value) {
            this.shared.pomodoros_archived = value
        },
        get pomodoros_done() {
            return this.shared.pomodoros_done
        },
        set pomodoros_done(value) {
            this.shared.pomodoros_done = value
        },
        get today_count() {
            return this.shared.get_today_count()
        },
        get new_pomodoro_text() {
            return this.tab_state.home.new_pomodoro_text
        },
        set new_pomodoro_text(value) {
            this.tab_state.home.new_pomodoro_text = value
        },
        get new_pomodoro_placeholder() {
            return this.shared.new_pomodoro_placeholder
        },
        get_stage_by_pomodoro(pomodoro) {
            return this.shared.get_stage_by_pomodoro(pomodoro)
        },
        open_modal(modal) {
            this.shared.open_modal(modal)
        },
        close_modal() {
            this.shared.close_modal()
        },
        register_interval(id) {
            this.shared.register_interval(id)
        },
        add() {
            this.tab_controllers.home.add(this)
        },
        remove(pomodoro) {
            this.shared.remove(pomodoro)
        },
        archive(pomodoro) {
            this.shared.archive_pomodoro(pomodoro)
        },
        restore_archived(pomodoro) {
            this.tab_controllers.archived.restore(this, pomodoro)
        },
        delete_archived(pomodoro) {
            this.tab_controllers.archived.delete(this, pomodoro)
        },
        handle_timer_click(pomodoro) {
            this.tab_controllers.home.handle_timer_click(this, pomodoro)
        },
        handle_button_timer_click(pomodoro, buttonName) {
            this.tab_controllers.home.handle_button_timer_click(this, pomodoro, buttonName)
        },
        countdown(pomodoro) {
            this.tab_controllers.home.countdown(this, pomodoro)
        },
        update_state(desiredState, pomodoro) {
            this.tab_controllers.home.update_state(this, desiredState, pomodoro)
        },
        is_home_tab() {
            return this.tabs.active === 'home'
        },
        is_archived_tab() {
            return this.tabs.active === 'archived'
        },
        get_visible_pomodoros() {
            return this.is_archived_tab() ? this.pomodoros_archived : this.pomodoros
        },
        get_pomodoro_key(pomodoro, index = 0) {
            if (!pomodoro || typeof pomodoro !== 'object') {
                return `pomodoro-${index}`
            }

            if (!pomodoro._ui_key) {
                const baseKey = pomodoro.id
                    || pomodoro.started_at
                    || pomodoro.archived_at
                    || pomodoro.done_at
                    || `idx-${index}`

                pomodoro._ui_key = `pomodoro-${String(baseKey)}`
            }

            return pomodoro._ui_key
        },
        get_pomodoro_order_class(pomodoro) {
            if (this.is_archived_tab()) {
                return 'order-2'
            }

            const stage = this.stages_map[pomodoro.stage]
            if (stage && stage.state === 'running' && this.configs.running_first) {
                return 'order-1'
            }

            return 'order-2'
        },
        get_pomodoro_base_class(pomodoro) {
            if (this.is_archived_tab()) {
                return 'bg-amber-50 border-amber-200 text-amber-600'
            }

            const stage = this.stages_map[pomodoro.stage]
            return stage ? stage.styles.base : 'bg-gray-50 border-gray-200 text-gray-500'
        },
        format_seconds(seconds) {
            const safeSeconds = Math.max(0, Number(seconds) || 0)
            const minutes = Math.floor(safeSeconds / 60)
            const remainingSeconds = safeSeconds % 60
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
        },
        format_timestamp(value) {
            if (!value) {
                return '--:--'
            }

            return new Date(value).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        get_timer_tooltip(pomodoro) {
            const stage = this.get_stage_by_pomodoro(pomodoro)
            if (!stage) {
                return 'Toggle timer'
            }

            return stage.state === 'running' ? 'Pause timer' : 'Start timer'
        },
        get_home_action_tooltip(pomodoro) {
            const stage = this.get_stage_by_pomodoro(pomodoro)
            if (!stage) {
                return 'Archive pomodoro'
            }

            return stage.button === 'archive' ? 'Archive pomodoro' : 'Remove pomodoro'
        },
        ensure_timer_interval(pomodoro) {
            if (typeof window === 'undefined' || !pomodoro || typeof pomodoro !== 'object') {
                return
            }

            if (this._timer_targets.has(pomodoro)) {
                return
            }

            const intervalId = window.setInterval(() => {
                this.countdown(pomodoro)
            }, 1_000)

            this.register_interval(intervalId)
            this._timer_targets.add(pomodoro)
        }
    }
}
