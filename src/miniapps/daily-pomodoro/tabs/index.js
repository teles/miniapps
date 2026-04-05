function createHomeTab() {
    return {
        meta: {
            id: 'home',
            label: 'Home',
            is_blinking: false
        },
        state: {
            new_pomodoro_text: ''
        },
        add(app) {
            const text = this.state.new_pomodoro_text.trim()
            if (text.length > 0) {
                app.shared.pomodoros.push(app.shared.build_pomodoro(text, 'focus_paused'))
            }
            this.state.new_pomodoro_text = ''
        },
        handle_timer_click(app, pomodoro) {
            const currentStage = app.shared.get_stage_by_pomodoro(pomodoro)
            if (!currentStage) {
                return
            }

            const nextStage = currentStage.on_timer_click || pomodoro.stage

            if (!app.shared.configs.start_anytime && nextStage === 'focus_running') {
                const alreadyRunning = app.shared.pomodoros.some(
                    (item) => item !== pomodoro && app.shared.get_stage_by_pomodoro(item).state === 'running'
                )
                if (alreadyRunning) {
                    return
                }
            }

            app.shared.pause_other_running_pomodoros(pomodoro)

            if (nextStage === 'archived') {
                app.shared.archive_pomodoro(pomodoro)
                return
            }

            if (nextStage === 'done') {
                app.shared.mark_pomodoro_done(pomodoro)
                return
            }

            app.shared.transition_pomodoro(pomodoro, nextStage)
        },
        handle_button_timer_click(app, pomodoro, buttonName) {
            const actions = {
                archive: (item) => app.shared.archive_pomodoro(item),
                remove: (item) => app.shared.remove(item)
            }
            const callback = actions[buttonName]
            if (callback) {
                callback(pomodoro)
            }
        },
        countdown(app, pomodoro) {
            const stage = app.shared.get_stage_by_pomodoro(pomodoro)
            if (!stage || stage.state !== 'running') {
                return
            }

            if (pomodoro[stage.timer_property] > 0) {
                pomodoro[stage.timer_property]--
                return
            }

            const isFocusDone = stage.name === 'focus_running'
            app.shared.notify(
                isFocusDone ? '🍅 Focus session done!' : '☕ Break over!',
                pomodoro.text
            )

            if (isFocusDone) {
                app.shared.increment_daily_count()
            }

            app.shared.open_modal({
                title: pomodoro.text,
                confirm_label: 'Go to next stage',
                cancel_label: 'Cancel',
                on_confirm: () => {
                    const nextStage = stage.on_countdown || pomodoro.stage
                    if (nextStage === 'archived') {
                        app.shared.archive_pomodoro(pomodoro)
                        return
                    }
                    if (nextStage === 'done') {
                        app.shared.mark_pomodoro_done(pomodoro)
                        return
                    }
                    app.shared.transition_pomodoro(pomodoro, nextStage)
                },
                on_cancel: () => {}
            })
        },
        update_state(app, desiredState, pomodoro) {
            const currentStage = app.shared.get_stage_by_pomodoro(pomodoro)
            if (!currentStage) {
                return
            }

            if (desiredState === 'running') {
                if (currentStage.state === 'running') {
                    return
                }
                const runningStageName = currentStage.cycle === 'focus' ? 'focus_running' : 'breaking_running'
                app.shared.pause_other_running_pomodoros(pomodoro)
                app.shared.transition_pomodoro(pomodoro, runningStageName)
                pomodoro.state = 'running'
                return
            }

            if (desiredState === 'paused') {
                if (currentStage.state !== 'running') {
                    return
                }
                const pausedStageName = currentStage.cycle === 'focus' ? 'focus_paused' : 'breaking_paused'
                app.shared.transition_pomodoro(pomodoro, pausedStageName)
                pomodoro.state = 'paused'
                return
            }

            if (desiredState === 'finished') {
                if (currentStage.state !== 'running') {
                    return
                }
                const finishedStageName = currentStage.cycle === 'focus' ? 'focus_finished' : 'breaking_finished'
                app.shared.transition_pomodoro(pomodoro, finishedStageName)
                pomodoro.state = 'finished'
            }
        }
    }
}

function createArchivedTab() {
    return {
        meta: {
            id: 'archived',
            label: 'Archived',
            is_blinking: false
        },
        state: {},
        restore(app, pomodoro) {
            app.shared.restore_archived_pomodoro(pomodoro)
        },
        delete(app, pomodoro) {
            app.shared.delete_archived_pomodoro(pomodoro)
        }
    }
}

function createDoneTab() {
    return {
        meta: {
            id: 'done',
            label: 'Done',
            is_blinking: false
        },
        state: {}
    }
}

function createConfigsTab() {
    return {
        meta: {
            id: 'configs',
            icon: 'cog',
            extra_class: 'ml-auto',
            is_blinking: false
        },
        state: {}
    }
}

export default function createPomodoroTabs() {
    const home = createHomeTab()
    const archived = createArchivedTab()
    const done = createDoneTab()
    const configs = createConfigsTab()

    return {
        home,
        archived,
        done,
        configs,
        items: [home.meta, archived.meta, done.meta, configs.meta]
    }
}
